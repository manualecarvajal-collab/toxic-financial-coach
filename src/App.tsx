import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, X } from 'lucide-react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import RoastModal from './components/RoastModal';
import FinancialShameCard from './components/FinancialShameCard';
import { useExpenses } from './hooks/useExpenses';
import { useRoast } from './hooks/useRoast';
import { useShameCard } from './hooks/useShameCard';

function App() {
  const {
    expenses,
    loading,
    addExpense,
    deleteExpense,
    clearAllExpenses,
    getWeeklyTotal,
    getMonthlyTotal,
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
  const monthlyTotal = getMonthlyTotal();
  const totalSpent = getTotalSpent();
  const expenseCount = getExpenseCount();

  const handleOpenRoast = useCallback(() => {
    setShowRoast(true);
    generateRoast(expenses);
  }, [expenses, generateRoast]);

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
    <div className="min-h-screen bg-toxic-black text-white font-brutal">
      <div className="max-w-lg mx-auto px-4 pb-32">
        {/* Header */}
        <Header
          onOpenRoast={handleOpenRoast}
          onClearAll={handleClearAll}
          expenseCount={expenseCount}
          weeklyTotal={weeklyTotal}
        />

        {/* Confirmation toast */}
        <AnimatePresence>
          {confirmClear && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-toxic-red/20 border border-toxic-red/30 rounded-xl p-3 mb-4 text-center"
            >
              <p className="text-xs text-toxic-red font-bold">
                ¿Estás seguro? ¡Toca otra vez para confirmar!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <div className="mt-6 mb-8">
          <StatsCards
            weeklyTotal={weeklyTotal}
            monthlyTotal={monthlyTotal}
            totalSpent={totalSpent}
            expenseCount={expenseCount}
          />
        </div>

        {/* Quick Add Button / Form */}
        <ExpenseForm onAddExpense={addExpense} />

        {/* Weekly Summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] uppercase tracking-widest text-white/40 font-mono">
              Historial de Gastos
            </h2>
            <span className="text-[10px] text-white/20 font-mono">
              {expenseCount} registro{expenseCount !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Expense List */}
          <ExpenseList
            expenses={expenses}
            onDeleteExpense={deleteExpense}
            loading={loading}
          />
        </div>

        {/* Shame Card Button (visible when there are expenses) */}
        {expenseCount > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowShameCard(true)}
            className="w-full py-4 bg-toxic-red/10 border border-toxic-red/20 rounded-xl text-sm font-bold text-toxic-red flex items-center justify-center gap-2 hover:bg-toxic-red/20 transition-colors mb-4"
          >
            <Share2 size={18} />
            Generar Tarjeta de la Vergüenza
          </motion.button>
        )}
      </div>

      {/* Roast Modal */}
      <RoastModal
        isOpen={showRoast}
        isThinking={isThinking}
        isDone={isDone}
        response={roastResponse}
        error={roastError}
        onClose={handleCloseRoast}
        onRegenerate={handleRegenerateRoast}
      />

      {/* Shame Card Modal */}
      <AnimatePresence>
        {showShameCard && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShameCard(false)}
              className="fixed inset-0 bg-black/95 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-toxic-gray rounded-3xl p-6 border border-white/10 max-w-sm w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">
                    Tu Tarjeta de la Vergüenza
                  </h3>
                  <button
                    onClick={() => setShowShameCard(false)}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <X size={14} className="text-white/40" />
                  </button>
                </div>

                {/* Hidden shame card (for export) */}
                <div className="rounded-2xl overflow-hidden border border-white/10 mb-4 h-[320px] flex items-center justify-center bg-black/50 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.5] origin-center">
                    <FinancialShameCard
                      expenses={expenses}
                      roast={roastResponse}
                      weeklyTotal={weeklyTotal}
                      cardRef={cardRef}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      await downloadCard();
                      setShowShameCard(false);
                    }}
                    disabled={isExporting}
                    className="flex-1 py-4 bg-toxic-green text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-toxic-green/90 transition-colors disabled:opacity-50"
                  >
                    <Download size={18} />
                    {isExporting ? 'Generando...' : 'Descargar'}
                  </button>
                  <button
                    onClick={async () => {
                      await shareCard();
                      setShowShameCard(false);
                    }}
                    disabled={isExporting}
                    className="flex-1 py-4 bg-white/10 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors disabled:opacity-50"
                  >
                    <Share2 size={18} />
                    Compartir
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;