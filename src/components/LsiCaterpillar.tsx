import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const quotes = [
  'ふむ、その入力間隔……君の焦りが数式に現れているよ。',
  'なぜ画面を叩く？ 構造的に意味のない行動だ。',
  '僕を観察しているつもりかい？ 僕も君をサンプリングしているのさ。',
  '時間の概念を視覚化するなんて、人間の認知バイアスは興味深いね。',
  '僕は一定の速度で移動している。君の主観的な時間は関係ない。',
  'あらゆる事象は分類可能だ。君のそのタップも例外ではないよ。'
];

export default function LsiCaterpillar() {
  const [clicks, setClicks] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  const [quote, setQuote] = useState('');
  const [isSquashed, setIsSquashed] = useState(false);

  useEffect(() => {
    if (showQuote) {
      const timer = setTimeout(() => setShowQuote(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showQuote]);

  const handleClick = () => {
    if (isSquashed) return;

    const newClicks = clicks + 1;
    setClicks(newClicks);

    if (newClicks >= 30) {
      setIsSquashed(true);
      setQuote('データが……オーバーフロー……ッ！ 非合理的な……！');
      setShowQuote(true);
    } else if (newClicks >= 15 && newClicks < 30) {
      setQuote('やめろ！お前はSLEか？ 暴力で構造は変えられないぞ！');
      setShowQuote(true);
    } else {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
      setShowQuote(true);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full h-48 pointer-events-none z-[100] overflow-hidden">
      <motion.div
        className="absolute bottom-4 whitespace-nowrap pointer-events-auto flex items-end"
        initial={{ x: '100vw' }}
        animate={isSquashed ? { x: '50vw' } : { x: '-20vw' }}
        transition={
          isSquashed
            ? { duration: 0.5, type: 'spring' }
            : { duration: 20, repeat: Infinity, ease: 'linear' }
        }
      >
        <div className="relative flex items-center">
          <AnimatePresence>
            {showQuote && (
              <motion.div
                initial={{ opacity: 0, x: -10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.9 }}
                className="absolute right-full mr-4 bg-slate-800 text-slate-100 text-sm px-4 py-2 rounded-2xl rounded-br-none shadow-lg whitespace-nowrap border border-slate-700 font-mono"
              >
                {quote}
                <div className="absolute -bottom-0 -right-2 w-4 h-4 bg-slate-800" style={{ clipPath: 'polygon(0 0, 0% 100%, 100% 100%)' }} />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            onClick={handleClick}
            className="cursor-pointer text-4xl select-none"
            animate={isSquashed ? { scaleY: 0.2, scaleX: 1.5, y: 15 } : { scaleY: [1, 0.85, 1], rotate: [0, -5, 5, 0] }}
            transition={isSquashed ? { duration: 0.1 } : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            🐛
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
