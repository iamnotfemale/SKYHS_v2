import { GoogleGenAI } from '@google/genai'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { prompt, systemPrompt } = req.body
  const apiKey = process.env.GEMINI_API_KEY

  try {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      config: {
        systemInstruction: systemPrompt || '당신은 감정적인 개인 투자자입니다.',
        maxOutputTokens: 256,
        temperature: 0.9,
      },
      contents: prompt,
    })
    const text = response.text ?? ''
    res.json({ text })
  } catch (e) {
    console.error('Gemini error:', e.message)
    res.status(200).json({ text: '', error: e.message })
  }
}
