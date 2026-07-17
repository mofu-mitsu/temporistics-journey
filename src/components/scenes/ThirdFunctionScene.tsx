import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneProps } from '../../types';

const OPTIONS = [
  { 
    type: 'P', 
    text: '自分の過去を思い出したくない時がある。', 
    text2: '昔の失敗を何度も思い出してしまう。',
    icon: '📜'
  },
  { 
    type: 'N', 
    text: '「今どこに属しているか」が分からなくなることがある。', 
    text2: '自分の居場所について悩みやすい。',
    icon: '🏡'
  },
  { 
    type: 'B', 
    text: '将来の話になると不安になりやすい。', 
    text2: '先の予定を考えると気が重い。',
    icon: '🚢'
  },
  { 
    type: 'V', 
    text: '人生の意味を考え始めると答えが出ず疲れる。', 
    text2: '哲学的な話題は苦手だ。',
    icon: '🌌'
  }
];

export default function ThirdFunctionScene({ onNext }: SceneProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);

    // 3番目の機能（弱点・コンプレックス）を測る質問
    // 選択されたものに高めのポイントを入れる（3番目として検知するため）
    const type = OPTIONS[index].type;
    const scores = { [type]: -50 }; // 逆にマイナスにする？ いや、一時的にこれを選んだらそれが3になるように全体ロジックを組むのは大変なので、特徴的なスコアとして+30する。
    // いや、3番目は苦手意識が強いので、ネガティブな質問に「はい」と答えたら、それが3番目である可能性が高い。

    setTimeout(() => {
      onNext({ [type]: 15 }, { 
        actionDesc: `苦手意識（第3機能）の選択:\n${OPTIONS[index].text}`,
        scores: { [type]: 15 }
      });
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-lg mx-auto py-8"
    >
      <h2 className="text-xl font-bold mb-2 tracking-widest text-center">最も「苦手・不安」に</h2>
      <h2 className="text-xl font-bold mb-8 tracking-widest text-center">感じるものはどれですか？</h2>
      
      <div className="space-y-4 w-full">
        {OPTIONS.map((opt, i) => (
          <motion.button
            key={i}
            whileHover={selected === null ? { scale: 1.02 } : {}}
            whileTap={selected === null ? { scale: 0.98 } : {}}
            onClick={() => handleSelect(i)}
            disabled={selected !== null}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
              selected === i 
                 ? 'bg-blue-900/50 text-white border-blue-500' 
                 : selected !== null
                  ? 'bg-white/5 border-white/10 opacity-30'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
            }`}
          >
            <div className="relative z-10 flex items-start gap-3">
              <div className="text-2xl mt-1">{opt.icon}</div>
              <div>
                <p className="font-medium tracking-wide text-sm mb-1">{opt.text}</p>
                <p className="opacity-70 text-xs">{opt.text2}</p>
              </div>
            </div>
            
            {selected === i && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 10, opacity: 0.1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-blue-500 rounded-full origin-center" 
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
