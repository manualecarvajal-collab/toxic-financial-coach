import type { Expense } from './db';

export interface RoastResponse {
  roast: string;
  toxicGrade: string;
  uselessFact: string;
  _mode?: 'ai' | 'mock';
  _debug?: string;
}

interface RoastPayload {
  expenses: {
    amount: number;
    category: string;
    description: string;
    date: string;
  }[];
  totalSpent: number;
  weekRange: string;
}

// Respuestas cuando no hay gastos esta semana
const EMPTY_ROASTS: RoastResponse[] = [
  {
    roast: "¿Gastos? No tienes gastos. ¿Eres un monje budista o solo estás muerto financieramente? Sal a gastar, cobarde.",
    toxicGrade: "A",
    uselessFact: "Tu wallet está más intacta que tu vida social."
  },
  {
    roast: "Cero gastos. Qué aburrido. El dinero está para gastarlo, no para mirarlo. Anda, date un gusto antes de que la inflación te lo robe.",
    toxicGrade: "A+",
    uselessFact: "Dicen que el que no gasta, no vive. Tú debes ser inmortal entonces."
  },
  {
    roast: "Ni un solo gasto esta semana. ¿Estás ahorrando para algo importante o solo eres pobre? Porque una cosa es ser responsable y otra muy distinta es no tener vida.",
    toxicGrade: "B",
    uselessFact: "Podrías haber gastado al menos en un café. Pero no. Nada. 0. Vacío existencial."
  },
  {
    roast: "Semana sin gastos. Felicidades, supongo. Pero oye, la felicidad no se ahorra. Si no gastas, ¿qué sentido tiene ganar dinero? Medita sobre eso.",
    toxicGrade: "A-",
    uselessFact: "La gente que no gasta vive 3 años más. Pero se sienten como 30."
  }
];

// Insultos pre-generados para modo offline / demo
const MOCK_ROASTS: RoastResponse[] = [
  {
    roast: "¿Sabes qué es más patético que tus gastos? La excusa mental que usaste para justificarlos. 'Me lo merecía' dices, mientras tu cuenta bancaria llora en una esquina. Gastaste ${total} en cosas que probablemente ni recuerdas. Espero que tu yo del futuro te perdone, porque yo no lo haré.",
    toxicGrade: "D",
    uselessFact: "Con ese dinero pudiste comprar 47 empanadas. Pero no, preferiste 'invertir en experiencias'."
  },
  {
    roast: "Oh, veo que la inflación no es tu único problema. Tu falta de autocontrol financiero es impresionante. Gastaste ${total} esta semana. ¿Estás coleccionando recibos o qué?",
    toxicGrade: "C",
    uselessFact: "Si ahorraras eso por 10 años, tendrías el enganche de un departamento. Pero claro, los caprichos son más importantes."
  },
  {
    roast: "Analicé tus gastos y tengo dos noticias: La mala es que no tienes control financiero. La buena es que aún puedes vender un riñón. Gastaste ${total} en ${count} transacciones. Tu futuro yo te va a odiar.",
    toxicGrade: "E",
    uselessFact: "Podrías haber comprado acciones de NVIDIA. Pero no, preferiste el presente. El presente es una trampa."
  },
  {
    roast: "Tu cartera me pidió que le dejara de pegar. ${total} en una semana. ¿Eres consciente de que el dinero no crece en los árboles? Bueno, quizá en los tuyos sí, porque los estás podando con cada compra.",
    toxicGrade: "D",
    uselessFact: "Eso son aproximadamente 132 viajes en metro. O 3 cenas en un restaurante elegante. Elegiste lo peor de ambos mundos."
  }
];

/**
 * Obtiene el rango de la semana actual en formato legible
 */
function getWeekRange(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return `${monday.toLocaleDateString('es-MX')} - ${sunday.toLocaleDateString('es-MX')}`;
}

/**
 * Agrupa los gastos y construye el payload para la IA
 */
function buildPayload(expenses: Expense[]): RoastPayload {
  const weekExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return expDate >= weekAgo;
  });

  return {
    expenses: weekExpenses.map(exp => ({
      amount: exp.amount,
      category: exp.category,
      description: exp.description,
      date: new Date(exp.date).toISOString()
    })),
    totalSpent: weekExpenses.reduce((acc, curr) => acc + curr.amount, 0),
    weekRange: getWeekRange()
  };
}

/**
 * Obtiene un elemento aleatorio de un array
 */
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Obtiene un roast aleatorio de los mock (para desarrollo offline)
 */
function getMockRoast(expenses: Expense[]): RoastResponse {
  const payload = buildPayload(expenses);
  const mock = getRandomItem(MOCK_ROASTS);

  return {
    roast: mock.roast
      .replaceAll('${total}', `$${payload.totalSpent.toFixed(2)}`)
      .replaceAll('${count}', payload.expenses.length.toString()),
    toxicGrade: mock.toxicGrade,
    uselessFact: mock.uselessFact
  };
}

/**
 * Servicio principal de Roasting
 * Usa el proxy de Vercel si hay API Key configurada, si no usa mock local
 */
export async function getRoast(expenses: Expense[]): Promise<RoastResponse> {
  const payload = buildPayload(expenses);

  if (payload.expenses.length === 0) {
    return { ...getRandomItem(EMPTY_ROASTS), _mode: 'mock' };
  }

  try {
    // Intentar llamar al proxy de Vercel
    const baseUrl = import.meta.env.VITE_API_URL || '';
    const response = await fetch(`${baseUrl}/api/roast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const errorInfo = `API error ${response.status}: ${errorBody.slice(0, 300)}`;
      console.error('🤖', errorInfo);
      throw new Error(errorInfo);
    }

    const result: RoastResponse = await response.json();
    result._mode = 'ai';
    return result;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido';
    console.error('🤖 Usando mock. Motivo:', msg);
    const mock = getMockRoast(expenses);
    mock._mode = 'mock';
    mock._debug = msg;
    return mock;
  }
}