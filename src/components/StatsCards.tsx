import { formatCurrency } from '../utils/format';

interface Props {
  weeklyTotal: number;
  totalSpent: number;
  expenseCount: number;
}

export default function StatsCards({ weeklyTotal, totalSpent, expenseCount }: Props) {
  const stats = [
    {
      label: 'Gasto Semanal',
      value: formatCurrency(weeklyTotal),
      borderColor: 'border-error',
      textColor: 'text-error',
      comment: weeklyTotal > 1000 ? 'FUERA DE CONTROL' : weeklyTotal > 500 ? 'PREOCUPANTE' : weeklyTotal > 0 ? 'MODERADO' : 'INTOCABLE'
    },
    {
      label: 'Nivel de Derroche',
      value: weeklyTotal > 1000 ? 'CRÍTICO' : weeklyTotal > 500 ? 'ALTO' : weeklyTotal > 0 ? 'MEDIO' : 'BAJO',
      borderColor: 'border-toxic-orange',
      textColor: 'text-toxic-orange',
      comment: expenseCount > 20 ? 'ADICTO' : expenseCount > 10 ? 'ACTIVO' : 'SELECTIVO'
    },
    {
      label: 'Humor del Coach',
      value: weeklyTotal > 1000 ? 'FURIOSO' : weeklyTotal > 500 ? 'ENOJADO' : weeklyTotal > 0 ? 'DECEPCIONADO' : 'DURMIENDO',
      borderColor: 'border-toxic-yellow',
      textColor: 'text-toxic-yellow',
      comment: weeklyTotal > 0 ? 'Deberías preocuparte' : 'Por ahora...'
    },
    {
      label: 'Restante',
      value: formatCurrency(Math.max(0, 5000 - totalSpent)),
      borderColor: 'border-primary-container',
      textColor: 'text-primary-container',
      comment: totalSpent > 5000 ? 'NEGATIVO. IMPRESIONANTE.' : 'Todavía puedes derrochar más'
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
