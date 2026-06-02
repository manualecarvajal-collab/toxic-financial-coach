import { useState, useCallback } from 'react';
import { Wallet, Receipt, MessageCircleWarning, Monitor, X } from 'lucide-react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import RoastModal from './components/RoastModal';
import FinancialShameCard from './components/FinancialShameCard';
import { useExpenses } from './hooks/useExpenses';
import { useRoast } from './hooks/useRoast';
import { useShameCard } from './hooks/useShameCard';

type Tab = 'debt' | 'waste' | 'roast' | 'intel';

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

  const [activeTab, setActiveTab] = useState<Tab>('debt');
  const [showRoast, setShowRoast] = useState(false);
  const [showShameCard, setShowShameCard] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const weeklyTotal = getWeeklyTotal();
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
    <div className="bg-background text-on-background min-h-screen pb-28 md:pb-0 noise-bg font-brutal">
      <Header
        onOpenRoast={handleOpenRoast}
        onClearAll={handleClearAll}
      />

      <main className="px-safe-margin pt-stack-lg max-w-4xl mx-auto space-y-stack-lg">
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
            You're Broke
          </h2>
          <p className="font-data text-label-mono text-on-surface-variant uppercase tracking-widest">
            SYSTEM WARNING: Financial ruin imminent. Stop buying coffee.
          </p>
        </section>

        {/* Stats Cards */}
        <StatsCards
          weeklyTotal={weeklyTotal}
          totalSpent={totalSpent}
          expenseCount={expenseCount}
        />

        {/* Tab Content */}
        {activeTab === 'debt' && (
          <section>
            <h3 className="font-display text-headline-lg-mobile md:text-headline-lg text-primary-container mb-stack-md uppercase glitch">
              Recent Disasters
            </h3>
            <ExpenseList
              expenses={expenses}
              onDeleteExpense={deleteExpense}
              loading={loading}
            />
          </section>
        )}

        {activeTab === 'waste' && (
          <section className="text-center py-16">
            <Receipt className="mx-auto text-white/20 mb-4" size={64} />
            <p className="text-on-surface-variant text-lg font-black uppercase">
              Waste Analysis
            </p>
            <p className="text-white/20 text-xs mt-2">
              Detailed breakdown coming soon.
            </p>
          </section>
        )}

        {activeTab === 'roast' && (
          <section className="text-center py-16">
            <MessageCircleWarning className="mx-auto text-toxic-red mb-4" size={64} />
            <p className="text-on-surface-variant text-lg font-black uppercase">
              Get Roasted
            </p>
            <button
              onClick={handleOpenRoast}
              className="mt-4 px-8 py-4 bg-error/20 border-4 border-error/30 rounded-none text-error font-black uppercase tracking-widest hover:bg-error/30 transition-all active:scale-95"
            >
              Generate Roast
            </button>
          </section>
        )}

        {activeTab === 'intel' && (
          <section className="text-center py-16">
            <Monitor className="mx-auto text-toxic-purple mb-4" size={64} />
            <p className="text-on-surface-variant text-lg font-black uppercase">
              Intel & Insights
            </p>
            <p className="text-white/20 text-xs mt-2">
              AI-powered financial analysis coming soon.
            </p>
          </section>
        )}
      </main>

      {/* FAB */}
      <ExpenseForm onAddExpense={addExpense} />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full z-50 border-t-4 border-primary-container bg-toxic-black md:hidden">
        <div className="flex justify-around items-stretch h-20 bg-toxic-black">
          <TabButton
            icon={Wallet}
            label="DEBT"
            active={activeTab === 'debt'}
            onClick={() => setActiveTab('debt')}
            activeColor="bg-primary-container text-toxic-black"
          />
          <TabButton
            icon={Receipt}
            label="WASTE"
            active={activeTab === 'waste'}
            onClick={() => setActiveTab('waste')}
            activeColor="text-toxic-orange"
          />
          <TabButton
            icon={MessageCircleWarning}
            label="ROAST"
            active={activeTab === 'roast'}
            onClick={() => setActiveTab('roast')}
            activeColor="text-toxic-red"
          />
          <TabButton
            icon={Monitor}
            label="INTEL"
            active={activeTab === 'intel'}
            onClick={() => setActiveTab('intel')}
            activeColor="text-toxic-purple"
          />
        </div>
      </nav>

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

function TabButton({
  icon: Icon,
  label,
  active,
  onClick,
  activeColor
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
  activeColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-stack-xs active:scale-95 transition-transform flex-1 ${
        active ? activeColor : 'text-on-surface-variant'
      }`}
    >
      <Icon size={24} className={active ? '' : ''} />
      <span className="font-data text-label-mono mt-1 tracking-widest">{label}</span>
    </button>
  );
}

export default App;
