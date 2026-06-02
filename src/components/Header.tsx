import { Trash2, Terminal } from 'lucide-react';

interface Props {
  onOpenRoast: () => void;
  onClearAll: () => void;
}

export default function Header({ onOpenRoast, onClearAll }: Props) {
  return (
    <header className="w-full top-0 sticky bg-background z-50 border-b-4 border-primary-container noise-bg">
      <div className="flex items-center justify-between px-safe-margin py-stack-sm w-full relative overflow-hidden scanline">
        <button
          onClick={onOpenRoast}
          className="text-primary shrink-0 transition-all duration-75 active:skew-x-2 hover:bg-primary-container hover:text-toxic-black p-2"
        >
          <Terminal size={20} />
        </button>

        <h1 className="font-display text-display-lg text-toxic-yellow uppercase tracking-tighter truncate-heading mx-2">
          ESTADO DE POBREZA
        </h1>

        <button
          onClick={onClearAll}
          className="text-primary shrink-0 transition-all duration-75 active:skew-x-2 hover:bg-primary-container hover:text-toxic-black p-2"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </header>
  );
}
