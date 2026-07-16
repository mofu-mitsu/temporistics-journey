import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneProps } from '../../types';

export default function CitrusTreeScene({ onNext }: SceneProps) {
  const [phase, setPhase] = useState(0);

  const handleClick = () => {
    if (phase === 0) setPhase(1);
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center cursor-pointer"
            onClick={handleClick}
          >
            <div className="text-8xl relative mb-8">
              🍋🌳
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-8 right-0 text-3xl"
              >
                🐞
              </motion.div>
            </div>
            <p className="text-sm opacity-60 tracking-widest animate-pulse">タップして近づく</p>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div
            key="p1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center w-full max-w-sm"
          >
            <div className="text-6xl mb-8">🐞</div>
            <p className="mb-12 text-sm tracking-widest font-medium opacity-80">「今日はどんな一日だった？」</p>
            
            <div className="grid grid-cols-1 gap-4 w-full">
              <button onClick={() => onNext({ N: 30 })} className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors">穏やか</button>
              <button onClick={() => onNext({ B: 30 })} className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors">忙しい</button>
              <button onClick={() => onNext({ P: 30 })} className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors">忘れた</button>
              <button onClick={() => onNext({ V: 30 })} className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors">まだ始まってない</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
