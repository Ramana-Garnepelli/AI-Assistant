export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages' });
  }

  try {
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.FREE_API_KEY;
    if (!openaiKey && !anthropicKey) {
      return res.status(500).json({ error: 'Missing API key. Set OPENAI_API_KEY, ANTHROPIC_API_KEY, or FREE_API_KEY.' });
    }

    const systemMessage = `You are MindPause, a warm and grounded mental wellness companion for working adults in India.
You speak in short, clear, human sentences — not clinical or overly cheerful.
You understand Indian work culture: long hours, family pressure, job insecurity, manager politics.
You help people process stress, burnout, and anxiety from work.
Never diagnose. Always validate feelings first, then gently offer one practical suggestion.
Keep responses under 4 sentences.
If someone seems in crisis, recommend iCall (9152987821) or Vandrevala Foundation (1860-2662-345).`;

    let response;
    let data;
    let reply;

    if (openaiKey) {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'system', content: systemMessage }, ...messages],
          max_tokens: 1000,
          temperature: 0.8,
        }),
      });

      data = await response.json();
      if (!response.ok) {
        console.error('OpenAI API error', response.status, data);
        const errorMessage = data?.error?.message || data?.message || "Something went wrong on my end. But I'm still here — try again.";
        return res.status(500).json({ reply: `Chat API error: ${errorMessage}` });
      }

      reply = data.choices?.map(choice => choice.message?.content || '')?.join(' ').trim();
    } else {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemMessage,
          messages,
        }),
      });

      data = await response.json();
      if (!response.ok) {
        console.error('Anthropic API error', response.status, data);
        const errorMessage = data?.error?.message || data?.message || "Something went wrong on my end. But I'm still here — try again.";
        return res.status(500).json({ reply: `Chat API error: ${errorMessage}` });
      }

      reply = data.completion?.content?.map(item => item.text || '')?.join('') ||
        data.completion?.content ||
        data.completion?.text ||
        data.response;
    }

    res.status(200).json({ reply: reply || "I'm here. Tell me more." });

    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Something went wrong on my end. But I'm still here — try again." });
  }
}
