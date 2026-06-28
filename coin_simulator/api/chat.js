export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { prompt, systemPrompt } = req.body
  const apiKey = process.env.GEMINI_API_KEY
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt || '당신은 감정적인 개인 투자자입니다.' }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 256, temperature: 0.9 },
      }),
    })
    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    res.json({ text })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
