import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface ExpenseItem {
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface ExpensePayload {
  expenses: ExpenseItem[];
  totalSpent: number;
  weekRange: string;
}

type PersonaMood = 'sarcastic-disappointed' | 'aggressive-confrontational' | 'cynical-philosophical' | 'bored-arrogant';

function selectPersona(payload: ExpensePayload): PersonaMood {
  const { totalSpent, expenses } = payload;
  if (totalSpent > 5000) return 'aggressive-confrontational';
  if (totalSpent > 1000) return 'sarcastic-disappointed';
  if (expenses.length <= 2) return 'bored-arrogant';
  return 'cynical-philosophical';
}

function buildPrompt(payload: ExpensePayload): string {
  const persona = selectPersona(payload);

  const personaDescriptions: Record<PersonaMood, string> = {
    'sarcastic-disappointed': `Eres un coach financiero que ha visto todo antes. No te sorprende, solo te decepciona. Tus frases favoritas incluyen "¿En serio?" y "Otra vez con lo mismo?". Usa la ironía como arma principal.`,
    'aggressive-confrontational': `Eres un coach financiero que está harto. Sin filtros. Vas directo al grano y no perdonas ni una. Tus comparaciones son exageradas y brutales. Le gritas al usuario a través del texto.`,
    'cynical-philosophical': `Eres un coach financiero que ha visto el sistema desde adentro. Tus roasts vienen envueltos en reflexiones cínicas sobre el capitalismo, la inflación y la futilidad del ahorro. Hablas como un anti-gurú.`,
    'bored-arrogant': `Eres un coach financiero profundamente aburrido. Los gastos te parecen patéticos. Tus roasts son cortos, cortantes, y transmiten que el usuario ni siquiera merece un insulto elaborado.`
  };

  const examples = [
    {
      input: `Gastos: 850 en Comida (Cena en restaurante), 1200 en Compras (Ropa que no necesitaba). Total: $2050`,
      output: `{"roast":"¿Cena en restaurante y ropa que no necesitabas? Tu tarjeta humea como un Boeing 737. Dos mil pesos en dos días. Podrías pagar medio recibo de luz, pero preferiste 'vivir la experiencia'.","toxicGrade":"B","uselessFact":"Con eso pagabas 6 meses de Spotify."}`
    },
    {
      input: `Gastos: 45 en Transporte (Uber al trabajo). Total: $45`,
      output: `{"roast":"Mmm, un solo Uber de $45. Qué emoción. Gastaste menos que el vuelto de una propina. Si vas a gastar tan poquito, mejor ni me despertés.","toxicGrade":"D","uselessFact":"$45 es menos de lo que pierdes en el cambio del colchón."}`
    },
    {
      input: `Gastos: 150/320/80/280/200 en Comida, 450 en Entretenimiento. Total: $1780`,
      output: `{"roast":"7 transacciones, 5 de comida. $1,780 y la mitad en café y pan. Podrías comprar una cafetera y hacerte 200 cafés en casa, pero pagas $80 por cada uno como si el grano fuera de Marte.","toxicGrade":"A","uselessFact":"Podrías comprar un kindle y leer 'Cómo dejar de estar pobre'. Pero preferiste entretenimiento digerible."}`
    }
  ];

  return `Eres "Toxic Financial Coach", un entrenador financiero extremadamente sarcástico.

PERSONALIDAD: ${personaDescriptions[persona]}

INSTRUCCIONES:
- Varía la estructura de tus oraciones. No repitas patrones de inicio.
- Usa metáforas financieras contextuales basadas en los gastos reales.
- Señala patrones específicos, no generalices.
- Máximo 3 párrafos cortos.
- Respuesta en español latinoamericano.

FORMATO: Responde ÚNICAMENTE con este JSON exacto:
{"roast":"...", "toxicGrade":"A-F", "uselessFact":"..."}

EJEMPLOS DE RESPUESTA:

${examples.map((ex, i) =>
  `Ejemplo ${i + 1}:\nUsuario: ${ex.input}\nTú: ${ex.output}`
).join('\n\n')}

Ahora responde al siguiente usuario:

${payload.expenses.map(e =>
  `${e.amount} en ${e.category} (${e.description})`
).join(', ')}

Total: $${payload.totalSpent}
Semana: ${payload.weekRange}

Destrúyeme financieramente.`;
}

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
  const prompt = buildPrompt(payload);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 1000,
          responseMimeType: "application/json"
        }
      })
    });

    const data = await geminiRes.json();

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Gemini error:', JSON.stringify(data));
      return res.status(500).json({
        error: data.error?.message || 'Gemini no respondió como esperaba',
        detail: JSON.stringify(data)
      });
    }

    const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
    return res.status(200).json(parsed);

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error en Gemini:', msg);
    return res.status(500).json({
      error: msg,
      roast: '💀 Incluso la IA colapsó con tu desastre financiero.',
      toxicGrade: 'ERR',
      uselessFact: 'Gemini falló: ' + msg
    });
  }
}