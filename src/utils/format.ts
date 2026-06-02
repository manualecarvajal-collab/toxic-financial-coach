function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const TIER_COMMENTS: Record<string, ((amount: number, cat: string, desc: string) => string)[]> = {
  extreme: [
    (_a: number, c: string, d: string) => `¿${d}? Con eso pagaba la renta de un departamento. Pero claro, ${c.toLowerCase()} es más importante.`,
    (a) => `$${a.toLocaleString('es-MX')}. Sabes que hay personas que viven con eso al mes, ¿no? Bueno, tú no eres esas personas.`,
    (_a: number, _c: string, d: string) => `${d}. Suena a decisión financiera bien pensada... dijo nadie nunca.`,
    () => '¿En serio gastaste esto? Hasta a mí me dio vergüenza ajena y soy un programa.',
    (_a: number, c: string) => `Tu cuenta bancaria: "Ya no más". Tú: "Pero es que era ${c.toLowerCase()}".`,
    () => 'Si el dinero hablara, el tuyo estaría llorando. O pidiendo una orden de alejamiento.'
  ],
  high: [
    (_a: number, c: string, d: string) => `${d} en ${c.toLowerCase()}. Clásico. La deuda no se va a pagar sola, ¿verdad?`,
    (a) => `$${a.toLocaleString('es-MX')}. Podría ser peor. Podrías haber gastado el doble. Como ayer.`,
    (_a: number, _c: string, d: string) => `"${d}". Lo leí y ya me dolió la cartera.`,
    () => '¿Y luego se quejan de que no alcanza? Con estos gastos, claro que no alcanza.',
    (_a: number, c: string) => `Gastar en ${c.toLowerCase()} es como quemar dinero para calentarte. Ineficiente, pero se siente bien.`
  ],
  medium: [
    (_a: number, c: string) => `${c.toLowerCase()}. Al menos no es una suscripción que olvidaste cancelar. Eso sería peor.`,
    (a) => `$${a.toLocaleString('es-MX')}. No está mal. Podrían ser 3 gastos de ese tamaño y ya valió.`,
    (_a: number, _c: string, d: string) => `"${d}". Justificación: dudosa. Resultado: este comentario.`,
    () => 'Gasto moderado. Moderadamente estúpido, pero moderado al fin.',
    (_a: number, c: string) => `Un gasto en ${c.toLowerCase()}. No te voy a juzgar... bueno sí, un poco.`
  ],
  low: [
    (_a: number, c: string) => `${c.toLowerCase()} por dos pesos. Eso no es un gasto, es un estornudo financiero.`,
    () => 'Si todos tus gastos fueran así, no estaríamos teniendo esta conversación.',
    (_a: number, _c: string, d: string) => `"${d}". Bueno, al menos no quebraste el banco. Esta vez.`,
    () => '¿Esto es un gasto o un error de redondeo?'
  ],
  free: [
    () => 'Gratis. La única palabra bonita en el diccionario financiero.',
    () => 'Gastaste $0. ¿Eso cuenta como gasto o como respiro?',
    () => 'Finalmente, una decisión inteligente. No gastar. Aunque dudo que dure.'
  ]
};

const CATEGORY_COMMENTS: Record<string, ((amount: number, desc: string) => string)[]> = {
  'Comida': [
    (_a: number, d: string) => `${d}. Claro, porque tu cuerpo es un templo... con entrada a todos los junk food.`,
    (a) => `$${a.toLocaleString('es-MX')} en comida. Espero que al menos hayas compartido. Mentira, ojalá te haya dado indigestión.`,
    () => 'Comida: la gasolina del cuerpo. La tuya es de la más cara, como si fueras un auto de lujo.'
  ],
  'Transporte': [
    (_a: number, d: string) => `$${d}. Y pensar que podrías haber caminado. Pero no, tu comodidad ante todo.`,
    () => 'Transporte. Porque caminar es para pobres y correr es para cobardes.',
    () => 'Gasolina/uber. Básicamente pagas para moverte de un lugar a otro. Como todos. Aburrido.'
  ],
  'Entretenimiento': [
    (_a: number, d: string) => `"${d}". O como yo lo llamo: "impuesto al aburrimiento".`,
    () => 'Entretenimiento. Porque tu vida es tan vacía que necesitas pagar para llenarla.',
    (a) => `$${a.toLocaleString('es-MX')} en divertirte. Espero que hayas sonreído. Por ese precio, deberías haber llorado de la felicidad.`
  ],
  'Compras': [
    (_a: number, d: string) => `${d}. ¿Lo necesitabas? No. ¿Lo compraste? Claramente.`,
    () => 'Compras. El pasatiempo favorito de la gente con dinero y sin autocontrol.',
    () => 'Compraste algo. No sé qué es, pero seguro no lo necesitabas.'
  ],
  'Suscripciones': [
    () => 'Una suscripción más. Como la sangre para un vampiro, pero con tu cuenta bancaria.',
    (_a: number, d: string) => `${d}. Seguro ni la usas. Como el 90% de las suscripciones de la gente.`,
    () => 'Suscripción activa. ¿Cancelaste el trial? Por supuesto que no.'
  ],
  'Salud': [
    (_a: number, d: string) => `${d} en salud. La ironía de gastar en salud después de todo lo que le haces a tu cuerpo.`,
    () => 'Salud. La única categoría donde deberías gastar más. Pero seguro es para algo estúpido.',
    () => 'Medicina/salud. Bien, al menos estás invirtiendo en no morir. Prioridades.'
  ],
  'Casa': [
    (_a: number, d: string) => `${d} para la casa. Porque vivir bajo un puente no es opción... todavía.`,
    () => 'Gasto de casa. Hormiga trabajadora vs. tú, gastando en decoración.',
    () => 'Casa. El lugar donde duermes y donde tu dinero va a morir.'
  ],
  'Otros': [
    () => 'Otros. La categoría del misterio. Como "gastos varios" pero con peor reputación.',
    (_a: number, d: string) => `"${d}" en "Otros". Suena a que ni tú sabes en qué lo gastaste. Clásico.`,
    () => 'Categoría: "no sé". Gasto: "tampoco sé". Perfecto.'
  ]
};

export function getSarcasticComment(amount: number, category?: string, description?: string): string {
  const cat = category || 'Otros';
  const desc = description?.trim() || 'esto';

  const catPool = CATEGORY_COMMENTS[cat];
  if (catPool && Math.random() < 0.5) {
    return pick(catPool)(amount, desc);
  }

  const tier = amount > 5000 ? 'extreme'
    : amount > 1000 ? 'high'
    : amount > 500 ? 'medium'
    : amount > 0 ? 'low'
    : 'free';

  return pick(TIER_COMMENTS[tier])(amount, cat, desc);
}

/**
 * Formatea un número como moneda
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Formatea una fecha en formato corto
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

/**
 * Genera un color basado en el monto (más rojo = más caro)
 */
export function getToxicityColor(amount: number): string {
  if (amount > 1000) return 'text-toxic-red';
  if (amount > 500) return 'text-orange-500';
  if (amount > 100) return 'text-yellow-500';
  return 'text-toxic-green';
}

/**
 * Obtener el día de la semana como string
 */
export function getDayOfWeek(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[d.getDay()];
}
