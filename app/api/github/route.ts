import { Octokit } from "octokit";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) return NextResponse.json({ error: "Username is required" }, { status: 400 });

  const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

  try {
    const [eventsRes, reposRes] = await Promise.all([
      octokit.rest.activity.listPublicEventsForUser({ username, per_page: 20 }),
      octokit.rest.repos.listForUser({ username, sort: "updated", per_page: 100 })
    ]);

    const events = eventsRes.data;
    const repos = reposRes.data;

    const quests = events.map(event => {
      let message = "Explored the digital realm";
      if (event.type === "PushEvent") {
        const payload = event.payload as any;
        message = payload.commits?.[0]?.message || "Pushed new code";
      } else if (event.type === "CreateEvent") {
        message = "Founded a new kingdom";
      }
      return { message, repo: event.repo.name, type: event.type };
    });

    const languages: Record<string, number> = {};
    let totalStars = 0;

    repos.forEach(repo => {
      totalStars += repo.stargazers_count || 0;
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    return NextResponse.json({
      quests,
      repos,
      stats: {
        languages,
        totalStars,
        repoCount: repos.length
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}