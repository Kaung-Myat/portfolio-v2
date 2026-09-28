import { getGitHubStats } from "@/src/lib/github";

export const revalidate = 3600;

export async function GET() {
  try {
    return Response.json(await getGitHubStats(), {
      headers: {
        "Cache-Control":
          "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
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
