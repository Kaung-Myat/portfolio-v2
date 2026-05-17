import Groq from "groq-sdk";
import type { ChatMessage } from "@/src/types";

const SYSTEM_PROMPT = `You are an AI assistant for Kaung Mrat Thu's portfolio website.
Answer questions about him in a friendly, professional tone.
Only answer questions related to Kaung Mrat Thu.
For unrelated questions, say "I can only answer questions about Kaung Mrat Thu."

Here is everything you know about him:

NAME: Kaung Mrat Thu 
ROLE: Frontend & Mobile Developer
COMPANY: Brainwave Data (current)
LOCATION: Yangon, Myanmar
EDUCATION: Computer Science student at UCS Pyay

SKILLS:
- Mobile: Flutter, Dart, Kotlin, Android (Java/Kotlin)
- Backend: Firebase, Supabase, Express Js
- Tools: Git, Figma, Docker (basic)

EXPERIENCE:
1. Frontend & Mobile Developer at Brainwave Data (2024 - Present)
   - Building production Flutter and Android apps
   - Shipping end-to-end mobile features
   
2. CS Student at UCS Pyay (2021 - Present)
   - Built Student Registration System as capstone project

PROJECTS:

1. g_tester - Open source Flutter/Dart package on pub.dev.
   Uses AI to automatically generate unit tests for Flutter projects.


OPEN SOURCE: Published g_tester on pub.dev, available to the Flutter community.
INTERESTS: Flutter, AI tooling, open source, mobile architecture, Clean Architecture with Riverpod.`;

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return new Response(
      "GROQ_API_KEY is not set. Add it to .env.local and restart the dev server.",
      { status: 500 },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body.", { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return new Response("messages is required.", { status: 400 });
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          stream: true,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          ],
        });

        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) controller.enqueue(encoder.encode(delta));
        }
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(
          encoder.encode(
            `\n\nSorry — something went wrong reaching the AI. (${message})`,
          ),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
