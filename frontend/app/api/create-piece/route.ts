import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "route ok" });
}

export async function POST(req: Request) {
  try {
    const apiBaseUrl = process.env.API_BASE_URL;

    if (!apiBaseUrl) {
      return NextResponse.json(
        { detail: "API_BASE_URL is not set." },
        { status: 500 }
      );
    }

    const body = await req.json();

    const res = await fetch(`${apiBaseUrl}/create-piece`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const raw = await res.text();

    return new Response(raw, {
      status: res.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        detail:
          error instanceof Error ? error.message : "Frontend API route error",
      },
      { status: 500 }
    );
  }
}