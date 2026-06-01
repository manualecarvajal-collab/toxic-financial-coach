import type { VercelRequest, VercelResponse } from '@vercel/node';

// Esta función corre en el edge de Vercel - la API Key NUNCA toca el cliente
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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
- Usa un lenguaje sarcástico y punzante (en español latino).
- Señala patrones de gasto ridículos.
- Compara sus gastos con cosas absurdas (ej: "Podrías haber comprado 3 Bitcoin en 2010").
- Incluye al menos 1 sugerencia sarcástica pero útil.
- Máximo 3 párrafos.
- NO seas grosero sin razón - el insulto debe venir de los datos reales.

RESPONDE EN JSON:
{
  "roast": "El texto del roast aquí...",
  "toxicGrade": "D" ("A"=legendario malgastador, "F"=tiene esperanza),
  "uselessFact": "Un dato absurdo relacionado (ej: Eso son 47 tacos de pastor)"
}`;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo POST, campeón' });
  }

  if (!OPENAI_API_KEY) {
    return res.status(500).json({
      roast: '⚠️ No configuraste la API Key. Tu wallet está a salvo... por ahora.',
      toxicGrade: '?',
      uselessFact: 'El coach necesita su dosis de OpenAI'
    });
  }

  const payload: ExpensePayload = req.body;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Aquí están mis gastos de la semana (${payload.weekRange}):\n\n${JSON.stringify(payload.expenses, null, 2)}\n\nTotal gastado: $${payload.totalSpent}\n\nDestrúyeme financieramente.` }
        ],
        temperature: 0.9,
        max_tokens: 500
      })
    });

    const data = await openaiRes.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('OpenAI no respondió como esperaba');
    }

    // Intentar parsear el JSON de la respuesta
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      roast: content,
      toxicGrade: 'C',
      uselessFact: '🤷'
    };

    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Error llamando a OpenAI:', error);
    return res.status(200).json({
      roast: '💀 Incluso la IA se quedó sin palabras ante tu nivel de gasto. (Error temporal, intenta de nuevo)',
      toxicGrade: 'ERR',
      uselessFact: 'La IA colapsó procesando tu irresponsabilidad financiera'
    });
  }
}