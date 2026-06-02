import { useState } from 'react';
import { EXPENSE_CATEGORIES, CATEGORY_EMOJIS } from '../types';
import type { Expense, ExpenseCategory } from '../types';

interface Props {
  onAddExpense: (expense: Omit<Expense, 'id'>) => Promise<number | null>;
}

export default function ExpenseForm({ onAddExpense }: Props) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(EXPENSE_CATEGORIES[0]);
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-24 md:bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center shadow-lg shadow-primary-container/30 hover:shadow-primary-container/50 hover:scale-105 active:scale-95 transition-all duration-200 fab-pulse"
        >
          <span className="text-3xl text-toxic-black font-black font-display">+</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-toxic-black flex flex-col">
      {/* Noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-50 opacity-5"
        style={{
          backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E')`
        }}
      />
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-40"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2))',
          backgroundSize: '100% 4px'
        }}
      />

      <form onSubmit={handleSubmit} className="flex flex-col h-full relative z-30">
        {/* Header */}
        <header className="flex justify-between items-center px-safe-margin py-stack-sm border-b-4 border-toxic-gray bg-toxic-black relative z-40">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="font-data text-label-mono text-toxic-orange border-2 border-toxic-orange px-stack-sm py-stack-xs uppercase hover:bg-toxic-orange hover:text-toxic-black transition-colors active:scale-95"
          >
            Abortar
          </button>
          <h1 className="font-display text-headline-lg-mobile text-primary-container uppercase tracking-tighter">
            Nuevo Gasto
          </h1>
          <div className="w-[68px]" />
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-32">
          {/* AMOUNT INPUT */}
          <section className="flex flex-col items-center justify-center py-12 px-safe-margin bg-toxic-dark-alt border-b-4 border-toxic-purple relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(42,42,42,0.4) 10px, rgba(42,42,42,0.4) 20px)'
              }}
            />
            <label className="font-data text-label-mono text-toxic-purple mb-stack-sm relative z-10 tracking-widest">
              INGRESA EL DAÑO (MXN)
            </label>
            <div className="relative w-full max-w-xs">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 font-data text-data-heavy text-surface-variant group-focus-within:text-primary-container transition-colors pointer-events-none">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                autoFocus
                className="w-full bg-transparent border-0 border-b-4 border-toxic-gray text-center font-data text-data-heavy text-on-surface focus:ring-0 focus:border-primary-container transition-colors py-stack-md placeholder:text-surface-variant pl-12 pr-4 outline-none"
              />
            </div>
            <div className="w-full max-w-xs h-1 bg-transparent transition-all duration-300 scale-x-0 has-[:focus]:scale-x-100 has-[:focus]:bg-toxic-orange mt-1" />
          </section>

          {/* CATEGORY GRID */}
          <section className="px-safe-margin py-stack-lg">
            <label className="font-data text-label-mono text-toxic-yellow mb-stack-md block tracking-widest">
              ELIGE TU VENENO
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-grid-gutter">
              {EXPENSE_CATEGORIES.map((cat) => {
                const isActive = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex flex-col items-center justify-center p-stack-md bg-toxic-gray border-4 transition-all active:scale-95 group relative overflow-hidden ${
                      isActive ? 'border-primary-container bg-surface-variant' : 'border-transparent hover:border-primary-container'
                    }`}
                  >
                    <span className="text-4xl mb-stack-xs group-hover:scale-110 transition-transform">
                      {CATEGORY_EMOJIS[cat] || '❓'}
                    </span>
                    <span className="font-data text-label-mono text-on-surface-variant group-hover:text-primary-container transition-colors uppercase">
                      {cat}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* NOTE INPUT */}
          <section className="px-safe-margin pb-stack-lg">
            <label className="font-data text-label-mono text-surface-variant mb-stack-xs block uppercase tracking-widest">
              Justifica esto (Opcional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="LO NECESITABA PORQUE..."
              className="w-full bg-toxic-gray border-4 border-toxic-gray p-stack-md font-data text-label-mono text-on-surface focus:ring-0 focus:outline-none focus:border-toxic-orange placeholder:text-surface-variant placeholder:opacity-50 transition-colors uppercase"
            />
          </section>
        </div>

        {/* Fixed bottom action */}
        <div className="fixed bottom-0 left-0 w-full p-safe-margin bg-toxic-black/80 backdrop-blur-md z-50 border-t-4 border-toxic-gray">
          <div className="relative w-full max-w-md mx-auto">
            <div className="absolute inset-0 bg-primary-container translate-x-2 translate-y-2 rounded-none pointer-events-none" />
            <button
              type="submit"
              disabled={!amount || isSubmitting}
              className="relative w-full bg-toxic-black border-4 border-primary-container text-primary-container font-display text-headline-lg-mobile py-stack-md uppercase hover:bg-primary-container hover:text-toxic-black transition-colors active:translate-x-1 active:translate-y-1 flex items-center justify-center gap-stack-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="animate-pulse">PROCESANDO...</span>
              ) : (
                <>
                  CONFIRMAR GASTO ESTÚPIDO
                  <span className="text-2xl">⚡</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
