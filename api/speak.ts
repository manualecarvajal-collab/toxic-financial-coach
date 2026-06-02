import type { VercelRequest, VercelResponse } from '@vercel/node';

const TTS_API_KEY = process.env.TTS_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo POST' });
  }

  if (!TTS_API_KEY) {
    return res.status(500).json({ error: 'TTS_API_KEY no configurada' });
  }

  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.length > 2000) {
    return res.status(400).json({ error: 'Texto inválido' });
  }

  try {
    const ttsRes = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${TTS_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: 'es-US',
            name: 'es-US-Wavenet-B',
            ssmlGender: 'MALE'
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 1.2,
            pitch: 2.5
          }
        })
      }
    );

    if (!ttsRes.ok) {
      const err = await ttsRes.text();
      console.error('TTS API error:', ttsRes.status, err);
      return res.status(500).json({ error: 'TTS falló' });
    }

    const data = await ttsRes.json();
    return res.status(200).json({ audio: data.audioContent });
  } catch (err) {
    console.error('Error en TTS:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}
