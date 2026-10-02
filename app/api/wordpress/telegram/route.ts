import { timingSafeEqual } from "node:crypto";
import { absoluteUrl } from "@/src/lib/site";

export const runtime = "nodejs";

const WORDPRESS_SITE =
  process.env.WORDPRESS_SITE ?? "kaungmyatthuvercel.wordpress.com";
const WORDPRESS_API_URL = `https://public-api.wordpress.com/wp/v2/sites/${WORDPRESS_SITE}`;

interface WordPressWebhookPost {
  id: number;
  slug: string;
  status: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
}

interface TelegramResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
}

interface TelegramMessage {
  message_id: number;
}

interface PublicationRow {
  telegram_message_id: number;
}

class TelegramApiError extends Error {
  constructor(public readonly description: string) {
    super(description);
  }
}

function secureCompare(actual: string | null, expected: string) {
  if (!actual) return false;
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

function decodeHtml(value: string) {
  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    hellip: "…",
    ldquo: "“",
    lsquo: "‘",
    lt: "<",
    mdash: "—",
    nbsp: " ",
    ndash: "–",
    quot: '"',
    rdquo: "”",
    rsquo: "’",
  };

  return value.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);/gi, (entity, code) => {
    if (code.startsWith("#x")) {
      return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
    }
    if (code.startsWith("#")) {
      return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
    }
    return namedEntities[code.toLowerCase()] ?? entity;
  });
}

function textFromHtml(value: string) {
  return decodeHtml(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function escapeTelegramHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function summarize(post: WordPressWebhookPost) {
  const excerpt =
    textFromHtml(post.excerpt.rendered) || textFromHtml(post.content.rendered);
  return excerpt.length > 650
    ? `${excerpt.slice(0, 647).trimEnd()}...`
    : excerpt;
}

async function telegramRequest<T>(
  token: string,
  method: "sendMessage" | "editMessageText",
  body: Record<string, unknown>,
) {
  const response = await fetch(
    `https://api.telegram.org/bot${token}/${method}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );
  const data = (await response.json()) as TelegramResponse<T>;

  if (!response.ok || !data.ok || data.result === undefined) {
    throw new TelegramApiError(data.description ?? "Telegram request failed");
  }
  return data.result;
}

function supabaseHeaders(secretKey: string, includeJson = false) {
  return {
    apikey: secretKey,
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
  };
}

async function getPublication(
  supabaseUrl: string,
  secretKey: string,
  wordpressPostId: number,
) {
  const params = new URLSearchParams({
    select: "telegram_message_id",
    wordpress_post_id: `eq.${wordpressPostId}`,
    limit: "1",
  });
  const response = await fetch(
    `${supabaseUrl}/rest/v1/telegram_publications?${params}`,
    {
      headers: supabaseHeaders(secretKey),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase lookup failed with status ${response.status}`);
  }
  const rows = (await response.json()) as PublicationRow[];
  return rows[0] ?? null;
}

async function savePublication(
  supabaseUrl: string,
  secretKey: string,
  post: WordPressWebhookPost,
  telegramMessageId: number,
) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/telegram_publications?on_conflict=wordpress_post_id`,
    {
      method: "POST",
      headers: {
        ...supabaseHeaders(secretKey, true),
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        wordpress_post_id: post.id,
        slug: post.slug,
        telegram_message_id: telegramMessageId,
        updated_at: new Date().toISOString(),
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase write failed with status ${response.status}`);
  }
}

async function getPublishedPost(postId: number) {
  const response = await fetch(
    `${WORDPRESS_API_URL}/posts/${encodeURIComponent(postId)}`,
    { cache: "no-store" },
  );
  if (!response.ok) return null;

  const post = (await response.json()) as WordPressWebhookPost;
  return post.status === "publish" ? post : null;
}

export async function POST(request: Request) {
  const webhookSecret = process.env.WORDPRESS_WEBHOOK_SECRET;
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (
    !webhookSecret ||
    !telegramToken ||
    !telegramChatId ||
    !supabaseUrl ||
    !supabaseSecretKey
  ) {
    return Response.json(
      { error: "Telegram webhook is not configured" },
      { status: 503 },
    );
  }

  const suppliedSecret = new URL(request.url).searchParams.get("secret");
  if (!secureCompare(suppliedSecret, webhookSecret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid webhook body" }, { status: 400 });
  }

  const postId = Number(formData.get("ID"));
  if (!Number.isSafeInteger(postId) || postId <= 0) {
    return Response.json(
      { error: "Invalid WordPress post ID" },
      { status: 400 },
    );
  }

  const post = await getPublishedPost(postId);
  if (!post) {
    return Response.json(
      { error: "Published WordPress post not found" },
      { status: 404 },
    );
  }

  const articleUrl = absoluteUrl(`/blog/${post.slug}`);
  const title = textFromHtml(post.title.rendered);
  const description = summarize(post);
  const message = [
    `<b>${escapeTelegramHtml(title)}</b>`,
    description ? escapeTelegramHtml(description) : null,
    `<a href="${escapeTelegramHtml(articleUrl)}">ဆက်ဖတ်ရန်</a>`,
  ]
    .filter(Boolean)
    .join("\n\n");
  const commonTelegramBody = {
    chat_id: telegramChatId,
    text: message,
    parse_mode: "HTML",
    link_preview_options: { is_disabled: false, url: articleUrl },
  };

  try {
    const publication = await getPublication(
      supabaseUrl,
      supabaseSecretKey,
      post.id,
    );

    if (publication) {
      try {
        await telegramRequest<TelegramMessage>(
          telegramToken,
          "editMessageText",
          {
            ...commonTelegramBody,
            message_id: publication.telegram_message_id,
          },
        );
      } catch (error) {
        if (
          error instanceof TelegramApiError &&
          error.description.toLowerCase().includes("message is not modified")
        ) {
          return Response.json({ ok: true, action: "unchanged", postId });
        }
        if (
          !(error instanceof TelegramApiError) ||
          !error.description.toLowerCase().includes("message to edit not found")
        ) {
          throw error;
        }

        const replacement = await telegramRequest<TelegramMessage>(
          telegramToken,
          "sendMessage",
          commonTelegramBody,
        );
        await savePublication(
          supabaseUrl,
          supabaseSecretKey,
          post,
          replacement.message_id,
        );
        return Response.json({ ok: true, action: "replaced", postId });
      }

      await savePublication(
        supabaseUrl,
        supabaseSecretKey,
        post,
        publication.telegram_message_id,
      );
      return Response.json({ ok: true, action: "updated", postId });
    }

    const sentMessage = await telegramRequest<TelegramMessage>(
      telegramToken,
      "sendMessage",
      commonTelegramBody,
    );
    await savePublication(
      supabaseUrl,
      supabaseSecretKey,
      post,
      sentMessage.message_id,
    );
    return Response.json({ ok: true, action: "sent", postId });
  } catch (error) {
    console.error(
      "WordPress to Telegram webhook failed",
      error instanceof Error ? error.message : "Unknown error",
    );
    return Response.json(
      { error: "Unable to publish to Telegram" },
      { status: 502 },
    );
  }
}
