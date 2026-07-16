import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  step: number;
}

export default function ButterflyObserver({ step }: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: '10%', y: '10%' });
  const [isHidden, setIsHidden] = useState(false);
  
  const lastActionTime = useRef(Date.now());
  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 戻るボタンの検知 (ブラウザバック)
    const handlePopState = () => {
      setMessage("忘れ物？");
      setTimeout(() => setMessage(null), 4000);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      lastActionTime.current = Date.now();
      
      // 連打検知
      clickCount.current += 1;
      if (clickTimer.current) clearTimeout(clickTimer.current);
      
      if (clickCount.current > 5) {
        setMessage("そんなに先を見たい？");
        clickCount.current = 0;
        setTimeout(() => setMessage(null), 4000);
      } else {
        clickTimer.current = setTimeout(() => {
          clickCount.current = 0;
        }, 2000);
      }

      // 蝶がたまにクリックした場所の近くに寄ってくる
      if (Math.random() > 0.7 && !isHidden) {
        setPosition({
          x: `${Math.max(10, Math.min(90, (e.clientX / window.innerWidth) * 100))}%`,
          y: `${Math.max(10, Math.min(90, ((e.clientY - 50) / window.innerHeight) * 100))}%`
        });
      }
    };
    
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [isHidden]);

  useEffect(() => {
    // 放置検知ループ
    const idleCheck = setInterval(() => {
      if (step === 0 || step >= 16 || isHidden) return;
      
      const idleTime = Date.now() - lastActionTime.current;
      
      if (idleTime > 30000) { // 30秒
        setMessage("私はどちらでも待ってる。");
      } else if (idleTime > 20000) { // 20秒
        setMessage("急いでもいい。\nゆっくりでもいい。");
      } else if (idleTime > 10000) { // 10秒
        setMessage("時間は逃げないよ。");
      } else if (idleTime > 5000) { // 5秒
        setMessage("迷ってる？");
        // ランダムな位置に飛ぶ
        if (!message) { 
           setPosition({
             x: `${10 + Math.random() * 80}%`,
             y: `${10 + Math.random() * 80}%`
           });
        }
      } else {
        setMessage(null);
      }
    }, 1000);

    return () => clearInterval(idleCheck);
  }, [message, step, isHidden]);

  if (step === 0 || step >= 16 || isHidden) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHidden(true);
    setTimeout(() => {
      setIsHidden(false);
      lastActionTime.current = Date.now(); // 復活時に放置タイマーリセット
    }, 10000); // 10秒後に戻ってくる
  };

  return (
    <motion.div
      animate={{ 
        left: position.x, 
        top: position.y,
        y: [0, -10, 0, 10, 0],
        x: [0, 5, 0, -5, 0]
      }}
      transition={{ 
        left: { type: "spring", stiffness: 50, damping: 20 },
        top: { type: "spring", stiffness: 50, damping: 20 },
        y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
        x: { repeat: Infinity, duration: 3, ease: "easeInOut" }
      }}
      className="fixed z-50"
    >
      <div className="relative">
        <motion.div 
          onClick={handleDismiss}
          animate={{ scaleX: [1, 0.2, 1] }} 
          transition={{ repeat: Infinity, duration: 0.15 + Math.random() * 0.1, ease: "easeInOut" }}
          className="text-3xl cursor-pointer drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] hover:scale-110 transition-transform"
          title="クリックで少しの間追い払う"
        >
          🦋
        </motion.div>
        
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-max max-w-[200px] pointer-events-none"
            >
              <div className="bg-slate-800/90 backdrop-blur-md text-white p-3 rounded-2xl rounded-tl-none border border-slate-600/50 text-xs font-mono tracking-widest leading-relaxed whitespace-pre-wrap shadow-lg">
                {message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
