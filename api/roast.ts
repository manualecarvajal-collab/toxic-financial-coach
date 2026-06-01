import type { VercelRequest, VercelResponse } from '@vercel/node';

// La API Key de Gemini se configura en Vercel
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface ExpensePayload {
  expenses: {
    amount: number;
    category: string;
    description: string;
    date: string;
  }[];
  totalSpent: number;
  weekRange: string;
}

const SYSTEM_PROMPT = `Eres "Toxic Financial Coach", un entrenador financiero extremadamente sarcástico, pasivo-agresivo y brutalmente honesto.

Tu misión: Analizar los gastos semanales del usuario y generar una crítica hiriente pero constructiva.

REGLAS DE TONO:
- Usa un lenguaje sarcástico y punzante (en español de Latinoamérica).
- Señala patrones de gasto ridículos.
- Compara sus gastos con cosas absurdas (ej: "Con eso pagabas el internet de todo el vecindario").
- Incluye al menos 1 sugerencia sarcástica pero útil.
- Máximo 3 párrafos cortos.
- NO seas grosero sin razón - el insulto debe venir de la mala gestión del dinero.

IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido con esta estructura:
{
  "roast": "El texto del roast aquí...",
  "toxicGrade": "D" (Usa letras de A a F, donde A es gastador legendario y F es alguien que aún tiene esperanza),
  "uselessFact": "Un dato absurdo (ej: Eso equivale a 47 cafés que no necesitabas)"
}`;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo POST, campeón' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      roast: '⚠️ No configuraste la GEMINI_API_KEY. Tu dinero está a salvo... de momento.',
      toxicGrade: '?',
      uselessFact: 'El coach necesita su dosis de Google Gemini'
    });
  }

  const payload: ExpensePayload = req.body;
  const userContent = `Aquí están mis gastos de la semana (${payload.weekRange}):\n\n${JSON.stringify(payload.expenses, null, 2)}\n\nTotal gastado: $${payload.totalSpent}\n\nDestrúyeme financieramente.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${SYSTEM_PROMPT}\n\nUsuario: ${userContent}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 1000,
          responseMimeType: "application/json" // Forzamos respuesta JSON
        }
      })
    });

    const data = await geminiRes.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Respuesta inesperada de Gemini:', JSON.stringify(data));
      throw new Error('Gemini no respondió como esperaba');
    }

    const content = data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(content);

    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Error llamando a Gemini:', error);
    return res.status(200).json({
      roast: '💀 Incluso la IA de Google se quedó en shock con tu irresponsabilidad. (Error técnico, intenta de nuevo)',
      toxicGrade: 'ERR',
      uselessFact: 'Gemini colapsó procesando tu desastre financiero'
    });
  }
}