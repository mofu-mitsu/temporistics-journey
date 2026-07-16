import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneProps } from '../../types';
import DarlingOverlay from '../DarlingOverlay';

export default function BugMashScene({ onNext, isActive }: SceneProps) {
  const [clicks, setClicks] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [finished, setFinished] = useState(false);
  
  const targetClicks = 30;
  
  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => {
      if (!finished) {
        setTimeUp(true);
        setTimeout(() => {
          onNext({ N: 0 }); // 諦めた、あるいは遅かったので N 等のスコア0
        }, 3000);
      }
    }, 8000); // 8秒でタイムアップ
    
    return () => clearTimeout(timer);
  }, [isActive, finished]);

  const handleClick = (e: any) => {
    e.preventDefault();
    if (timeUp || finished) return;
    
    const newClicks = clicks + 1;
    setClicks(newClicks);
    
    if (newClicks >= targetClicks) {
      setFinished(true);
      setTimeout(() => {
        onNext({ N: 100 }); // 完遂
      }, 2000);
    }
  };

  const isAwaMode = clicks >= 15 && clicks < targetClicks;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] w-full relative overflow-hidden"
    >
      {/* 侵食エフェクト */}
      <motion.div 
        className="absolute inset-0 bg-[#4a3b32] z-0"
        initial={{ y: '100%' }}
        animate={{ y: finished ? '100%' : `${100 - (clicks / targetClicks) * 100}%` }}
        transition={{ duration: 0.2 }}
      />
      
      <div className="z-10 text-center mb-8 pointer-events-none text-current">
        <h3 className="text-xl font-bold mb-2">SYSTEM ALERT</h3>
        <p className="font-mono text-sm">境界線確保。侵入継続。感覚支配成功</p>
      </div>

      <div className="relative z-10 w-full h-48 flex items-center justify-center">
        <AnimatePresence>
          {!finished && (
            <motion.div
              onPointerDown={handleClick}
              className="text-8xl cursor-pointer select-none touch-none"
              whileTap={{ scale: 0.8, rotate: Math.random() * 20 - 10 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              🐛
            </motion.div>
          )}
        </AnimatePresence>
        
        {finished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-2xl font-bold tracking-widest text-white mix-blend-difference"
          >
            CLEAR
          </motion.div>
        )}
      </div>
      
      <div className="z-10 mt-8 w-full max-w-xs bg-slate-200 h-2 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-slate-800"
          animate={{ width: `${(clicks / targetClicks) * 100}%` }}
        />
      </div>

      {!finished && (
        <button
          onClick={() => {
            setFinished(true);
            setTimeout(() => onNext({ V: 20, P: 10 }), 1000);
          }}
          className="z-10 mt-12 px-6 py-2 bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full text-xs transition-colors border border-slate-700"
        >
          無視して進む
        </button>
      )}

      {!isAwaMode && clicks < 15 && (
        <DarlingOverlay 
          show={clicks > 0}
          text="きゃっ、ダーリン、あいつがシステムの美しさを汚しに来たわ！ はやく退治して！ 画面を連打して圧殺して！"
          position="top"
        />
      )}

      {isAwaMode && !finished && (
        <DarlingOverlay 
          show={true}
          text="……なぁ、そんなに必死になって芋虫叩いて、可愛いなぁ。無駄な抵抗、必死にしとる姿が、ウチ、一番そそるんよ……♡"
          isAwa={true}
          position="top"
        />
      )}
    </motion.div>
  );
}
