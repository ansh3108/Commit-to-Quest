import { Octokit } from "octokit";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) return NextResponse.json({ error: "Username is required" }, { status: 400 });

  const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

  try {
    const { data: events } = await octokit.rest.activity.listPublicEventsForUser({
      username,
      per_page: 30,
    });

    const parsedEvents = events.map(event => {
      let message = "Explored the digital realm";
      
      if (event.type === "PushEvent") {
        const payload = event.payload as any;
        message = payload.commits?.[0]?.message || "Pushed new secrets";
      } else if (event.type === "CreateEvent") {
        message = "Founded a new kingdom (Repo)";
      } else if (event.type === "WatchEvent") {
        message = "Gained inspiration from a fellow traveler";
      }

      return {
        message: message,
        repo: event.repo.name,
        type: event.type
      };
    });

    return NextResponse.json(parsedEvents);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}