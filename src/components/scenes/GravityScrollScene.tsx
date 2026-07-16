import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import { SceneProps } from '../../types';
import DarlingOverlay from '../DarlingOverlay';

export default function GravityScrollScene({ onNext, isActive }: SceneProps) {
  const [velocity, setVelocity] = useState(0);
  const [scrollPos, setScrollPos] = useState(0);
  const [isStopped, setIsStopped] = useState(false);
  const [stopTime, setStopTime] = useState<number | null>(null);
  
  const startTime = useRef(Date.now());
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive || isStopped) return;

    const update = () => {
      setVelocity(prev => Math.min(prev + 0.1, 15)); // 徐々に加速
      setScrollPos(prev => prev - velocity);
      
      if (velocity > 10 && !isStopped) {
        setIsStopped(true);
        setStopTime(Date.now());
      } else {
        animationRef.current = requestAnimationFrame(update);
      }
    };
    
    animationRef.current = requestAnimationFrame(update);
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, isStopped, velocity]);

  const handlePointerDown = () => {
    if (!isStopped) return;
    
    const reactionTime = stopTime ? Date.now() - stopTime : 0;
    // 反応が早いほど N(現在) が高い、遅いほど B(未来) または P(過去) に引っ張られている
    onNext({ N: Math.max(0, 100 - reactionTime / 20) });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] w-full overflow-hidden relative touch-none"
      onPointerDown={handlePointerDown}
    >
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <motion.div 
           className="w-full h-[200vh] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjwvc3ZnPg==')] opacity-50"
           animate={{ y: scrollPos % 40 }}
           transition={{ duration: 0 }}
         />
      </div>

      <p className="text-lg font-light tracking-widest mb-16 text-center z-10">
        画面を下へ...<br/>時間の重力に身を任せて。
      </p>

      <DarlingOverlay 
        show={isStopped}
        text="おっと、ダーリン♡ 急いでどこへ行くの？……時間の流れが速くなると、人間ってすぐ焦って本音をこぼすのよね。ほら、指、ピタッと止めてみて？"
        position="top"
      />
    </motion.div>
  );
}
