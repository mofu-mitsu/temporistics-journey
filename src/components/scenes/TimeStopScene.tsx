import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SceneProps } from '../../types';

export default function TimeStopScene({ onNext, isActive }: SceneProps) {
  const [isStopped, setIsStopped] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!isActive || isStopped) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      setTime(Date.now() - startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isStopped]);

  const handleStop = () => {
    if (isStopped) return;
    setIsStopped(true);

    // 最大約15秒としてスコア化
    const score = Math.min((time / 15000) * 100, 100);

    setTimeout(() => {
      onNext({ V: score });
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1.5 }}
      className="flex flex-col items-center justify-center p-8 rounded-3xl glass-card text-white overflow-hidden relative cursor-pointer min-h-[400px]"
      onClick={handleStop}
    >
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <p className="text-lg font-light tracking-widest text-center opacity-80 mix-blend-difference">
          {isStopped ? '時が、止まりました。' : '「今だ」と思う瞬間、画面に触れてください。'}
        </p>
      </div>

      {/* 浮遊する要素たち */}
      <motion.div
        className="absolute top-1/4 left-1/4 text-4xl"
        animate={isStopped ? { rotate: 0 } : { rotate: 360, x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      >
        🕰️
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 right-1/4 text-5xl"
        animate={isStopped ? {} : { rotate: -360, x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      >
        ⚙️
      </motion.div>
      <motion.div
        className="absolute top-1/2 right-1/3 text-2xl"
        animate={isStopped ? {} : { y: [0, -100, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        ✨
      </motion.div>
    </motion.div>
  );
}
