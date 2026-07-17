import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { SceneProps, ResultData } from '../../types';
import DarlingOverlay from '../DarlingOverlay';

export default function FreezeWriteScene({ onNext, isActive }: SceneProps) {
  const [text, setText] = useState('');
  const [frozen, setFrozen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [darlingReply, setDarlingReply] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const feExtremeRegex = /死ね|しね|消え|カス/i;
  const seRegex = /キモ|きも|いいえ|やだ|嫌|邪魔|失せろ|潰|おえー|オエー|どけ|ウザ|\bno\b|うんこ|反対|好きじゃない|でも思ったか|うざ|きしょ|馬鹿|あんぽんたん|とでも思ったか|たんぽんあん|キショ|無理|むり|嫌い|きらい|うっとう|うるさ|黙|拒絶|きもい|キモい/i;

  const handleComplete = (finalText: string) => {
    setFrozen(true);
    let scores: Partial<ResultData> = { P: 0 };
    let finalReply = "時間切れ……。何も書けなかったの？ 過去に向き合うのが怖かったのかしら。可愛いわね♡";
    
    if (finalText) {
      const cost = 20 - timeLeft;
      scores.P = Math.max(0, 100 - cost * 5);
      
      finalReply = "ふふ、面白い言葉を書くのね。それは『演出』？ それとも、ただの『防衛』かしら。消去（デリート）はさせないから、そのまま過去のアーカイブに飾っておくね♡";

      if (feExtremeRegex.test(finalText)) {
        scores.hasFeVulnerable = true;
        finalReply = "ねぇ、ダーリン♡\n『消えろ』とか『黙れ』とか……ふふ。それ、本音と演出、どっちが多くなっちゃった言葉かしら？\n感情のコントロールが効かなくなって、一番原始的な言葉（Fe極限）に頼らざるを得なかったのね。不器用で、すごく愛おしいわ。\nそうやって私を拒絶することで、あなたの脆い内側を必死に守っているんでしょ？";
      } else if (seRegex.test(finalText)) {
        scores.hasSeTalent = true;
        finalReply = "……なんや、ずいぶん威勢のええ言葉を撃ち込んでくれるやん。\nウチのテリトリーに土足で踏み込んで『無理』とか『潰す』とか……。\nなぁ、ダーリン。そういう物理的な支配力（1F）で、ウチを力づくで従わせられると思っとるん？\n可愛いなぁ……。そんな必死に牙を剥いとる姿、ウチ、余計に壊したくなるんよ♡";
      }
      setDarlingReply(finalReply);
    } else {
      setDarlingReply(finalReply);
    }
    
    setTimeout(() => onNext(scores, { actionDesc: finalText ? `入力テキスト: ${finalText}` : "時間切れで何も書かなかった", darlingReply: finalReply, scores }), 8000);
  };

  useEffect(() => {
    if (isActive && !frozen) {
      inputRef.current?.focus();
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleComplete(text);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isActive, frozen, text]);

  const handleChange = (e: any) => {
    if (frozen) return;
    setText(e.target.value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && text.length > 0 && !frozen) {
      handleComplete(text);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, backgroundColor: 'transparent' }}
      animate={{ opacity: 1, backgroundColor: frozen ? '#000000' : 'transparent' }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] w-full relative"
    >
      <DarlingOverlay 
        show={!frozen}
        text="ねぇ、ダーリン♡ 20秒以内に、頭に浮かんだ“昨日”をあらわす言葉をここに書いて？ 悩んだら、その時点で時間切れよ♡（送信を押してね）"
        position="top"
      />
      <div className="z-10 w-full max-w-xs relative mt-24">
        <div className={`flex w-full bg-slate-900/50 rounded-lg overflow-hidden border-b-2 transition-colors focus-within:border-blue-500 ${frozen ? 'border-blue-500' : 'border-slate-400'}`}>
          <input 
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            readOnly={frozen}
            placeholder={frozen ? "" : "ここに入力してね..."}
            className={`flex-1 bg-transparent text-center text-2xl py-4 focus:outline-none placeholder:text-slate-500/50 ${frozen ? 'text-blue-400' : 'text-white'}`}
          />
          {!frozen && text.length > 0 && (
            <button 
              onClick={() => handleComplete(text)}
              className="px-6 bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-paper-plane"></i>送信
            </button>
          )}
        </div>
        {!frozen && (
          <p className="absolute right-0 -bottom-8 text-sm font-mono animate-pulse">
            00:{timeLeft.toString().padStart(2, '0')}
          </p>
        )}
      </div>

      <DarlingOverlay 
        show={frozen}
        text={darlingReply || ""}
        position="top"
      />
    </motion.div>
  );
}
