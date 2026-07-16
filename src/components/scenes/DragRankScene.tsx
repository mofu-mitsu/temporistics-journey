import React, { useState } from 'react';
import { motion, Reorder } from 'motion/react';
import { SceneProps } from '../../types';

const INITIAL_ITEMS = [
  { id: 'P', text: '過去の出来事', icon: '📜' },
  { id: 'N', text: '今起きていること', icon: '🏡' },
  { id: 'B', text: '将来の予定', icon: '🚢' },
  { id: 'V', text: '人生の意味', icon: '🌌' }
];

export default function DragRankScene({ onNext }: SceneProps) {
  const [items, setItems] = useState(INITIAL_ITEMS);

  const handleSubmit = () => {
    // 1位に100点、2位に60点、3位に30点、4位に10点などを与える
    // 順位付けでかなり明確になるので高得点にする
    const scores = {
      [items[0].id]: 60,
      [items[1].id]: 40,
      [items[2].id]: 20,
      [items[3].id]: 0,
    };
    
    let actionDesc = 'ドラッグでの順位付け\n';
    items.forEach((item, i) => {
      actionDesc += `${i + 1}位: ${item.text}\n`;
    });

    onNext(scores, { actionDesc, scores });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-lg mx-auto py-8"
    >
      <h2 className="text-xl font-bold mb-2 tracking-widest text-center">あなたにとって大切な順に</h2>
      <h2 className="text-xl font-bold mb-8 tracking-widest text-center">並べ替えてください</h2>
      <p className="text-sm opacity-60 mb-8 text-center">ドラッグ＆ドロップで上下に移動できます。</p>

      <div className="w-full mb-12 relative">
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between py-4 text-xs font-mono opacity-40 font-bold text-center border-r border-slate-700/50">
          <div>1位</div>
          <div>2位</div>
          <div>3位</div>
          <div>4位</div>
        </div>
        
        <Reorder.Group axis="y" values={items} onReorder={setItems} className="pl-12 space-y-3">
          {items.map((item) => (
            <Reorder.Item key={item.id} value={item}>
              <div className="flex items-center p-4 bg-slate-800/80 border border-slate-600 rounded-xl cursor-grab active:cursor-grabbing shadow-lg hover:border-blue-400 transition-colors">
                <div className="mr-4 text-2xl">{item.icon}</div>
                <div className="font-medium tracking-wide">{item.text}</div>
                <div className="ml-auto opacity-30">
                  <i className="fa-solid fa-grip-lines"></i>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
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
