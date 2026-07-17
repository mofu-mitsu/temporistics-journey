import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneProps, TemporisticsType } from '../../types';

interface Question {
  type: TemporisticsType;
  text: string;
}

const QUESTIONS: Question[] = [
  { type: 'P', text: '自分という人間を説明するとき、過去の経験を思い浮かべる。' },
  { type: 'N', text: '自宅以外にも「ここは落ち着く」と思える場所がある。' },
  { type: 'B', text: '今の選択が数年後につながると考える。' },
  { type: 'V', text: '時代が変わっても変わらない価値があると思う。' }
];

const CHOICES = [
  { label: 'そう思う', score: 30 },
  { label: 'ややそう思う', score: 15 },
  { label: 'どちらともいえない', score: 0 },
  { label: 'あまりそう思わない', score: -15 },
  { label: 'そう思わない', score: -30 }
];

export default function LikertScaleScene({ onNext }: SceneProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ type: TemporisticsType; score: number; label: string }[]>([]);

  const handleSelect = (score: number, label: string) => {
    const currentQ = QUESTIONS[currentIndex];
    const newAnswers = [...answers, { type: currentQ.type, score, label }];
    
    if (currentIndex < QUESTIONS.length - 1) {
      setAnswers(newAnswers);
      setCurrentIndex(prev => prev + 1);
    } else {
      // 終了
      const finalScores = { P: 0, N: 0, B: 0, V: 0 };
      let actionDesc = '5段階評価:\n';
      newAnswers.forEach(ans => {
        finalScores[ans.type] += ans.score;
        const qText = QUESTIONS.find(q => q.type === ans.type)?.text;
        actionDesc += `・${qText}\n  → ${ans.label}\n`;
      });
      
      onNext(finalScores, { actionDesc, scores: finalScores });
    }
  };

  const currentQ = QUESTIONS[currentIndex];

  return (
    <motion.div
      key={currentIndex}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-lg mx-auto py-8 px-4"
    >
      <div className="w-full mb-8 flex gap-2 justify-center">
        {QUESTIONS.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 flex-1 max-w-[40px] rounded-full transition-colors duration-500 ${
              i <= currentIndex ? 'bg-blue-500' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      <h2 className="text-xl md:text-2xl font-medium tracking-wide mb-12 leading-relaxed text-center min-h-[80px] flex items-center justify-center">
        {currentQ.text}
      </h2>

      <div className="flex flex-col w-full gap-3">
        {CHOICES.map((choice, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(choice.score, choice.label)}
            className="w-full py-4 px-6 rounded-xl border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-center text-sm md:text-base font-medium shadow-sm"
          >
            {choice.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
