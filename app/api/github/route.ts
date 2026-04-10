import { Octokit } from "octokit";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  const token = process.env.GITHUB_ACCESS_TOKEN;

  if (!token) {
    console.error("CRITICAL ERROR: GITHUB_ACCESS_TOKEN is missing from environment variables.");
  }

  const octokit = new Octokit({
    auth: token
  });

  try {
    const { data: events } = await octokit.rest.activity.listPublicEventsForUser({
      username,
      per_page: 30,
    });

    const pushes = events.filter(event => event.type === "PushEvent");
    
    const commits = pushes.flatMap(push => {
      const payload = push.payload as any;
      if (!payload.commits) return [];
      return payload.commits.map((commit: any) => ({
        message: commit.message,
        repo: push.repo.name,
        date: push.created_at
      }));
    });

    return NextResponse.json(commits);
  } catch (error: any) {
    console.error("GITHUB API ERROR:", error.status, error.message);
    
    return NextResponse.json(
      { error: error.message || "Failed to fetch from GitHub" }, 
      { status: error.status || 500 }
    );
  }
}