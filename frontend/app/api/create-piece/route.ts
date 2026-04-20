export async function GET() {
  return Response.json({ status: "route ok" });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch("http://127.0.0.1:8000/create-piece", {
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
    return Response.json(
      {
        detail:
          error instanceof Error
            ? error.message
            : "Frontend API route error",
      },
      { status: 500 }
    );
  }
}