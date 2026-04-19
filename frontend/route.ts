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

    const data = await res.json();

    return Response.json(data, { status: res.status });
  } catch {
    return Response.json(
      { detail: "Frontend API route error" },
      { status: 500 }
    );
  }
}