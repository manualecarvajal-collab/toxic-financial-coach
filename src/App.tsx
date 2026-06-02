import { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import RoastModal from './components/RoastModal';
import FinancialShameCard from './components/FinancialShameCard';
import { useExpenses } from './hooks/useExpenses';
import { useRoast } from './hooks/useRoast';
import { useShameCard } from './hooks/useShameCard';
import type { Expense } from './types';

function App() {
  const {
    expenses,
    loading,
    addExpense,
    deleteExpense,
    clearAllExpenses,
    getWeeklyTotal,
    getTotalSpent,
    getExpenseCount
  } = useExpenses();

  const {
    response: roastResponse,
    error: roastError,
    generateRoast,
    resetRoast,
    isThinking,
    isDone
  } = useRoast();

  const {
    cardRef,
    isExporting,
    shareCard,
    downloadCard
  } = useShameCard();
  const [showRoast, setShowRoast] = useState(false);
  const [showShameCard, setShowShameCard] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const weeklyTotal = getWeeklyTotal();
  const totalSpent = getTotalSpent();
  const expenseCount = getExpenseCount();

  const handleAddExpense = useCallback(async (expense: Omit<Expense, 'id'>): Promise<number | null> => {
    const id = await addExpense(expense);
    if (id !== null) {
      const updatedExpenses: Expense[] = [...expenses, { ...expense, id }];
      setShowRoast(true);
      generateRoast(updatedExpenses);
    }
    return id;
  }, [addExpense, expenses, generateRoast]);

  const handleRegenerateRoast = useCallback(() => {
    generateRoast(expenses);
  }, [expenses, generateRoast]);

  const handleCloseRoast = useCallback(() => {
    setShowRoast(false);
    resetRoast();
  }, [resetRoast]);

  const handleClearAll = useCallback(() => {
    if (confirmClear) {
      clearAllExpenses();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  }, [confirmClear, clearAllExpenses]);

  return (
    <div className="bg-background text-on-background min-h-screen pb-28 md:pb-0 noise-bg font-brutal">
      <Header
        onOpenRoast={() => { setShowRoast(true); generateRoast(expenses); }}
        onClearAll={handleClearAll}
      />

      <main className="px-safe-margin pt-stack-lg pb-stack-lg max-w-4xl mx-auto space-y-stack-lg">
        {confirmClear && (
          <div className="bg-error/20 border-2 border-error/30 rounded-xl p-3 text-center animate-pulse">
            <p className="text-xs text-error font-bold uppercase">
              ¿Estás seguro? ¡Toca otra vez para confirmar!
            </p>
          </div>
        )}

        {/* Hero Status */}
        <section className="bg-toxic-dark-alt border-4 border-error p-stack-md relative overflow-hidden scanline">
          <h2 className="font-display text-headline-lg-mobile md:text-display-xl text-error mb-2 uppercase">
            Estás en Quiebra
          </h2>
          <p className="font-data text-label-mono text-on-surface-variant uppercase tracking-widest">
            ALERTA DEL SISTEMA: Ruina financiera inminente. Deja de comprar café.
          </p>
        </section>

        {/* Stats Cards */}
        <StatsCards
          weeklyTotal={weeklyTotal}
          totalSpent={totalSpent}
          expenseCount={expenseCount}
        />

        <section>
            <h3 className="font-display text-headline-lg-mobile md:text-headline-lg text-primary-container mb-stack-md uppercase glitch">
              Desastres Recientes
            </h3>
            <ExpenseList
              expenses={expenses}
              onDeleteExpense={deleteExpense}
              loading={loading}
            />
          </section>

      </main>

      {/* FAB */}
      <ExpenseForm onAddExpense={handleAddExpense} />



      <RoastModal
        isOpen={showRoast}
        isThinking={isThinking}
        isDone={isDone}
        response={roastResponse}
        error={roastError}
        onClose={handleCloseRoast}
        onRegenerate={handleRegenerateRoast}
      />

      {showShameCard && (
        <>
          <div
            onClick={() => setShowShameCard(false)}
            className="fixed inset-0 bg-black/95 z-40 transition-opacity duration-300"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300">
            <div className="bg-toxic-gray rounded-3xl p-6 border-2 border-white/10 max-w-sm w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-data text-label-mono text-white/60 uppercase tracking-widest">
                  Tu Tarjeta de la Vergüenza
                </h3>
                <button
                  onClick={() => setShowShameCard(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X size={14} className="text-white/40" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden border-2 border-white/10 mb-4 h-[320px] flex items-center justify-center bg-black/50 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.5] origin-center">
                  <FinancialShameCard
                    expenses={expenses}
                    roast={roastResponse}
                    weeklyTotal={weeklyTotal}
                    cardRef={cardRef}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    await downloadCard();
                    setShowShameCard(false);
                  }}
                  disabled={isExporting}
                  className="flex-1 py-4 bg-primary-container text-toxic-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container/90 transition-all duration-200 disabled:opacity-50"
                >
                  {isExporting ? 'Generando...' : 'Descargar'}
                </button>
                <button
                  onClick={async () => {
                    await shareCard();
                    setShowShameCard(false);
                  }}
                  disabled={isExporting}
                  className="flex-1 py-4 bg-white/10 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
                >
                  Compartir
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
