import { Flame, Sparkles, Trash2 } from 'lucide-react';

interface Props {
  onOpenRoast: () => void;
  onClearAll: () => void;
  expenseCount: number;
  weeklyTotal: number;
}

export default function Header({ onOpenRoast, onClearAll, expenseCount, weeklyTotal }: Props) {
  return (
    <header className="relative">
      {/* Toxic gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-toxic-green/30 to-transparent" />

      <div className="flex items-center justify-between py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="hover:rotate-12 transition-transform duration-300">
            <Flame size={28} className="text-toxic-green" />
          </div>
          <div>
            <h1 className="text-lg font-black italic tracking-tighter">
              TOXIC <span className="text-toxic-green">COACH</span>
            </h1>
            <p className="text-[8px] text-white/20 tracking-widest uppercase font-mono">
              {expenseCount} errores · ${weeklyTotal.toFixed(0)} despilfarrados
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Roast Button */}
          <button
            onClick={onOpenRoast}
            className="flex items-center gap-2 px-4 py-2 bg-toxic-red/10 border border-toxic-red/20 rounded-xl text-xs font-bold text-toxic-red hover:bg-toxic-red/20 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Sparkles size={14} />
            Roast
          </button>

          {/* Clear Button */}
          <button
            onClick={onClearAll}
            className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 text-white/30 hover:text-toxic-red hover:scale-105 active:scale-95"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}