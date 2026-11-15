export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ detail: 'Method not allowed' });
  const key = process.env.GROQ_API_KEY;
  if (!key) return res.status(503).json({ detail: 'Groq is not configured. Add GROQ_API_KEY in Vercel → Project Settings → Environment Variables, then redeploy.' });
  const body = req.body || {};
  const prompt = String(body.prompt || '').slice(0, 6000);
  const lat = Number(body.latitude), lon = Number(body.longitude);
  if (prompt.length < 5 || !Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180) {
    return res.status(400).json({ detail: 'Provide a prompt and valid latitude/longitude.' });
  }
  try {
    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        temperature: 0.35, max_tokens: 1000,
        messages: [
          { role: 'system', content: 'You are SELENE, a careful lunar mission planning research assistant. Never fabricate NASA measurements or claim a landing site is safe. Clearly distinguish verified facts, assumptions, and unknowns. Do not imply that you queried live LOLA, Diviner, or illumination raster data unless supplied. Explain uncertainty and give practical next steps. Educational only, not flight-certified.' },
          { role: 'user', content: `Candidate: ${String(body.site || 'candidate').slice(0,120)}; coordinates: ${lat}, ${lon}. Request: ${prompt}` }
        ]
      })
    });
    const data = await upstream.json();
    if (!upstream.ok) return res.status(502).json({ detail: data?.error?.message || `Groq returned HTTP ${upstream.status}` });
    const answer = data?.choices?.[0]?.message?.content;
    if (!answer) return res.status(502).json({ detail: 'Groq returned an empty response.' });
    return res.status(200).json({ mode: 'groq', answer });
  } catch (e) {
    return res.status(502).json({ detail: 'Could not reach Groq. Check deployment logs and try again.' });
  }
}
