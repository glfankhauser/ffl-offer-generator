export async function POST(request) {
  const { prompt } = await request.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json(
        { error: `API error (${response.status}): ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    // Strip em/en dashes
    const cleaned = text
      .replace(/[\u2013\u2014]/g, "")
      .replace(/--/g, "");

    return Response.json({ text: cleaned });
  } catch (err) {
    return Response.json(
      { error: "Server error: " + err.message },
      { status: 500 }
    );
  }
}
