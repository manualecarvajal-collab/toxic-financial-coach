import { useEffect, useRef } from 'react';
import { Loader2, AlertTriangle, X, RefreshCw } from 'lucide-react';
import type { RoastResponse } from '../types';
import { useSpeech } from '../hooks/useSpeech';

interface Props {
  isOpen: boolean;
  isThinking: boolean;
  isDone: boolean;
  response: RoastResponse | null;
  error: string | null;
  onClose: () => void;
  onRegenerate: () => void;
}

export default function RoastModal({
  isOpen,
  isThinking,
  isDone,
  response,
  error,
  onClose,
  onRegenerate
}: Props) {
  const { speak, cancel } = useSpeech();
  const prevResponseRef = useRef<RoastResponse | null>(null);

  useEffect(() => {
    if (!isDone || !response || response === prevResponseRef.current) return;
    prevResponseRef.current = response;

    setTimeout(() => {
      speak(response.roast, {});
    }, 300);
  }, [isDone, response, speak]);

  if (!isOpen) return null;

  const handleClose = () => {
    cancel();
    onClose();
  };

  return (
    <>
      <div onClick={handleClose} className="fixed inset-0 bg-black/95 z-40 transition-opacity duration-300 noise-bg" />

      <div className="fixed z-50 inset-x-4 top-[10%] max-w-md mx-auto transition-all duration-300">
        <div className="bg-surface-container-high border-2 border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between p-5 border-b-2 border-white/5">
            <span className="font-data text-label-mono text-white/60 uppercase tracking-widest">
              {isThinking ? 'ANALIZANDO...' : isDone ? 'VEREDICTO' : 'TOXIC COACH'}
            </span>
            {isDone && response?._mode === 'ai' && (
              <span className="text-[10px] text-toxic-green/40 font-data tracking-widest border border-toxic-green/20 px-2 py-0.5">IA</span>
            )}
            <button onClick={handleClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <X size={14} className="text-white/40" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center">
            {isThinking && (
              <div className="text-center p-6">
                <div className="mb-4 flex justify-center">
                  <Loader2 size={40} className="text-primary-container animate-spin" />
                </div>
                <p className="font-brutal text-sm text-on-surface-variant font-mono">Procesando tu irresponsabilidad...</p>
                <p className="text-xs text-white/20 mt-2">Preparando el insulto perfecto</p>
                <div className="mt-6 space-y-2">
                  {['Revisando tu falta de control...', 'Calculando cuánto pudiste ahorrar...', 'Preparando la dosis de realidad...'].map((msg) => (
                    <p key={msg} className="text-[10px] text-white/10 animate-pulse">{msg}</p>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="text-center p-6">
                <AlertTriangle size={40} className="text-toxic-yellow mb-4 mx-auto animate-bounce" />
                <p className="text-sm text-white/80">{error}</p>
                <button onClick={onRegenerate} className="mt-4 px-6 py-3 bg-white/10 rounded-xl text-sm font-bold hover:bg-white/20 transition-all duration-200 flex items-center gap-2 mx-auto border-2 border-white/10">
                  <RefreshCw size={14} /> Intentar de nuevo
                </button>
              </div>
            )}

            {isDone && (
              <div className="w-full px-6 pt-6">
                {response && (
                  <div>
                    <div className="text-center mb-4">
                      <span className={`inline-block px-4 py-2 rounded-none text-3xl font-black font-data border-4 ${
                        response.toxicGrade === 'F' || response.toxicGrade === 'A'
                          ? 'bg-primary-container/10 border-primary-container/30 text-primary-container'
                          : 'bg-error/10 border-error/30 text-error'
                      }`}>
                        Grado: {response.toxicGrade}
                      </span>
                    </div>
                    <div className="bg-toxic-black/50 rounded-xl p-4 border-2 border-white/5 mb-3">
                      <p className="font-brutal text-sm leading-relaxed text-white/90">{response.roast}</p>
                    </div>
                    {response.uselessFact && (
                      <p className="text-xs text-primary-container/60 font-mono px-1 mb-3">💡 {response.uselessFact}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {isDone && response && (
              <div className="px-6 pb-6 pt-2 w-full">
                <button onClick={onRegenerate} className="w-full py-3 bg-white/5 rounded-xl text-xs font-bold text-white/40 hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-2 border-2 border-white/5">
                  <RefreshCw size={12} /> Quiero más humillación
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
