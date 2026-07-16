import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneProps } from '../../types';

export default function LadybugFingerScene({ onNext }: SceneProps) {
  const [phase, setPhase] = useState(0);

  const handleClick = () => {
    if (phase === 0) {
      setPhase(1);
      setTimeout(() => setPhase(2), 3000);
    }
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center cursor-pointer"
            onClick={handleClick}
          >
            <motion.div 
              animate={{ x: [-20, 20, -20] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="text-6xl mb-12"
            >
              🐞
            </motion.div>
            <p className="text-sm opacity-60 tracking-widest animate-pulse">指で触る</p>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div
            key="p1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="text-8xl mb-8 relative inline-block">
              👆
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-4xl"
              >
                🐞
              </motion.div>
            </div>
            <p className="text-sm opacity-60 tracking-widest animate-pulse">しばらく動く...</p>
          </motion.div>
        )}
        {phase === 2 && (
          <motion.div
            key="p2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center w-full max-w-sm"
          >
            <div className="text-8xl mb-12 relative inline-block">
              👆
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-4xl">🐞</div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 w-full">
              <button onClick={() => onNext({ N: 30 }, { actionDesc: 'キイロテントウが指に乗った後「離す」を選択', scores: { N: 30 } })} className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors">離す</button>
              <button onClick={() => onNext({ V: 30 }, { actionDesc: 'キイロテントウが指に乗った後「そのまま」を選択', scores: { V: 30 } })} className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors">そのまま</button>
              <button onClick={() => onNext({ P: 30 }, { actionDesc: 'キイロテントウが指に乗った後「吹く」を選択', scores: { P: 30 } })} className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors">吹く</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
