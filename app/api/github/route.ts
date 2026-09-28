import { profile } from "@/src/data/profile";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const GITHUB_API_VERSION = "2022-11-28";
const REVALIDATE_SECONDS = 3600;

const GITHUB_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

interface PublicUserResponse {
  login: string;
  public_repos: number;
  followers: number;
}

interface ContributionData {
  total: number;
  days: number[];
}

interface GraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              contributionCount: number;
              date: string;
            }>;
          }>;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
}

export const revalidate = 3600;

function githubHeaders() {
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "kaung-mrat-thu-portfolio",
    "X-GitHub-Api-Version": GITHUB_API_VERSION,
  };
}

async function fetchPublicUser(username: string): Promise<PublicUserResponse> {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: githubHeaders(),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`GitHub REST API returned ${response.status}`);
  }

  return response.json() as Promise<PublicUserResponse>;
}

async function fetchGraphQLContributions(
  username: string,
  token: string,
): Promise<ContributionData> {
  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      ...githubHeaders(),
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: GITHUB_QUERY,
      variables: { username },
    }),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL API returned ${response.status}`);
  }

  const json = (await response.json()) as GraphQLResponse;
  const calendar =
    json.data?.user?.contributionsCollection?.contributionCalendar;

  if (!calendar || json.errors?.length) {
    throw new Error(json.errors?.[0]?.message ?? "Contribution data unavailable");
  }

  const days = calendar.weeks.flatMap((week) =>
    week.contributionDays.map((day) => day.contributionCount),
  );

  return {
    total: calendar.totalContributions,
    days: days.slice(-364),
  };
}

async function fetchPublicContributions(
  username: string,
): Promise<ContributionData> {
  const response = await fetch(
    `https://github.com/users/${username}/contributions`,
    {
      headers: { "User-Agent": "kaung-mrat-thu-portfolio" },
      next: { revalidate: REVALIDATE_SECONDS },
    },
  );

  if (!response.ok) {
    throw new Error(`GitHub contribution page returned ${response.status}`);
  }

  const html = await response.text();
  const days: Array<{ date: string; count: number }> = [];
  const dayPattern =
    /(<td\b[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*><\/td>)\s*<tool-tip\b[^>]*>([^<]*)<\/tool-tip>/g;

  for (const match of html.matchAll(dayPattern)) {
    const date = match[1].match(/\bdata-date="([^"]+)"/)?.[1];
    if (!date) continue;

    const countMatch = match[2].match(/([\d,]+) contributions?/i);
    const count = countMatch
      ? Number.parseInt(countMatch[1].replaceAll(",", ""), 10)
      : 0;

    days.push({ date, count });
  }

  if (days.length === 0) {
    throw new Error("GitHub contribution calendar markup was not recognized");
  }

  const orderedDays = days
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-364)
    .map((day) => day.count);

  return {
    total: orderedDays.reduce((sum, count) => sum + count, 0),
    days: orderedDays,
  };
}

async function fetchContributions(username: string): Promise<ContributionData> {
  try {
    return await fetchPublicContributions(username);
  } catch (publicError) {
    const token = process.env.GITHUB_TOKEN;

    if (token) {
      return await fetchGraphQLContributions(username, token);
    }

    throw publicError;
  }
}

export async function GET() {
  const githubUrl =
    profile.socials.find((social) => social.label === "GitHub")?.href ?? "";
  const username = githubUrl
    .replace(/^https:\/\/github\.com\//, "")
    .replace(/\/$/, "");

  try {
    const [user, contributions] = await Promise.all([
      fetchPublicUser(username),
      fetchContributions(username),
    ]);

    return Response.json(
      {
        contributions: contributions.total,
        repos: user.public_repos,
        followers: user.followers,
        contributionDays: contributions.days,
        username: user.login,
      },
      {
        headers: {
          "Cache-Control":
            "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return Response.json(
      { error: message },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
