import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneProps } from '../../types';

export default function ElevatorScene({ onNext, isActive }: SceneProps) {
  const [phase, setPhase] = useState(0);

  const handleSelect = (scores: any) => {
    onNext(scores);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-lg mx-auto"
    >
      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div
            key="phase0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center w-full"
          >
            <p className="text-lg font-light tracking-widest mb-8 leading-relaxed">
              停電。<br />
              非常灯だけが薄暗く点灯している。<br />
              通信不可。そのまま30分が経過した。
            </p>
            <button
              onClick={() => setPhase(1)}
              className="px-8 py-4 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors shadow-lg"
            >
              その時…
            </button>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div
            key="phase1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center"
          >
            <p className="text-lg font-light tracking-widest mb-12 text-center">
              一番最初に頭に浮かんだことは？
            </p>

            <div className="grid grid-cols-1 gap-4 w-full relative z-10 px-4">
              <button
                onClick={() => handleSelect({ N: 30 })}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 p-4 rounded-xl text-sm transition-colors text-left shadow-md"
              >
                「今できる脱出方法はないか探したい」
              </button>

              <button
                onClick={() => handleSelect({ P: 30 })}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 p-4 rounded-xl text-sm transition-colors text-left shadow-md"
              >
                「何故エレベーターが止まったのか原因を推測する」
              </button>

              <button
                onClick={() => handleSelect({ B: 30 })}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 p-4 rounded-xl text-sm transition-colors text-left shadow-md"
              >
                「救助された後、予定をどうリカバリーするか考える」
              </button>

              <button
                onClick={() => handleSelect({ V: 30 })}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 p-4 rounded-xl text-sm transition-colors text-left shadow-md"
              >
                「人生って、時にどうしようもなく閉じ込められるものだな…」
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
