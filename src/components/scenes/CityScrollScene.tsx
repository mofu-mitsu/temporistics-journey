import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { SceneProps } from '../../types';

const EMOJIS = ['🏚️', '🏛️', '🏠', '🏙️', '🚀', '🌌'];

export default function CityScrollScene({ onNext, isActive }: SceneProps) {
  const [val, setVal] = useState(50);
  
  const handleComplete = () => {
    // 値が小さいほど過去(0=過去, 100=未来)なので、Pのスコアは 100 - val にする
    const score = 100 - val;
    onNext({ P: score });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 1.5 }}
      className="flex flex-col items-center justify-center p-8 rounded-3xl glass-card overflow-hidden"
    >
      <p className="text-lg font-light tracking-widest mb-16 text-center">
        街を歩き、好きな景色で立ち止まってください。
      </p>

      <div className="w-full relative h-32 flex items-center justify-center overflow-hidden mb-12 mask-image-linear">
        <motion.div
          className="flex gap-8 text-6xl whitespace-nowrap absolute"
          animate={{ x: `calc(50% - ${val}%)` }}
          transition={{ type: 'spring', damping: 25, stiffness: 100 }}
        >
          {EMOJIS.map((e, i) => (
             <span key={i} className="opacity-80 transition-opacity">{e}</span>
          ))}
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
        ここで足を止める
      </button>
    </motion.div>
  );
}
