import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneProps } from '../../types';

export default function LadybugFingerScene({ onNext, isActive }: SceneProps) {
  const [phase, setPhase] = useState(0);
  const [action, setAction] = useState('');

  const handleAction = (act: string) => {
    setAction(act);
    setPhase(2);
  };

  const handleReason = (type: string, reason: string) => {
    const scores = type ? { [type]: 30 } : {};
    onNext(scores, { actionDesc: `テントウムシを「${action}」。理由は「${reason}」(${type || '判定なし'})`, scores });
  };

  const handleClick = () => {
    if (phase === 0) {
      setPhase(1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-lg mx-auto"
    >
      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div
            key="p0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center cursor-pointer"
            onClick={handleClick}
          >
            <motion.div 
              animate={{ x: [-20, 20, -20] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="text-6xl mb-12"
            >
              🐞
            </motion.div>
            <p className="text-sm opacity-60 tracking-widest animate-pulse">指で触る</p>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div
            key="p1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex flex-col items-center"
          >
            <div className="text-8xl mb-8 relative inline-block">
              👆
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-4xl"
              >
                🐞
              </motion.div>
            </div>
            <p className="text-lg font-light tracking-widest mb-12 text-center">
              あなたの指に、キイロテントウが止まりました。<br />
              どうしますか？
            </p>
            <div className="grid grid-cols-1 gap-4 w-full max-w-xs relative z-10 px-4">
              <button onClick={() => handleAction('離す')} className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors shadow-sm">
                離す
              </button>
              <button onClick={() => handleAction('そのままにする')} className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors shadow-sm">
                そのままにする
              </button>
              <button onClick={() => handleAction('吹く')} className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors shadow-sm">
                吹く
              </button>
            </div>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div
            key="phase2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center"
          >
            <p className="text-lg font-light tracking-widest mb-12 text-center">
              なぜ、そうしましたか？
            </p>

            <div className="grid grid-cols-1 gap-3 w-full max-w-sm relative z-10 px-4">
              <button
                onClick={() => handleReason('V', '自然へ返してあげるべきだと思うから')}
                className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors text-sm text-left shadow-sm"
              >
                自然へ返してあげるべきだと思うから
              </button>
              <button
                onClick={() => handleReason('N', '今、飛び立ちたいだろうから')}
                className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors text-sm text-left shadow-sm"
              >
                今、飛び立ちたいだろうから
              </button>
              <button
                onClick={() => handleReason('P', '元いた場所へ戻してあげたいから')}
                className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors text-sm text-left shadow-sm"
              >
                元いた場所へ戻してあげたいから
              </button>
              <button
                onClick={() => handleReason('B', 'このあとどこへ向かうのか見届けたいから')}
                className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors text-sm text-left shadow-sm"
              >
                このあとどこへ向かうのか見届けたいから
              </button>
              <button
                onClick={() => handleReason('', '虫が苦手だから')}
                className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors text-sm text-left shadow-sm opacity-80"
              >
                虫が苦手だから
              </button>
              <button
                onClick={() => handleReason('', '可愛いから')}
                className="p-4 border border-current rounded-xl hover:bg-black/5 transition-colors text-sm text-left shadow-sm opacity-80"
              >
                可愛いから
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
