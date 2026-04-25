export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "No email provided" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Analyze this email and determine if it is spam or legitimate. Respond ONLY with valid JSON in this exact format with no markdown or backticks:
{
  "verdict": "SPAM" or "LEGITIMATE",
  "confidence": number from 0-100,
  "score": number from 0-100 where 100 = definitely spam,
  "reasons": ["reason1", "reason2", "reason3"],
  "summary": "one sentence explanation"
}

EMAIL TO ANALYZE:
${email}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic error:", data);
      return res.status(500).json({ error: "Anthropic API error", detail: data });
    }

    const text = data.content[0].text;
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: err.message });
  }
}
