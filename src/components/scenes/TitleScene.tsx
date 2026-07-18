import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResultData } from '../../types';

interface Props { key?: string;
  onNext: (scores: Partial<ResultData>) => void;
}

export default function TitleScene({ onNext }: Props) {
  const [squeeze, setSqueeze] = useState(0);
  const startTime = useRef<number | null>(null);
  const hasFinished = useRef(false);
  const [isJuicing, setIsJuicing] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selfType, setSelfType] = useState('');

  const handleDrag = (event: any, info: any) => {
    if (hasFinished.current) return;
    
    if (startTime.current === null) {
      startTime.current = Date.now();
    }
    
    const dragAmount = Math.abs(info.offset.x) + Math.abs(info.offset.y);
    const newSqueeze = Math.min(dragAmount / 150, 1);
    setSqueeze(newSqueeze);

    if (newSqueeze >= 1 && !hasFinished.current) {
      hasFinished.current = true;
      setIsJuicing(true);
      const duration = Date.now() - (startTime.current || Date.now());
      const nScore = Math.max(0, 100 - duration / 50);
      
      setTimeout(() => {
        onNext({ N: nScore, selfIdentifiedType: selfType });
      }, 1800);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center text-center p-8 md:p-12 rounded-3xl glass-card relative overflow-hidden w-full max-w-lg mx-auto"
    >
      {/* シトラス背景演出 */}
      <motion.div
        className="absolute -top-20 -right-20 w-64 h-64 border-[30px] border-yellow-300/40 rounded-full mix-blend-multiply"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-full h-1 bg-yellow-300/40 absolute rotate-0" />
           <div className="w-full h-1 bg-yellow-300/40 absolute rotate-45" />
           <div className="w-full h-1 bg-yellow-300/40 absolute rotate-90" />
           <div className="w-full h-1 bg-yellow-300/40 absolute -rotate-45" />
        </div>
      </motion.div>
      <motion.div
        className="absolute -bottom-20 -left-20 w-56 h-56 border-[25px] border-orange-400/30 rounded-full mix-blend-multiply"
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-full h-1 bg-orange-400/30 absolute rotate-0" />
           <div className="w-full h-1 bg-orange-400/30 absolute rotate-45" />
           <div className="w-full h-1 bg-orange-400/30 absolute rotate-90" />
           <div className="w-full h-1 bg-orange-400/30 absolute -rotate-45" />
        </div>
      </motion.div>

      <h1 className="text-4xl md:text-5xl font-light tracking-widest mb-4 font-sans relative z-10 text-slate-800">
        Temporistics
      </h1>
      <p className="text-sm font-medium tracking-wide mb-8 opacity-60 uppercase relative z-10 text-slate-800">
        <i className="fa-regular fa-clock mr-2"></i>時間旅行の診断
      </p>
      
      <div className="text-left text-sm opacity-80 mb-6 tracking-wide font-light max-w-md bg-white/50 p-5 rounded-2xl border border-white/60 backdrop-blur-md relative z-10 text-slate-800 shadow-sm">
        <p className="mb-2">
          テンポリスティックスは、<strong>過去(P)・現在(N)・未来(B)・永遠(V)</strong>という4つの「時間」に対するあなたの態度を診断する類型論です。
        </p>
        <p className="text-xs mb-3">
          どれを一番の目的にし、どれを手段として使い、どれに不安を覚え、どれを他者に委ねるか。様々な情景から紐解きます。
        </p>
        <button 
          onClick={() => setShowExplanation(true)}
          className="mt-2 text-xs bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-full transition-colors flex items-center shadow-md mx-auto md:mx-0"
        >
          <i className="fa-solid fa-circle-info mr-2"></i> テンポリスティックについて
        </button>
      </div>

      <div className="text-left text-xs opacity-80 mb-6 tracking-wide font-light bg-white/40 p-4 rounded-xl border border-white/50 backdrop-blur-md relative z-10 text-slate-800 shadow-sm">
        <p className="mb-2 font-medium flex items-center gap-1 text-red-600">
          <i className="fa-solid fa-triangle-exclamation"></i> ※ 警告
        </p>
        <p className="leading-relaxed">
          本診断には、一部癖の強いキャラクター（ダーリンちゃん、LSI芋虫）からの予測不能な干渉が含まれます。煽り耐性のない方や、心が繊細な方は、今すぐ引き返してください。
        </p>
      </div>

      <div className="relative z-10 w-full mb-8">
        <input 
          type="text" 
          value={selfType}
          onChange={(e) => setSelfType(e.target.value)}
          placeholder="自認タイプ (任意)"
          className="w-full max-w-xs px-4 py-3 rounded-xl border border-slate-300 bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm text-center shadow-sm placeholder-slate-400"
        />
      </div>

      <div className="relative z-10 w-full h-32 flex flex-col items-center justify-center">
        {!isJuicing ? (
          <p className="text-slate-500 mb-4 tracking-widest text-sm animate-pulse">
            レモンをドラッグして時間を動かしてください
          </p>
        ) : (
          <p className="text-slate-800 mb-4 tracking-widest text-sm font-medium">
            時間が動き出しました...
          </p>
        )}

        <motion.div
          drag
          dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
          dragElastic={0.1}
          onDrag={handleDrag}
          animate={{
            scaleX: 1 + squeeze * 0.5,
            scaleY: 1 - squeeze * 0.4,
            rotate: squeeze * 10
          }}
          className={`text-6xl cursor-grab active:cursor-grabbing touch-none select-none relative z-20 ${isJuicing ? 'pointer-events-none' : ''}`}
        >
          🍋
          <AnimatePresence>
            {squeeze > 0.5 && !isJuicing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 40 }}
                exit={{ opacity: 0 }}
                className="absolute left-1/2 bottom-0 w-1.5 bg-yellow-400 rounded-full blur-[1px] origin-top"
                style={{ translateX: '-50%', translateY: '100%' }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {isJuicing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, backgroundColor: ['rgba(253,224,71,0)', 'rgba(253,224,71,1)', 'rgba(255,255,255,1)', 'rgba(15,23,42,1)'] }}
            transition={{ duration: 1.8, times: [0, 0.4, 0.7, 1] }}
            className="fixed inset-0 z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* テンポリスティック解説モーダル */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowExplanation(false)}
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              className="bg-[#fdf9f3] text-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto text-left relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowExplanation(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              
              <h2 className="text-2xl font-bold mb-6 text-slate-900 border-b pb-4">⏳ テンポリスティックとは？</h2>
              
              <div className="space-y-6 text-sm leading-relaxed text-slate-700 font-medium">
                <div>
                  テンポリスティックス（Temporistics）は、「人は時間をどのように捉えているのか」という視点から性格を分析する類型論です。
                </div>
                <div>
                  人によって、
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>過去を大切にする人</li>
                    <li>今この瞬間を重視する人</li>
                    <li>未来を見据えて行動する人</li>
                    <li>人生の意味や普遍的な価値を考える人</li>
                  </ul>
                  など、時間への意識の向け方には違いがあります。
                </div>
                <div>
                  テンポリスティックスでは、その違いを
                  <strong>過去（P）・現在（N）・未来（B）・永遠（V）</strong>
                  の4つの時間軸で表現します。<br/>
                  さらに、それぞれが
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>最も自然に使える時間</li>
                    <li>得意な時間</li>
                    <li>苦手だけど重要な時間</li>
                    <li>あまり意識しない時間</li>
                  </ol>
                  という順番に並ぶことで、全部で24タイプに分類されます。
                </div>

                <hr className="my-6 border-slate-200" />

                <h3 className="text-lg font-bold text-slate-900 mb-4">🕰 4つの時間</h3>
                
                <div>
                  <h4 className="font-bold text-blue-900 bg-blue-100 py-1 px-3 rounded inline-block mb-2">📜 P：過去（Past）</h4>
                  <p className="font-bold mb-1">「私は誰なのか？」</p>
                  <p className="mb-2">過去は、自分の経験や記憶、積み重ねてきた歴史を表します。</p>
                  <ul className="list-disc pl-5 opacity-80 text-xs space-y-1">
                    <li>自分らしさ</li>
                    <li>思い出</li>
                    <li>原因や経緯</li>
                    <li>アイデンティティ</li>
                    <li>「なぜこうなったのか」</li>
                  </ul>
                  <p className="mt-1 text-xs opacity-80">などに意識が向きやすい領域です。</p>
                </div>

                <div>
                  <h4 className="font-bold text-green-900 bg-green-100 py-1 px-3 rounded inline-block mb-2 mt-4">🏡 N：現在（Now）</h4>
                  <p className="font-bold mb-1">「私の居場所はどこだろう？」</p>
                  <p className="mb-2">現在は、「今ここ」にある現実との関わりを表します。</p>
                  <ul className="list-disc pl-5 opacity-80 text-xs space-y-1">
                    <li>今の環境</li>
                    <li>人との距離感</li>
                    <li>安心できる場所</li>
                    <li>日常生活</li>
                    <li>現実とのつながり</li>
                  </ul>
                  <p className="mt-1 text-xs opacity-80">などがテーマになります。</p>
                </div>

                <div>
                  <h4 className="font-bold text-orange-900 bg-orange-100 py-1 px-3 rounded inline-block mb-2 mt-4">🚢 B：未来（Future）</h4>
                  <p className="font-bold mb-1">「私はどこへ向かうのか？」</p>
                  <p className="mb-2">未来は、目標や計画、可能性を表します。</p>
                  <ul className="list-disc pl-5 opacity-80 text-xs space-y-1">
                    <li>将来のビジョン</li>
                    <li>成長</li>
                    <li>計画</li>
                    <li>戦略</li>
                    <li>目標達成</li>
                  </ul>
                  <p className="mt-1 text-xs opacity-80">などを考える時間です。</p>
                </div>

                <div>
                  <h4 className="font-bold text-purple-900 bg-purple-100 py-1 px-3 rounded inline-block mb-2 mt-4">🌌 V：永遠（Eternity）</h4>
                  <p className="font-bold mb-1">「私はなぜ存在するのか？」</p>
                  <p className="mb-2">永遠は、人生全体の意味や価値観を表します。</p>
                  <ul className="list-disc pl-5 opacity-80 text-xs space-y-1">
                    <li>人生の意味</li>
                    <li>哲学</li>
                    <li>世界観</li>
                    <li>信念</li>
                    <li>存在意義</li>
                  </ul>
                  <p className="mt-1 text-xs opacity-80">など、時間を超えた抽象的なテーマが含まれます。</p>
                </div>

                <hr className="my-6 border-slate-200" />

                <h3 className="text-lg font-bold text-slate-900 mb-4">⭐ 4つの順位</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold">🥇 第1側面</h4>
                    <p className="text-xs opacity-80">人生の中心となる時間。もっとも自然に意識しやすく、人生の目標や自己実現に大きく影響します。「つい考えてしまうこと」がここです。</p>
                  </div>
                  <div>
                    <h4 className="font-bold">🥈 第2側面</h4>
                    <p className="text-xs opacity-80">才能や楽しさを発揮しやすい時間。得意で扱いやすく、第1側面を支える役割を持っています。自然と力を発揮できる領域です。</p>
                  </div>
                  <div>
                    <h4 className="font-bold">🥉 第3側面</h4>
                    <p className="text-xs opacity-80">敏感で傷つきやすい時間。苦手だからこそ気になりやすく、自尊心にも関わる大切な領域です。避けたくなる一方で、成長の鍵とも考えられています。</p>
                  </div>
                  <div>
                    <h4 className="font-bold">🪶 第4側面</h4>
                    <p className="text-xs opacity-80">あまり重要だと感じにくい時間。「誰かがやればいい」と思いやすく、自分から積極的にエネルギーを使うことは少ない領域です。</p>
                  </div>
                </div>

                <hr className="my-6 border-slate-200" />

                <h3 className="text-lg font-bold text-slate-900 mb-4">🌱 大切なのは「バランス」</h3>
                <p>
                  テンポリスティックスでは、「どの時間が優れている」という考え方はありません。
                  人が健全に成長するためには、過去・現在・未来・永遠、この4つすべてと関わることが大切だとされています。<br/>
                  特に、第3側面は苦手だからこそ避けがちですが、そこに向き合うことが成長につながると考えられています。
                </p>

                <hr className="my-6 border-slate-200" />

                <div className="bg-slate-100 p-4 rounded-xl">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">💡 豆知識</h3>
                  <p className="text-xs opacity-80">
                    テンポリスティックスは、サイコソフィアの考え方や、哲学者ニコライ・ベルジャーエフの思想を参考にして作られた類型論です。制作者はアレクサンドラ・ラティシェワで、全部で24タイプが存在します。
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

