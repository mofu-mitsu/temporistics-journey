import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { SceneProps } from '../../types';

export default function TimeWeightScene({ onNext }: SceneProps) {
  const [dragAmount, setDragAmount] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const dragStart = useRef<number | null>(null);

  const handleDrag = (e: any, info: any) => {
    const y = -info.offset.y;
    if (y > 0) {
      setDragAmount(Math.min(y, 30));
    }
  };

  const handleDragEnd = (e: any, info: any) => {
    if (dragAmount > 20) {
      setShowChoices(true);
    }
    setDragAmount(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] w-full"
    >
      <h2 className="text-xl font-light tracking-widest mb-12 opacity-80">時間の重さ</h2>

      {!showChoices ? (
        <div className="flex flex-col items-center">
          <p className="text-sm opacity-60 mb-16 tracking-widest">持ち上げてください。</p>
          
          <motion.div
            drag="y"
            dragConstraints={{ top: -10, bottom: 0 }}
            dragElastic={0.05}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            animate={{ y: -dragAmount }}
            className="text-8xl cursor-grab active:cursor-grabbing select-none touch-none"
          >
            🪨
          </motion.div>
          <div className="w-24 h-4 bg-black/10 rounded-full mt-4 blur-sm" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <p className="text-sm opacity-80 mb-8 tracking-widest">少しだけ動きました。</p>
          <p className="mb-8 font-medium tracking-wide">このまま運びますか？</p>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            <button
              onClick={() => onNext({ B: 30 })} // 未来・継続
              className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors"
            >
              YES
            </button>
            <button
              onClick={() => onNext({ P: 30 })} // 過去・拒否・現状維持
              className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors"
            >
              NO
            </button>
            <button
              onClick={() => onNext({ N: 30 })} // 現在・妥協
              className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors"
            >
              置く
            </button>
            <button
              onClick={() => onNext({ V: 30 }, { actionDesc: '時間の重りを感じた', scores: { V: 30 } })} // 永遠・破壊・超越
              className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors"
            >
              壊す
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
