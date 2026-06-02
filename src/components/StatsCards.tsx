import { formatCurrency } from '../utils/format';

interface Props {
  weeklyTotal: number;
  totalSpent: number;
  expenseCount: number;
}

export default function StatsCards({ weeklyTotal, totalSpent, expenseCount }: Props) {
  const stats = [
    {
      label: 'Total Bleed',
      value: formatCurrency(weeklyTotal),
      borderColor: 'border-error',
      textColor: 'text-error',
      comment: weeklyTotal > 1000 ? 'OUT OF CONTROL' : weeklyTotal > 500 ? 'WORRYING' : weeklyTotal > 0 ? 'MODERATE' : 'UNTOUCHABLE'
    },
    {
      label: 'Waste Lvl',
      value: weeklyTotal > 1000 ? 'CRITICAL' : weeklyTotal > 500 ? 'HIGH' : weeklyTotal > 0 ? 'MEDIUM' : 'LOW',
      borderColor: 'border-toxic-orange',
      textColor: 'text-toxic-orange',
      comment: expenseCount > 20 ? 'ADDICT' : expenseCount > 10 ? 'ACTIVE' : 'SELECTIVE'
    },
    {
      label: 'Coach Mood',
      value: weeklyTotal > 1000 ? 'FURIOUS' : weeklyTotal > 500 ? 'ANGRY' : weeklyTotal > 0 ? 'DISAPPOINTED' : 'SLEEPING',
      borderColor: 'border-toxic-yellow',
      textColor: 'text-toxic-yellow',
      comment: weeklyTotal > 0 ? 'You should be worried' : 'For now...'
    },
    {
      label: 'Remaining',
      value: formatCurrency(Math.max(0, 5000 - totalSpent)),
      borderColor: 'border-primary-container',
      textColor: 'text-primary-container',
      comment: totalSpent > 5000 ? 'NEGATIVE. IMPRESSIVE.' : 'Still have time to waste it'
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
