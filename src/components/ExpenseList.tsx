import { Trash2, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate, getToxicityColor, getSarcasticComment } from '../utils/format';
import { CATEGORY_EMOJIS } from '../types';
import type { Expense } from '../types';

interface Props {
  expenses: Expense[];
  onDeleteExpense: (id: number) => Promise<void>;
  loading?: boolean;
}

const BORDER_COLORS: Record<string, string> = {
  'text-toxic-red': 'border-error',
  'text-orange-500': 'border-toxic-orange',
  'text-yellow-500': 'border-toxic-yellow',
  'text-toxic-green': 'border-primary-container'
};

export default function ExpenseList({ expenses, onDeleteExpense, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-stack-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-surface-variant rounded-none p-stack-sm" style={{ borderLeft: '8px solid #2d3828' }}>
            <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-16">
        <TrendingUp className="mx-auto text-white/20 mb-4" size={96} />
        <p className="text-on-surface-variant text-2xl font-black uppercase">
          Sin gastos aún
        </p>
        <p className="text-white/20 text-xs mt-2">
          Tocá el botón verde para registrar tu primera mala decisión
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-stack-sm">
      {expenses.map((expense) => {
        const toxicityClass = getToxicityColor(expense.amount);
        const borderColor = BORDER_COLORS[toxicityClass] || 'border-error';

        return (
          <div
            key={expense.id}
            className={`bg-surface-variant border-l-8 ${borderColor} p-stack-sm flex justify-between items-center gap-2`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl shrink-0">
                  {CATEGORY_EMOJIS[expense.category as keyof typeof CATEGORY_EMOJIS] || '❓'}
                </span>
                <div>
                  <p className="font-brutal text-body-md text-on-surface uppercase truncate">
                    {expense.description}
                  </p>
                  <p className="font-data text-label-mono text-on-surface-variant uppercase truncate">
                    {CATEGORY_EMOJIS[expense.category as keyof typeof CATEGORY_EMOJIS]
                      ? expense.category
                      : expense.category} · {formatDate(expense.date)}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0 flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <p className={`font-data text-data-heavy ${toxicityClass}`}>
                  -{formatCurrency(expense.amount)}
                </p>
                {expense.id && (
                  <button
                    onClick={() => onDeleteExpense(expense.id!)}
                    className="w-6 h-6 bg-error rounded-full flex items-center justify-center hover:bg-error/80 transition-colors shrink-0"
                  >
                    <Trash2 size={12} className="text-toxic-black" />
                  </button>
                )}
              </div>
              <p className="text-[9px] text-white/20 italic font-mono max-w-[180px] text-right leading-tight truncate">
                {getSarcasticComment(expense.amount, expense.category, expense.description)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
