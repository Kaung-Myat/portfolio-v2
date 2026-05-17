import { profile } from "@/src/data/profile";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

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
      repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}, ownerAffiliations: OWNER) {
        totalCount
      }
      followers {
        totalCount
      }
    }
  }
`;

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface GitHubData {
  contributionsCollection: {
    contributionCalendar: ContributionCalendar;
  };
  repositories: {
    totalCount: number;
  };
  followers: {
    totalCount: number;
  };
}

export const dynamic = "force-dynamic";

export async function GET() {
  const githubUrl = profile.socials.find((s) => s.label === "GitHub")?.href || "";
  const username = githubUrl.replace("https://github.com/", "");

  if (!process.env.GITHUB_TOKEN) {
    return new Response(
      JSON.stringify({
        error: "GITHUB_TOKEN not configured",
        fallback: true,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query: GITHUB_QUERY,
        variables: { username },
      }),
    });

    const status = response.status;
    const responseText = await response.text();

    if (status !== 200) {
      console.error("GitHub API error:", status, responseText);
      throw new Error(`GitHub API error: ${status} - ${responseText}`);
    }

    const json = JSON.parse(responseText);

    if (json.errors) {
      console.error("GraphQL errors:", json.errors);
      throw new Error(json.errors[0].message);
    }

    if (!json.data?.user) {
      console.error("No user data:", json);
      throw new Error(`User "${username}" not found`);
    }

    const user = json.data.user;
    const contributionsCollection = user.contributionsCollection;
    const contributionCalendar = contributionsCollection?.contributionCalendar;

    const contributionDays: number[] = [];
    if (contributionCalendar?.weeks) {
      contributionCalendar.weeks.forEach((week: ContributionWeek) => {
        if (week.contributionDays) {
          week.contributionDays.forEach((day: ContributionDay) => {
            contributionDays.push(day.contributionCount);
          });
        }
      });
    }

    const result = {
      contributions: contributionCalendar?.totalContributions || 0,
      repos: user.repositories?.totalCount || 0,
      followers: user.followers?.totalCount || 0,
      contributionDays: contributionDays.slice(-364),
      username,
    };

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        error: message,
        fallback: true,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}