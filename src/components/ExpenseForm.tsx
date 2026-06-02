import { useState } from 'react';
import { Plus, Send } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../types';
import type { Expense } from '../types';

interface Props {
  onAddExpense: (expense: Omit<Expense, 'id'>) => Promise<number | null>;
}

export default function ExpenseForm({ onAddExpense }: Props) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setIsSubmitting(true);

    await onAddExpense({
      amount: parseFloat(amount),
      description: description.trim() || 'Gasto no especificado',
      category,
      date: new Date()
    });

    setAmount('');
    setDescription('');
    setCategory(EXPENSE_CATEGORIES[0]);
    setIsSubmitting(false);
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {isExpanded ? (
        <form
          onSubmit={handleSubmit}
          className="bg-surface-container-high border-2 border-primary-container/40 rounded-xl p-5 w-72 shadow-2xl shadow-black/50"
        >
          <h3 className="font-data text-label-mono text-primary-container uppercase mb-4 tracking-widest">
            Nuevo Gasto
          </h3>

          <div className="space-y-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              autoFocus
              className="w-full bg-toxic-black/80 text-3xl font-black font-data text-primary-container outline-none p-3 rounded-xl border-2 border-white/10 focus:border-primary-container/50 transition-colors placeholder:text-white/10"
            />

            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="¿En qué lo gastaste?"
              className="w-full bg-toxic-black/80 text-sm outline-none p-3 rounded-xl border-2 border-white/10 focus:border-white/20 transition-colors placeholder:text-white/20"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className="w-full bg-toxic-black/80 text-sm outline-none p-3 rounded-xl border-2 border-white/10 focus:border-white/20 transition-colors text-white/80"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-toxic-gray">
                  {cat}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white/40 bg-white/5 hover:bg-white/10 transition-colors border-2 border-white/10"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!amount || isSubmitting}
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-primary-container text-toxic-black flex items-center justify-center gap-2 hover:bg-primary-container/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  <>
                    <Send size={14} />
                    Registrar
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center shadow-lg shadow-primary-container/30 hover:shadow-primary-container/50 hover:scale-105 active:scale-95 transition-all duration-200 fab-pulse"
        >
          <Plus size={32} className="text-toxic-black" />
        </button>
      )}
    </div>
  );
}
