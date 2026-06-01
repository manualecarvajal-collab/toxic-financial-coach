import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, X, RefreshCw } from 'lucide-react';
import type { RoastResponse } from '../types';

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
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/95 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed z-50 inset-x-4 top-[15%] max-w-md mx-auto"
          >
            <div className="bg-toxic-gray border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                  {isThinking ? 'Analizando...' : isDone ? 'Veredicto' : 'Toxic Coach'}
                </span>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X size={14} className="text-white/40" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 min-h-[200px] flex flex-col items-center justify-center">
                {/* Thinking State */}
                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                      className="mb-4"
                    >
                      <Loader2 size={40} className="text-toxic-green" />
                    </motion.div>
                    <p className="text-sm text-white/60 font-mono">
                      Procesando tu irresponsabilidad...
                    </p>
                    <p className="text-xs text-white/20 mt-2">
                      Preparando el insulto perfecto
                    </p>

                    {/* Sarcastic loading messages */}
                    <div className="mt-6 space-y-2">
                      {[
                        'Revisando tu falta de control...',
                        'Calculando cuánto pudiste ahorrar...',
                        'Preparando la dosis de realidad...'
                      ].map((msg, i) => (
                        <motion.p
                          key={msg}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 3, delay: i * 1.5 }}
                          className="text-[10px] text-white/10"
                        >
                          {msg}
                        </motion.p>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Error State */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <AlertTriangle size={40} className="text-yellow-500 mb-4 mx-auto" />
                    <p className="text-sm text-white/80">{error}</p>
                    <button
                      onClick={onRegenerate}
                      className="mt-4 px-6 py-3 bg-white/10 rounded-xl text-sm font-bold hover:bg-white/20 transition-colors flex items-center gap-2 mx-auto"
                    >
                      <RefreshCw size={14} />
                      Intentar de nuevo
                    </button>
                  </motion.div>
                )}

                {/* Done State */}
                {isDone && response && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full"
                  >
                    {/* Grade Badge */}
                    <div className="text-center mb-6">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.3 }}
                        className={`inline-block px-4 py-2 rounded-full text-lg font-black font-mono border-2 ${
                          response.toxicGrade === 'F' || response.toxicGrade === 'A'
                            ? 'bg-toxic-green/10 border-toxic-green/30 text-toxic-green'
                            : 'bg-toxic-red/10 border-toxic-red/30 text-toxic-red'
                        }`}
                      >
                        Grado: {response.toxicGrade}
                      </motion.span>
                    </div>

                    {/* Roast Text */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-black/30 rounded-2xl p-5 border border-white/5 mb-4"
                    >
                      <p className="text-sm leading-relaxed text-white/90">
                        {response.roast}
                      </p>
                    </motion.div>

                    {/* Useless Fact */}
                    {response.uselessFact && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-xs text-toxic-green/60 font-mono px-1"
                      >
                        💡 {response.uselessFact}
                      </motion.p>
                    )}

                    {/* Regenerate */}
                    <button
                      onClick={onRegenerate}
                      className="mt-6 w-full py-3 bg-white/5 rounded-xl text-xs font-bold text-white/40 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={12} />
                      Quiero más humillación
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}