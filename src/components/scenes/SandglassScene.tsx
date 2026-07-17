import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SceneProps } from '../../types';

export default function SandglassScene({ onNext, isActive }: SceneProps) {
  const [progress, setProgress] = useState(0);
  const [isStopped, setIsStopped] = useState(false);

  useEffect(() => {
    if (!isActive || isStopped) return;

    let startTime = Date.now();
    const duration = 10000; // 10秒

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min((elapsed / duration) * 100, 100);
      setProgress(p);

      if (p >= 100) {
        clearInterval(interval);
        handleStop(true);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, isStopped]);

  const handleStop = (isTimeout = false) => {
    if (isStopped) return;
    setIsStopped(true);
    // 早く止めたらBが高い(未来を自分で決める)
    // 遅く止めたらBが低い(運命を待つ)
    const score = isTimeout === true ? 0 : (100 - progress) * 0.3;
    
    // 少し余韻を残して次へ
    setTimeout(() => {
      onNext({ B: score });
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1.5 }}
      className="flex flex-col items-center justify-center p-8 rounded-3xl glass-card"
    >
      <p className="text-lg font-light tracking-widest mb-16 text-center">
        砂時計の砂が落ちています。<br />
        好きなタイミングで、止めてください。
      </p>

      <div className="text-8xl mb-8 relative">
        ⏳
        <motion.div
          className="absolute inset-0 bg-white/50 rounded-lg mix-blend-overlay"
          initial={{ height: '0%' }}
          animate={{ height: `${progress}%` }}
          transition={{ ease: 'linear', duration: 0.1 }}
        />
      </div>

      <p className="text-sm font-mono opacity-50 mb-12">
        {progress.toFixed(1)}%
      </p>

      <button
        onClick={handleStop}
        disabled={isStopped}
        className="px-12 py-4 rounded-full border border-current text-current hover:bg-black/5 transition-colors tracking-widest text-sm disabled:opacity-0 disabled:pointer-events-none transition-opacity duration-500"
      >
        止める
      </button>
    </motion.div>
  );
}
