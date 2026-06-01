import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate, getToxicityColor, getSarcasticComment } from '../utils/format';
import { CATEGORY_EMOJIS } from '../types';
import type { Expense } from '../types';

interface Props {
  expenses: Expense[];
  onDeleteExpense: (id: number) => Promise<void>;
  loading?: boolean;
}

export default function ExpenseList({ expenses, onDeleteExpense, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-toxic-gray/30 rounded-xl p-4">
            <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <TrendingUp className="mx-auto text-white/10 mb-4" size={48} />
        <p className="text-white/30 text-sm font-bold">
          Sin gastos aún. ¿Eres pobre o responsable?
        </p>
        <p className="text-white/10 text-xs mt-2">
          Tocá el botón verde para registrar tu primera mala decisión
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {expenses.map((expense, index) => (
          <motion.div
            key={expense.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
            transition={{ delay: index * 0.02, type: 'spring', stiffness: 300, damping: 30 }}
            className="group relative bg-toxic-gray/30 hover:bg-toxic-gray/50 rounded-xl p-4 border border-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              {/* Emoji categoría */}
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg shrink-0">
                {CATEGORY_EMOJIS[expense.category as keyof typeof CATEGORY_EMOJIS] || '❓'}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-white/40">
                    {CATEGORY_EMOJIS[expense.category as keyof typeof CATEGORY_EMOJIS] 
                      ? '' 
                      : expense.category}
                  </span>
                </div>
                <p className="text-sm font-bold truncate">{expense.description}</p>
                <p className="text-[10px] text-white/30 font-mono">
                  {formatDate(expense.date)}
                </p>
              </div>

              {/* Amount & Delete */}
              <div className="text-right shrink-0">
                <p className={`font-mono font-black ${getToxicityColor(expense.amount)}`}>
                  -{formatCurrency(expense.amount)}
                </p>
                <p className="text-[8px] text-white/20 italic">
                  {getSarcasticComment(expense.amount)}
                </p>
              </div>

              {/* Delete button (visible on hover) */}
              {expense.id && (
                <button
                  onClick={() => onDeleteExpense(expense.id!)}
                  className="absolute -right-2 -top-2 w-6 h-6 bg-toxic-red rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} className="text-white" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}