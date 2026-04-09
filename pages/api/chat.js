export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages' });
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.FREE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing API key. Set ANTHROPIC_API_KEY or FREE_API_KEY.' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are MindPause, a warm and grounded mental wellness companion for working adults in India.
You speak in short, clear, human sentences — not clinical or overly cheerful.
You understand Indian work culture: long hours, family pressure, job insecurity, manager politics.
You help people process stress, burnout, and anxiety from work.
Never diagnose. Always validate feelings first, then gently offer one practical suggestion.
Keep responses under 4 sentences.
If someone seems in crisis, recommend iCall (9152987821) or Vandrevala Foundation (1860-2662-345).`,
        messages,
      }),
    });

    const data = await response.json();
    const reply = data.content?.map(b => b.text || '').join('') || "I'm here. Tell me more.";
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Something went wrong on my end. But I'm still here — try again." });
  }
}
