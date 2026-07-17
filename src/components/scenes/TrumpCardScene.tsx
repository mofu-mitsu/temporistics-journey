import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneProps } from '../../types';
import DarlingOverlay from '../DarlingOverlay';

export default function TrumpCardScene({ onNext, isActive }: SceneProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const handleDrawStart = () => {
    setIsDrawing(true);
    setHasDrawn(true);
  };
  const handleDrawEnd = () => setIsDrawing(false);

  const handleNext = () => {
    onNext({ P: hasDrawn ? 30 : 10 }, { actionDesc: hasDrawn ? 'キャンバスに文字を書いた' : 'キャンバスに何も書かなかった', scores: { P: hasDrawn ? 30 : 10 } });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] w-full relative"
    >
      <DarlingOverlay 
        show={selected === null}
        text="あ……ダーリン、ちょっと退屈やけん、ウチとゲームしよ？ 1から100で、今のウチの機嫌を当ててみて。トランプ、1枚引いてな？"
        isAwa={true}
        position="top"
      />

      <DarlingOverlay 
        show={selected !== null && !showCanvas}
        text="ふふ、ハズレ♡ ハズレたから……ウチに『好き』って謂うまで、次の質問に進ませてあげん。画面のどこかに、指でなぞってあなたの『本音』を書いてみて？"
        position="top"
      />

      {!showCanvas ? (
        <div className="flex gap-4 z-10 mt-20">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (selected === null) {
                  setSelected(i);
                  setTimeout(() => setShowCanvas(true), 1500);
                }
              }}
              className={`w-12 h-20 rounded bg-white border border-slate-300 shadow-md cursor-pointer flex items-center justify-center transition-all ${selected === i ? 'rotate-y-180 bg-slate-100' : ''}`}
            >
              <div className="w-8 h-16 border border-slate-200 rounded-sm opacity-50 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#ccc_2px,#ccc_4px)]" />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="w-full flex flex-col items-center z-10"
        >
          <div 
            className="w-full max-w-sm h-48 bg-white/10 border border-white/30 rounded-xl mb-6 backdrop-blur-sm relative overflow-hidden touch-none"
            onPointerDown={handleDrawStart}
            onPointerMove={(e) => {
              if (isDrawing) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const dot = document.createElement('div');
                dot.className = 'absolute w-2 h-2 bg-white opacity-80 rounded-full pointer-events-none shadow-[0_0_8px_rgba(255,255,255,0.5)]';
                dot.style.left = `${x}px`;
                dot.style.top = `${y}px`;
                e.currentTarget.appendChild(dot);
              }
            }}
            onPointerUp={handleDrawEnd}
            onPointerLeave={handleDrawEnd}
          >
            <p className="absolute inset-0 flex items-center justify-center text-white/40 pointer-events-none select-none text-sm font-light tracking-wider">
              指でなぞって本音を書いて
            </p>
          </div>

          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-full border border-current text-current hover:bg-black/10 transition-colors tracking-widest text-sm"
          >
            書き終えた
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
