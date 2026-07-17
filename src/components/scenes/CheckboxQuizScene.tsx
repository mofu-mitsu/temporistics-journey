import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { SceneProps } from '../../types';

const QUESTIONS = [
  { text: '過去の出来事は、今の自分を形作る大切な要素だと思う。', type: 'P' },
  { text: '新しい出来事に触れた時、まず『過去に似た例』を思い出すことが多い。', type: 'P' },
  { text: '昔の出来事を振り返ることで、自分を理解できると感じる。', type: 'P' },
  { text: '初対面の人でも、その人がどんな経験をしてきたか過去に興味が湧く。', type: 'P' },
  { text: '自分を他人に説明するとき、経験や歩んできた道のりを重視する。', type: 'P' },
  { text: '昔から変わらない価値観を大切にしたい。', type: 'P' },
  { text: '思い出の品を捨てるのは少し苦手だ。', type: 'P' },
  { text: '「これまで何を積み重ねてきたか」を重視する。', type: 'P' },
  
  { text: '今いる環境が自分に合っているかをよく考える。', type: 'N' },
  { text: '将来よりも、まず今を快適にしたい。', type: 'N' },
  { text: '「居心地の良さ」は人生で重要だと思う。', type: 'N' },
  { text: '周囲の空気や雰囲気の変化によく気付く。', type: 'N' },
  { text: '今この瞬間を楽しむことは大切だと思う。', type: 'N' },
  { text: '現実的な問題は早めに解決したい。', type: 'N' },
  { text: '自分の居場所がなくなることに不安を感じる。', type: 'N' },
  { text: 'その場の状況に合わせるのは比較的得意だ。', type: 'N' },
  
  { text: '「5年後の自分」がどうなっているか具体的に考える。', type: 'B' },
  { text: '「30年後の自分や社会」がどうなっているか想像する。', type: 'B' },
  { text: '「100年後の人類」の未来について思いを馳せることがある。', type: 'B' },
  { text: '将来のために、今の行動を逆算して決める。', type: 'B' },
  { text: '目標がない状態は少し落ち着かない。', type: 'B' },
  { text: '未来の可能性を広げるために、今努力したい。', type: 'B' },
  { text: '選択するときは長期的な影響を考える。', type: 'B' },
  { text: '新しい可能性にはワクワクする。', type: 'B' },
  
  { text: '「人はなぜ生きるのか」を考えたことがある。', type: 'V' },
  { text: '愛や死といった、誰もが直面する『普遍的なテーマ』について考えるのが好きだ。', type: 'V' },
  { text: '社会や世界全体について考えるのが好きだ。', type: 'V' },
  { text: '人生には何らかの意味があると思う。', type: 'V' },
  { text: 'この世界には、目に見えない絶対的な真理や法則があると思う。', type: 'V' },
  { text: '哲学的な話題や、目に見えないものについての議論は面白いと感じる。', type: 'V' },
  { text: '「正しさ」とは何かを考えることがある。', type: 'V' },
  { text: '時代を超えて残る「永遠のもの」に惹かれる。', type: 'V' }
];

export default function CheckboxQuizScene({ onNext }: SceneProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const shuffledQuestions = useMemo(() => {
    const shuffled = [...QUESTIONS].map((q, i) => ({ ...q, originalIndex: i }));
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Limit to 10 questions to not overwhelm in one scene? Or show all?
    // User requested "これチェックボックス問題も作ってくれる？"
    // Let's show all but in a scrollable list.
    return shuffled;
  }, []);

  const toggleCheck = (index: number) => {
    const newSelected = new Set(selected);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelected(newSelected);
  };

  const handleSubmit = () => {
    let p = 0, n = 0, b = 0, v = 0;
    let actionDesc = 'チェックボックス診断:\n';
    selected.forEach(idx => {
      const type = shuffledQuestions[idx].type;
      actionDesc += `・${shuffledQuestions[idx].text} (${type})\n`;
      if (type === 'P') p += 50;
      if (type === 'N') n += 50;
      if (type === 'B') b += 50;
      if (type === 'V') v += 50;
    });
    
    if (selected.size === 0) {
      actionDesc += '（選択なし）\n';
    }

    onNext({ P: p, N: n, B: b, V: v }, { actionDesc, scores: { P: p, N: n, B: b, V: v } });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center min-h-[400px] w-full max-w-2xl mx-auto py-8 px-4"
    >
      <h2 className="text-xl font-bold mb-4 tracking-widest text-center">当てはまるものを選んでください</h2>
      <p className="text-sm opacity-60 mb-8 text-center">複数選択可能です。直感で選んでください。</p>

      <div className="w-full space-y-3 mb-12 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {shuffledQuestions.map((q, idx) => (
          <label 
            key={idx}
            className={`flex items-start p-4 rounded-xl border transition-colors cursor-pointer select-none ${
              selected.has(idx) 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/40'
            }`}
          >
            <input 
              type="checkbox" 
              className="hidden" 
              checked={selected.has(idx)}
              onChange={() => toggleCheck(idx)}
            />
            <div className={`w-6 h-6 rounded flex-shrink-0 flex items-center justify-center mr-4 border transition-colors mt-0.5 ${
              selected.has(idx)
                ? 'border-blue-500 bg-blue-500'
                : 'border-slate-500 bg-slate-900/50'
            }`}>
              {selected.has(idx) && <i className="fa-solid fa-check text-white text-xs"></i>}
            </div>
            <span className="text-sm leading-relaxed text-slate-200">{q.text}</span>
          </label>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
      >
        決定する
      </button>
    </motion.div>
  );
}
