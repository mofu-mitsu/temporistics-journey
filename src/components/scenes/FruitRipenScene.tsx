import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneProps } from '../../types';

// 各状態ごとに、P・N·B・Vに対応した理由をオブジェクトの配列として持たせる！
const STAGES = [
  { 
    icon: '🍏', 
    label: 'まだ青い。', 
    desc: 'これから成長する可能性',
    reasons: [
      { type: 'B', text: 'これからどう育つか未来が楽しみだから' },
      { type: 'P', text: 'まだ何にも染まっていない原点が好きだから' },
      { type: 'V', text: '未完成という普遍的な美しさがあるから' },
      { type: 'N', text: '「今この瞬間」しか見られない青さだから' },
      { type: null, text: 'なんとなく惹かれるから' },
    ]
  },
  { 
    icon: '🍋', 
    label: '食べ頃。', 
    desc: '今すぐ味わえる鮮度',
    reasons: [
      { type: 'N', text: '今すぐ食べるのに一番ベストな鮮度だから' },
      { type: 'B', text: 'ここからさらに熟していく前兆の時期だから' },
      { type: 'P', text: 'ちょうど良いところまで育ってきたから' },
      { type: 'V', text: '全体的なバランスが完成されているから' },
      { type: null, text: 'みみずみずしくて美味しそうだから' },
    ]
  },
  { 
    icon: '🍊', 
    label: '完熟。', 
    desc: '最も甘く熟したピーク',
    reasons: [
      { type: 'N', text: '今味わいたいから' },
      { type: 'V', text: '完成形だと思うから' },
      { type: 'B', text: '種を残したいから' },
      { type: 'P', text: 'ここまで育った過程が好きだから' },
      { type: null, text: '美味しそうだから' },
    ]
  },
  { 
    icon: '🍂', 
    label: '落ちた。', 
    desc: '土に還り、種を残す',
    reasons: [
      { type: 'B', text: '次の世代（未来）へ命を繋いでいるから' },
      { type: 'P', text: '一つのサイクルを終えた歴史を感じるから' },
      { type: 'V', text: '永遠の循環の一部として美しいから' },
      { type: 'N', text: '今まさに自然に還る瞬間だから' },
      { type: null, text: '哀愁があって惹かれるから' },
    ]
  },
];

export default function FruitRipenScene({ onNext }: SceneProps) {
  const [sliderValue, setSliderValue] = useState(0); // 0 to 100
  const [phase, setPhase] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const getStageIndex = (val: number) => {
    if (val < 25) return 0;
    if (val < 50) return 1;
    if (val < 75) return 2;
    return 3;
  };

  const stageIndex = getStageIndex(sliderValue);
  const currentStage = STAGES[stageIndex];

  const handleNextPhase = () => {
    setPhase(1);
  };

  const handleComplete = (type: 'P' | 'N' | 'B' | 'V' | null, reason: string) => {
    setSubmitted(true);
    setTimeout(() => {
      const scores = type ? { [type]: 30 } : {};
      const typeLabel = type ? `(${type}) `: '(判定なし)';
      onNext(
        scores,
        {
          actionDesc: `果実の状態で「${currentStage.label}」を選び、理由は「${reason}」${typeLabel}を選択`,
          scores: scores
        }
      );
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center p-8 rounded-3xl glass-card text-center"
    >
      <AnimatePresence mode="wait">
        {phase === 0 ? (
          <motion.div key="phase0" className="w-full flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
            <p className="text-lg font-light tracking-widest mb-12">
              果実が実っています。
            </p>

            <div className="relative w-full max-w-xs h-40 flex items-center justify-center mb-10 overflow-hidden">
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-yellow-500/10 blur-xl rounded-full"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={stageIndex}
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotate: stageIndex === 3 ? 90 : 0,
                    y: stageIndex === 3 ? 30 : 0
                  }}
                  exit={{ opacity: 0, scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.4 }}
                  className="text-8xl relative z-10 filter drop-shadow-xl"
                >
                  {currentStage.icon}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="w-full max-w-xs mb-10">
              <div className="flex justify-between text-xs opacity-60 font-mono mb-4 px-2">
                <span>🌱 成長</span>
                <span>熟成 ⏳</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-200/50 rounded-lg appearance-none cursor-pointer accent-slate-700"
              />
              
              <div className="mt-8 h-16">
                <motion.div
                  key={stageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1"
                >
                  <div className="font-bold text-lg tracking-wide">{currentStage.label}</div>
                  <div className="text-xs opacity-70">{currentStage.desc}</div>
                </motion.div>
              </div>
            </div>

            <p className="text-sm opacity-80 mb-6 font-medium">
              どの状態が一番魅力的ですか？
            </p>

            <button
              onClick={handleNextPhase}
              className="w-full max-w-xs p-4 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium tracking-widest flex items-center justify-center gap-2"
            >
              <span>この状態を選ぶ</span>
            </button>
          </motion.div>
        ) : (
          <motion.div key="phase1" className="w-full flex flex-col items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-6xl mb-6">{currentStage.icon}</div>
            <p className="text-lg font-light tracking-widest mb-8">
              なぜ、その状態を選びましたか？
            </p>
            
            <div className="grid grid-cols-1 gap-3 w-full max-w-xs">
              {currentStage.reasons.map((reason, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleComplete(reason.type as 'P' | 'N' | 'B' | 'V' | null, reason.text)}
                  disabled={submitted}
                  className="p-4 border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors text-sm text-left disabled:opacity-50"
                >
                  {reason.text}
                </button>
              ))}
            </div>
            {/* 砂時計アニメーションを復旧！ */}
            {submitted && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="mt-8 text-2xl">⏳</motion.div>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}