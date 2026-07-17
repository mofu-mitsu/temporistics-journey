import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneProps } from '../../types';

export default function ElevatorScene({ onNext, isActive }: SceneProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (isActive && phase === 0) {
      setTimeout(() => setPhase(1), 2000);
      setTimeout(() => setPhase(2), 4000);
    }
  }, [isActive, phase]);

  const handleSelect = (scores: any) => {
    onNext(scores);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] w-full"
    >
      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div
            key="p0"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="text-6xl"
          >
            🏢
          </motion.div>
        )}
        
        {phase === 1 && (
          <motion.div
            key="p1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-48 h-64 border-4 border-slate-700/50 bg-slate-800/10 rounded-lg relative overflow-hidden flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -100] }}
                transition={{ duration: 1.5, ease: "linear" }}
                className="absolute inset-0 bg-[linear-gradient(transparent,rgba(255,255,255,0.1),transparent)]"
                style={{ backgroundSize: '100% 200%' }}
              />
            </div>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div
            key="p2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center w-full max-w-sm"
          >
            <div className="w-full max-w-xs p-6 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-black/40 pointer-events-none" />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-red-500 flex flex-col items-center mb-8 relative z-10"
              >
                <i className="fa-solid fa-triangle-exclamation text-4xl mb-2 animate-pulse"></i>
                <p className="text-sm font-bold tracking-widest">停止しました。</p>
              </motion.div>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                <button
                  onClick={() => handleSelect({ P: 10 })} // 過去・原因・分析
                  className="bg-red-900/40 hover:bg-red-800/60 border border-red-500/50 text-red-100 p-4 rounded-lg flex flex-col items-center transition-colors"
                >
                  <div className="w-4 h-4 rounded-full bg-red-500 mb-2 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                  <span className="text-xs">非常ボタン</span>
                </button>

                <button
                  onClick={() => handleSelect({ N: 10 })} // 現在・行動・現実
                  className="bg-yellow-900/40 hover:bg-yellow-800/60 border border-yellow-500/50 text-yellow-100 p-4 rounded-lg flex flex-col items-center transition-colors"
                >
                  <div className="w-4 h-4 rounded-full bg-yellow-500 mb-2 shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
                  <span className="text-xs">扉を開ける</span>
                </button>

                <button
                  onClick={() => handleSelect({ B: 10 })} // 未来・待機・予測
                  className="bg-green-900/40 hover:bg-green-800/60 border border-green-500/50 text-green-100 p-4 rounded-lg flex flex-col items-center transition-colors"
                >
                  <div className="w-4 h-4 rounded-full bg-green-500 mb-2 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                  <span className="text-xs">座って待つ</span>
                </button>

                <button
                  onClick={() => handleSelect({ V: 10 })} // 永遠・傍観・哲学
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-500/50 text-slate-200 p-4 rounded-lg flex flex-col items-center transition-colors"
                >
                  <div className="w-4 h-4 rounded-full bg-white mb-2 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <span className="text-xs">天井を見る</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
