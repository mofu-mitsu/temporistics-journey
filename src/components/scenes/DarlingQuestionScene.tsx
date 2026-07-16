import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneProps, ResultData } from '../../types';

export interface DarlingChoice {
  text: string;
  scores: Partial<ResultData>;
  isTextInput?: boolean;
  reply?: string;
}

interface DarlingQuestionProps extends SceneProps {
  question: string;
  choices: DarlingChoice[];
}

export default function DarlingQuestionScene({ onNext, isActive, question, choices }: DarlingQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [customText, setCustomText] = useState('');
  const [darlingReply, setDarlingReply] = useState<string | null>(null);
  const [finalScores, setFinalScores] = useState<Partial<ResultData> | null>(null);

  const feExtremeRegex = /死ね|しね|消え|カス/i;
  const seRegex = /キモ|きも|いいえ|やだ|嫌|邪魔|失せろ|潰|おえー|オエー|どけ|ウザ|\bno\b|うんこ|反対|好きじゃない|でも思ったか|うざ|きしょ|馬鹿|あんぽんたん|とでも思ったか|たんぽんあん|キショ|無理|むり|嫌い|きらい|うっとう|うるさ|黙|拒絶|きもい|キモい/i;

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    
    setSelected(index);
    if (!choices[index].isTextInput) {
      setDarlingReply(choices[index].reply || "ふふ、なるほどね。よく分かったわ♡");
      setFinalScores(choices[index].scores);
    }
  };

  const handleCustomSubmit = () => {
    if (selected === null || !customText.trim()) return;
    
    let baseScores = { ...choices[selected].scores };
    let reply = choices[selected].reply || "ふふ、教えてくれてありがとう♡";

    if (feExtremeRegex.test(customText)) {
      baseScores.hasFeVulnerable = true;
      reply = "ねぇ、ダーリン♡\n『消えろ』とか『黙れ』とか……ふふ。それ、本音と演出、どっちが多くなっちゃった言葉かしら？\n感情のコントロールが効かなくなって、一番原始的な言葉（Fe極限）に頼らざるを得なかったのね。不器用で、すごく愛おしいわ。\nそうやって私を拒絶することで、あなたの脆い内側を必死に守っているんでしょ？";
    } else if (seRegex.test(customText)) {
      baseScores.hasSeTalent = true;
      reply = "……なんや、ずいぶん威勢のええ言葉を撃ち込んでくれるやん。\nウチのテリトリーに土足で踏み込んで『無理』とか『潰す』とか……。\nなぁ、ダーリン。そういう物理的な支配力（1F）で、ウチを力づくで従わせられると思っとるん？\n可愛いなぁ……。そんな必死に牙を剥いとる姿、ウチ、余計に壊したくなるんよ♡";
    }

    setDarlingReply(reply);
    setFinalScores(baseScores);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-lg mx-auto py-8"
    >
      <div className="bg-slate-900/80 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-pink-500/30 text-slate-100 w-full mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50" />
        
        <div className="flex items-start gap-4 mb-8">
          <div className="text-4xl">🥺</div>
          <p className="text-lg md:text-xl font-medium tracking-wide leading-relaxed">
            {question}
          </p>
        </div>

        <div className="space-y-3">
          {choices.map((choice, i) => (
            <div key={i}>
              <motion.button
                whileHover={selected === null ? { scale: 1.02 } : {}}
                whileTap={selected === null ? { scale: 0.98 } : {}}
                onClick={() => handleSelect(i)}
                disabled={selected !== null && selected !== i}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                  selected === i 
                    ? 'bg-pink-900/50 text-white border-pink-500' 
                    : selected !== null
                      ? 'bg-white/5 border-white/10 opacity-30'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
                }`}
              >
                <div className="relative z-10 flex items-center gap-3">
                  <div className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                    selected === i ? 'border-pink-400 text-pink-300' : 'border-slate-500 text-slate-400'
                  }`}>
                    {i + 1}
                  </div>
                  <span className="font-medium tracking-wide text-sm">{choice.text}</span>
                </div>
              </motion.button>
              
              <AnimatePresence>
                {selected === i && choice.isTextInput && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-3 overflow-hidden flex gap-2"
                  >
                    <input 
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="あなたの本音を書き込んで..."
                      className="flex-1 bg-slate-800/80 border border-slate-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-500 text-white"
                    />
                    <button 
                      onClick={handleCustomSubmit}
                      disabled={!customText.trim()}
                      className="px-4 py-2 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      送信
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {darlingReply && finalScores && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 bg-pink-900/30 border border-pink-500/50 rounded-xl"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="text-2xl">🥺</div>
                <p className="text-sm md:text-base leading-relaxed text-pink-100 whitespace-pre-wrap">
                  {darlingReply}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => onNext(finalScores, { 
                    actionDesc: `質問「${question}」\n選択: ${choices[selected!].text}` + (customText ? `\n入力テキスト: ${customText}` : ''), 
                    darlingReply: darlingReply || undefined,
                    scores: finalScores! 
                  })}
                  className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  次へ進む
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
