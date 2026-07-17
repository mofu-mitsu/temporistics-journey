import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { SceneProps } from '../../types';
import DarlingOverlay from '../DarlingOverlay';

export default function DoubleTapScene({ onNext, isActive }: SceneProps) {
  const [tapCount, setTapCount] = useState(0);
  const [showDarling, setShowDarling] = useState(false);
  const lastTapTimeRef = useRef<number>(0);
  const frozenRef = useRef<boolean>(false);

  const handleTap = () => {
    const now = Date.now();
    
    if (tapCount === 0) {
      setTapCount(1);
      lastTapTimeRef.current = now;
      setShowDarling(true);
    } else if (tapCount === 1) {
      setTapCount(2);
      const delay = now - lastTapTimeRef.current;
      
      // delayが短いほど過去(P)への執着がない(4P)、長いほどためらった(3P)等
      const score = Math.max(0, 30 - (delay / 150));
      
      setTimeout(() => {
        onNext({ P: score });
      }, 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] w-full relative"
    >
      <p className="text-lg font-light tracking-widest mb-16 text-center z-10 text-current">
        ここを叩いて、<br/>あなたの“最も愛しい時間”を呼んでみて？
      </p>

      <div 
        onClick={handleTap}
        className="w-48 h-48 rounded-full border-2 border-slate-300 bg-white/20 backdrop-blur-md shadow-inner flex items-center justify-center cursor-pointer relative z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent pointer-events-none" />
        {tapCount === 0 && <span className="text-slate-400 opacity-50 font-light tracking-wider">Tap x 2</span>}
        {tapCount === 1 && <span className="text-slate-400 opacity-50 font-light tracking-wider blur-[2px]">Tap...</span>}
        {tapCount >= 2 && <span className="text-slate-800 tracking-wider">Crack!</span>}

        {/* 割れ目エフェクト */}
        {tapCount >= 2 && (
          <svg className="absolute inset-0 w-full h-full text-slate-800 opacity-30 pointer-events-none" viewBox="0 0 100 100">
            <path d="M50 0 L55 20 L40 45 L60 70 L45 100" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M100 50 L75 55 L50 40 L30 65 L0 50" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        )}
      </div>

      <DarlingOverlay 
        show={showDarling && tapCount === 1}
        text="ねぇ、ダーリン♡ 1回目と2回目の間……今、誰のことを思い浮かべた？ “本音”を言わないと、ガラス、割っちゃうよ？"
        position="top"
      />
    </motion.div>
  );
}
