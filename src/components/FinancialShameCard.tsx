import { Flame, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import type { Expense, RoastResponse } from '../types';

interface Props {
  expenses: Expense[];
  roast: RoastResponse | null;
  weeklyTotal: number;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export default function FinancialShameCard({ expenses, roast, weeklyTotal, cardRef }: Props) {
  const topExpense = expenses.length > 0
    ? expenses.reduce((max, exp) => exp.amount > max.amount ? exp : max, expenses[0])
    : null;

  return (
    <div
      ref={cardRef}
      className="relative w-[360px] h-[640px] bg-toxic-black overflow-hidden font-brutal"
      style={{ background: 'linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #050505 100%)' }}
    >
      {/* Patrón de fondo tóxico */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #39FF14 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #FF3131 0%, transparent 50%)`
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 flex flex-col h-full justify-between">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Flame className="text-toxic-red" size={24} />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">
              Financial Shame Report
            </span>
          </div>

          <h2 className="text-4xl font-black italic tracking-tighter text-white mb-2">
            TOXIC
            <br />
            <span className="text-toxic-green">COACH</span>
          </h2>

          {roast && (
            <div className="mt-6">
              <span className="inline-block px-3 py-1 bg-toxic-red/20 border border-toxic-red/30 rounded-full text-toxic-red text-xs font-mono mb-4">
                Grade: {roast.toxicGrade}
              </span>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="space-y-6">
          {/* Total gastado */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-toxic-red" size={16} />
              <span className="text-[10px] uppercase tracking-widest text-white/40">Total Gastado</span>
            </div>
            <p className="text-5xl font-black font-mono text-toxic-red">
              {formatCurrency(weeklyTotal)}
            </p>
            <p className="text-xs text-white/30 mt-2">Esta semana</p>
          </div>

          {/* Top expense */}
          {topExpense && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-toxic-red/20 flex items-center justify-center">
                <TrendingDown className="text-toxic-red" size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-white/40">Peor Decisión</p>
                <p className="font-bold text-sm text-white truncate">{topExpense.description}</p>
                <p className="text-toxic-red font-mono text-sm">{formatCurrency(topExpense.amount)}</p>
              </div>
            </div>
          )}

          {/* Roast Quote */}
          {roast && (
            <div className="bg-toxic-gray/80 rounded-xl p-4 border border-white/5">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={14} />
                <p className="text-xs text-white/80 italic leading-relaxed">
                  &ldquo;{roast.roast.split('.')[0]}.&rdquo;
                </p>
              </div>
              {roast.uselessFact && (
                <p className="text-[10px] text-toxic-green/60 mt-2 font-mono">
                  💡 {roast.uselessFact}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/5">
          <p className="text-[8px] text-white/20 text-center tracking-widest uppercase">
            Generado por Toxic Financial Coach
          </p>
        </div>
      </div>
    </div>
  );
}