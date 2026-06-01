import { useState } from 'react';
import { motion } from 'framer-motion';
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
    <motion.div
      layout
      className="fixed bottom-24 right-6 z-50"
    >
      {isExpanded ? (
        <motion.form
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onSubmit={handleSubmit}
          className="bg-toxic-gray border border-white/10 rounded-2xl p-5 w-72 shadow-2xl shadow-black/50"
        >
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">
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
              className="w-full bg-black/50 text-2xl font-black font-mono text-toxic-green outline-none p-3 rounded-xl border border-white/5 focus:border-toxic-green/50 transition-colors placeholder:text-white/10"
            />

            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="¿En qué lo gastaste?"
              className="w-full bg-black/50 text-sm outline-none p-3 rounded-xl border border-white/5 focus:border-white/20 transition-colors placeholder:text-white/20"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className="w-full bg-black/50 text-sm outline-none p-3 rounded-xl border border-white/5 focus:border-white/20 transition-colors text-white/80"
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
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white/40 bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!amount || isSubmitting}
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-toxic-green text-black flex items-center justify-center gap-2 hover:bg-toxic-green/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
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
        </motion.form>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(true)}
          className="w-14 h-14 bg-toxic-green rounded-full flex items-center justify-center shadow-lg shadow-toxic-green/20 hover:shadow-toxic-green/40 transition-shadow"
        >
          <Plus size={28} className="text-black" />
        </motion.button>
      )}
    </motion.div>
  );
}