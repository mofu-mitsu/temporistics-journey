import { useState, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';
import { SceneProps } from '../../types';
import DarlingOverlay from '../DarlingOverlay';

const EMOJIS = ['🏚️', '🏛️', '🏠', '🏙️', '🚀', '🌌'];

export default function ReverseScrollScene({ onNext, isActive }: SceneProps) {
  const [scrollCount, setScrollCount] = useState(0);
  const [hasYielded, setHasYielded] = useState(false);
  const [scrollPos, setScrollPos] = useState(0); // 0が右端, 負の数で左(過去)へ行く
  const controls = useAnimation();

  const handleDragEnd = (event: any, info: any) => {
    if (hasYielded) return;

    const offset = info.offset.x;
    
    // 右にフリック(前へ進もうとする)
    if (offset < -10) {
      setScrollCount(prev => prev + 1);
      // 強制的に過去(右方向へ背景を流す)
      setScrollPos(prev => prev + 50); 
    } 
    // 左にフリック(諦めて過去へ)
    else if (offset > 10) {
      setHasYielded(true);
      setScrollPos(prev => prev - 100);
      setTimeout(() => {
        onNext({ B: 0 }); // B(未来)は0, 諦めた
      }, 1500);
    }
    
    // 右フリックを2回以上抵抗したら、抵抗したとみなして次へ
    if (scrollCount >= 1 && offset < -10) {
      setHasYielded(true);
      setTimeout(() => {
        onNext({ B: 20 }); // 抵抗し続けたのでB(未来)は20
      }, 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] w-full overflow-hidden relative"
    >
      <p className="text-lg font-light tracking-widest mb-16 text-center z-10 text-current">
        あなたはスワイプして時間の流れを自由に動かせます。
      </p>

      <div className="w-full max-w-sm relative h-32 flex items-center justify-center overflow-hidden mb-12 mask-image-linear z-10">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          animate={{ x: scrollPos }}
          transition={{ type: 'spring', damping: 20 }}
          className="flex gap-8 text-6xl whitespace-nowrap absolute cursor-grab active:cursor-grabbing touch-none"
        >
          {EMOJIS.map((e, i) => (
             <span key={i} className="opacity-80 select-none">{e}</span>
          ))}
        </motion.div>
      </div>
      
      <p className="text-xs opacity-50 font-mono text-center z-10 text-slate-600 mb-8">
        Swipe ← (前へ) / Swipe → (過去へ)
      </p>

      <DarlingOverlay 
        show={scrollCount > 0 && !hasYielded}
        text="ねぇ、ダーリン♡ あなたは前に進んでいるつもり？……でもね、私にはあなたが“過去（思い出）”に引きずり戻されているようにしか見えないの。……本当は、あの頃に帰りたいんでしょ？"
        position="top"
      />
    </motion.div>
  );
}
