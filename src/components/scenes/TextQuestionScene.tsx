import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneProps, ResultData } from '../../types';

export interface Choice {
  text: string;
  scores: Partial<ResultData>;
}

interface TextQuestionProps extends SceneProps {
  question: string;
  description?: string;
  choices: Choice[];
}

export default function TextQuestionScene({ onNext, isActive, question, description, choices }: TextQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);

    setTimeout(() => {
      onNext(choices[index].scores, { actionDesc: `質問「${question}」\n選択: ${choices[index].text}`, scores: choices[index].scores });
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-lg mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 text-current w-full mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent opacity-50" />
        
        <h2 className="text-xl md:text-2xl font-light tracking-wide mb-4 leading-relaxed">
          {question}
        </h2>
        
        {description && (
          <p className="text-sm opacity-70 font-light mb-8">
            {description}
          </p>
        )}

        <div className="space-y-4">
          {choices.map((choice, i) => (
            <motion.button
              key={i}
              whileHover={selected === null ? { scale: 1.02 } : {}}
              whileTap={selected === null ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                selected === i 
                  ? 'bg-slate-800 text-white border-slate-700' 
                  : selected !== null
                    ? 'bg-white/5 border-white/10 opacity-30'
                    : 'bg-white/40 hover:bg-white/60 border-white/50 text-slate-700'
              }`}
            >
              <div className="relative z-10 flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                  selected === i ? 'border-white/30 text-white' : 'border-slate-800/20 text-slate-800/50'
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="font-medium tracking-wide text-sm">{choice.text}</span>
              </div>
              
              {selected === i && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 10, opacity: 0.1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-white rounded-full origin-center" 
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
