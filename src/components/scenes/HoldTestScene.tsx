import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { SceneProps } from '../../types';
import DarlingOverlay from '../DarlingOverlay';

export default function HoldTestScene({ onNext, isActive }: SceneProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDarling, setShowDarling] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  
  const holdStartRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  
  // 3秒で完了
  const duration = 3000;

  const handlePointerUp = () => {
    if (hasFinished) return;
    setIsHolding(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    
    if (holdStartRef.current) {
      const elapsed = Date.now() - holdStartRef.current;
      // 途中で離した場合はN(現在)スコアを高めにして次へ
      if (elapsed < duration) {
        setHasFinished(true);
        // 驚いて離したならNが高い
        onNext({ N: (100 - (elapsed / duration) * 100) * 0.3 }); 
      }
    }
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const updateProgress = () => {
    if (!holdStartRef.current) return;
    const elapsed = Date.now() - holdStartRef.current;
    const currentProgress = Math.min((elapsed / duration) * 100, 100);
    setProgress(currentProgress);

    if (currentProgress > 90 && !showDarling && !hasFinished) {
      setShowDarling(true);
    }

    if (currentProgress >= 100) {
      setHasFinished(true);
      setShowDarling(false);
      onNext({ V: 30 });
      return;
    }

    rafRef.current = requestAnimationFrame(updateProgress);
  };

  const handlePointerDown = (e: any) => {
    if (hasFinished) return;
    setIsHolding(true);
    holdStartRef.current = Date.now();
    rafRef.current = requestAnimationFrame(updateProgress);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center min-h-[400px] relative w-full h-full"
    >
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20 transition-colors duration-500" style={{ backgroundColor: isHolding ? 'purple' : 'transparent' }} />
      
      <p className="text-lg font-light tracking-widest mb-16 text-center z-10">
        ここに、あなたの時間を<br/>3秒間だけ預けて？
      </p>

      <div 
        className="relative w-32 h-32 flex items-center justify-center cursor-pointer z-10 touch-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <motion.div 
          className="absolute inset-0 rounded-full border border-slate-400"
          animate={{ scale: isHolding ? 1.5 : 1, opacity: isHolding ? 0 : 1 }}
          transition={{ duration: 1, repeat: isHolding ? Infinity : 0 }}
        />
        <motion.div 
          className="w-12 h-12 bg-slate-800 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          animate={{ scale: isHolding ? 0.8 : 1 }}
        />
        
        {/* プログレス円 */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
          <circle
            cx="64"
            cy="64"
            r="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="377"
            strokeDashoffset={377 - (377 * progress) / 100}
            className="text-slate-800 transition-all duration-75"
          />
        </svg>
      </div>

      <DarlingOverlay 
        show={showDarling && isHolding} 
        text="……本当に、今、離して大丈夫？♡" 
        position="top"
      />
    </motion.div>
  );
}
