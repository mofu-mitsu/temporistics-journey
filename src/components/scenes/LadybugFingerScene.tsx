import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneProps } from '../../types';

// 各アクション（離す、そのままにする、吹く）ごとに理由をマッピング！
const ACTION_DATA: Record<string, {
  reasons: { type: 'P' | 'N' | 'B' | 'V' | ''; text: string }[]
}> = {
  '離す': {
    reasons: [
      { type: 'V', text: '本来あるべき自然へ返してあげるべきだと思うから' },
      { type: 'P', text: '元いた草むらなどの場所へ戻してあげたいから' },
      { type: 'B', text: 'これ以上邪魔せず、次の目的地へ向かわせてあげたいから' },
      { type: 'N', text: 'ちょうど今、別の場所に移動させたくなったから' },
      { type: '', text: '虫が苦手だから' }
    ]
  },
  'そのままにする': {
    reasons: [
      { type: 'B', text: 'このあとどこへ向かって歩き出すのか見届けたいから' },
      { type: 'N', text: '今この瞬間、指にとまっている感覚を楽しみたいから' },
      { type: 'V', text: '自然の流れに身を任せて、止まりたいだけ止めさせるのが本質だと思うから' },
      { type: 'P', text: 'さっき止まったばかりだから、しばらくこのままにしておこうと思ったから' },
      { type: '', text: '可愛いから' }
    ]
  },
  '吹く': {
    reasons: [
      { type: 'N', text: '今すぐここから飛び立ちたいだろうと思ったから' },
      { type: 'B', text: '風に乗って遠くへ飛んでいく未来の姿を見たいから' },
      { type: 'V', text: '刺激を与えて飛ばせるのが、生き物との正しい距離感だと思うから' },
      { type: 'P', text: '指に登ってくる前の状態（自由な飛行状態）に戻してあげたかったから' },
      { type: '', text: 'なんとなく驚かせてみたかったから' }
    ]
  }
};

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

  // 現在選択されているアクションの理由データを取得（安全のためのフォールバック付き）
  const currentActionData = ACTION_DATA[action] || { reasons: [] };

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
              あなたの指に、テントウムシが止まりました。<br />
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

            {/* アクションに応じた理由をループで動的レンダリング！ */}
            <div className="grid grid-cols-1 gap-3 w-full max-w-sm relative z-10 px-4">
              {currentActionData.reasons.map((reason, idx) => (
                <button
                  key={idx}
                  onClick={() => handleReason(reason.type, reason.text)}
                  className={`p-4 border border-current rounded-xl hover:bg-black/5 transition-colors text-sm text-left shadow-sm ${
                    reason.type === '' ? 'opacity-80' : ''
                  }`}
                >
                  {reason.text}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}