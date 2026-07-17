import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SceneProps } from '../../types';

export default function SunScene({ onNext, isActive }: SceneProps) {
  const [val, setVal] = useState(50);

  const handleComplete = () => {
    // 50 (真昼) に近いほど「現在」に焦点が当たっているとし、Nを高くする。
    const score = (100 - Math.abs(val - 50) * 2) * 0.3;
    onNext({ N: score });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 1.5 }}
      className="flex flex-col items-center justify-center p-8 rounded-3xl glass-card"
    >
      <p className="text-lg font-light tracking-widest mb-16 text-center">
        一番心地よい時間帯にしてください。
      </p>

      <div className="relative w-full max-w-md h-48 flex items-center justify-center mb-12">
        {/* 太陽の軌道 */}
        <div className="absolute w-full h-full border-t border-dashed border-slate-800/30 rounded-t-full top-1/2" />
        
        {/* 太陽 */}
        <motion.div
          className="absolute text-6xl select-none"
          animate={{
            rotate: (val - 50) * 1.5,
            x: (val - 50) * 2.5,
            y: Math.abs(val - 50) * 1.2 - 20,
            scale: val === 50 ? 1.2 : 1,
            opacity: val < 20 || val > 80 ? 0.5 : 1
          }}
          transition={{ type: 'spring', damping: 20 }}
        >
          {val < 20 || val > 80 ? '🌙' : '☀️'}
        </motion.div>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="w-full max-w-xs accent-slate-800 cursor-pointer mb-12 opacity-70 hover:opacity-100 transition-opacity"
      />

      <button
        onClick={handleComplete}
        className="px-8 py-3 rounded-full border border-current text-current hover:bg-black/5 transition-colors tracking-widest text-sm"
      >
        この時間にとどまる
      </button>
    </motion.div>
  );
}
