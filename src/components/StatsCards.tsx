import { formatCurrency } from '../utils/format';

interface Props {
  weeklyTotal: number;
  totalSpent: number;
  expenseCount: number;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const WEEKLY_COMMENTS = [
  (v: number) => v > 1000 ? 'FUERA DE CONTROL 🚨' : v > 500 ? 'PREOCUPANTE 😬' : v > 0 ? 'MODERADO 🤨' : 'INTOCABLE 🧘',
  (v: number) => v > 1000 ? 'LLAMEN A UN EXORCISTA' : v > 500 ? 'VA A EMPEORAR' : v > 0 ? 'PODRÍA SER PEOR' : '¿ESTÁS VIVO?',
  (v: number) => v > 1000 ? 'TU CARTERA SUFRE' : v > 500 ? 'RESPIRA HONDO' : v > 0 ? 'LO INTENTASTE' : 'SIN ACTIVIDAD',
];

const WASTE_COMMENTS = [
  (c: number) => c > 20 ? 'ADICTO' : c > 10 ? 'ACTIVO' : 'SELECTIVO',
  (c: number) => c > 20 ? 'NECESITAS AYUDA' : c > 10 ? 'VAS BIEN... MAL' : 'CONTROLADO',
  () => `#${Math.floor(Math.random() * 1000)} EN GASTOS`,
];

const MOOD_COMMENTS = [
  (v: number) => v > 0 ? 'Deberías preocuparte' : 'Por ahora...',
  (v: number) => v > 0 ? 'Estoy decepcionado' : 'ZZZ...',
  (v: number) => v > 0 ? 'No me pagan lo suficiente' : 'Aburrido',
];

const REMAINING_COMMENTS = [
  (v: number) => v > 5000 ? 'NEGATIVO. GENIAL.' : 'Todavía puedes empeorar',
  (v: number) => v > 5000 ? 'RÉCORD MUNDIAL' : 'Gasta con cuidado',
  (v: number) => v > 5000 ? '¿EN SERIO?' : 'Margen para el error',
];

export default function StatsCards({ weeklyTotal, totalSpent, expenseCount }: Props) {
  const stats = [
    {
      label: 'Gasto Semanal',
      value: formatCurrency(weeklyTotal),
      borderColor: 'border-error',
      textColor: 'text-error',
      comment: pick(WEEKLY_COMMENTS)(weeklyTotal)
    },
    {
      label: 'Nivel de Derroche',
      value: weeklyTotal > 1000 ? 'CRÍTICO' : weeklyTotal > 500 ? 'ALTO' : weeklyTotal > 0 ? 'MEDIO' : 'BAJO',
      borderColor: 'border-toxic-orange',
      textColor: 'text-toxic-orange',
      comment: pick(WASTE_COMMENTS)(expenseCount)
    },
    {
      label: 'Humor del Coach',
      value: weeklyTotal > 1000 ? 'FURIOSO' : weeklyTotal > 500 ? 'ENOJADO' : weeklyTotal > 0 ? 'DECEPCIONADO' : 'DURMIENDO',
      borderColor: 'border-toxic-yellow',
      textColor: 'text-toxic-yellow',
      comment: pick(MOOD_COMMENTS)(weeklyTotal)
    },
    {
      label: 'Restante',
      value: formatCurrency(Math.max(0, 5000 - totalSpent)),
      borderColor: 'border-primary-container',
      textColor: 'text-primary-container',
      comment: pick(REMAINING_COMMENTS)(totalSpent)
    }
  ];

  return (
    <section className="grid grid-cols-2 gap-grid-gutter">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`bg-toxic-gray diagonal-pattern border-l-[8px] ${stat.borderColor} p-stack-md`}
        >
          <p className="font-data text-label-mono text-on-surface-variant uppercase mb-2 tracking-widest">
            {stat.label}
          </p>
          <p className={`font-data text-data-heavy ${stat.textColor} break-all`}>
            {stat.value}
          </p>
          <p className="text-[10px] text-white/20 mt-1 italic font-mono">
            {stat.comment}
          </p>
        </div>
      ))}
    </section>
  );
}
