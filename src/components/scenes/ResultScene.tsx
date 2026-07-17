import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as htmlToImage from 'html-to-image';
import { toast } from 'sonner';
import { ResultData, ActionLog } from '../../types';
import { calculateResult } from '../../utils/temporistics';

interface Props { key?: string;
  data: ResultData;
  onNext?: () => void;
  final?: boolean;
  onReset?: () => void;
  logs?: ActionLog[];
}

export default function ResultScene({ data, onNext, final, onReset, logs = [] }: Props) {
  const [showResult, setShowResult] = useState(final || false);
  const [showLogModal, setShowLogModal] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const hasSentGas = useRef(false);

  useEffect(() => {
    if (!final && onNext) {
      // 演出: 4秒後に次(final)へ
      const timer = setTimeout(() => {
        onNext();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [final, onNext]);

  const results = calculateResult(data);
  const typeString = results.map(r => `${r.position}${r.type}`).join('');

  useEffect(() => {
    if (final && !hasSentGas.current) {
      hasSentGas.current = true;
      const GAS_URL = 'https://script.google.com/macros/s/AKfycbwmaS7R0JwHBqVEXd8kCsi0lA6j2wkSH5lpmuIhAbOR5bMxNVj25U5DMb-30MQ5MA7WFw/exec'; // TODO: Replace with actual URL
      
      if (GAS_URL !== 'YOUR_GAS_WEB_APP_URL_HERE') {
        const payload = {
          selfType: data.selfIdentifiedType || '',
          resultType: typeString,
          scores: {
            P: data.P,
            N: data.N,
            B: data.B,
            V: data.V
          },
          log: logs.map(l => `[${l.sceneId}] ${l.actionDesc}`).join('\n')
        };

        fetch(GAS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        }).catch(err => console.error('GAS send error', err));
      }
    }
  }, [final, data, logs, typeString]);

const handleSaveImage = async () => {
  if (!resultRef.current) return;

  try {
    const dataUrl = await htmlToImage.toPng(resultRef.current, {
      backgroundColor: "#111111",
      pixelRatio: 2,
      cacheBust: true,
    });

    // DataURL → Blob
    const blob = await (await fetch(dataUrl)).blob();

    // iPhone・Androidなら共有シートを優先
    const file = new File(
      [blob],
      "temporistics-result.png",
      { type: "image/png" }
    );

    if (
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        files: [file],
        title: "Temporistics",
      });
      return;
    }

    // PCなど通常ブラウザ
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "temporistics-result.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

  } catch (err) {
    console.error("Failed to save image", err);
    toast.error("画像の保存に失敗しました。");
  }
};
  

  const handleShare = async () => {
    const text = `私の時間旅行の記憶\n${results.map(r => `${r.position}${r.type}: ${r.role}`).join('\n')}\n#Temporistics`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Temporistics - 時間旅行の診断',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      toast.info('テキストをコピーしました！\n\n' + text);
    }
  };

  if (!final) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-[400px]"
      >
        <motion.div
          animate={{ rotate: 360 * 5 }}
          transition={{ duration: 4, ease: 'circOut' }}
          className="text-9xl mb-8"
        >
          🕰️
        </motion.div>
        <p className="text-white/50 tracking-widest font-light text-sm animate-pulse">
          時間を紡いでいます...
        </p>
      </motion.div>
    );
  }

  // 結果のキー文字列 (例: "1P2N3B4V")

  const getLogText = () => {
    let text = `【Temporistics 診断結果】\n`;
    text += `Type: ${typeString}\n\n`;
    results.forEach(res => {
      text += `[${res.position}${res.type}] ${res.role}\n`;
    });
    if (data.hasSeTalent) {
      text += `\n※ 特記事項: Seの才能あり (物理的な支配力への抗い)`;
    }
    if (data.hasFeVulnerable) {
      text += `\n※ 特記事項: Fe脆弱性の兆候 (感情統制の喪失)`;
    }

    if (logs && logs.length > 0) {
      text += `\n\n【詳細な行動履歴】\n`;
      text += `-----------------------------------\n`;
      logs.forEach((log, index) => {
        text += `[Scene: ${log.sceneId}]\n`;
        text += `行動: ${log.actionDesc}\n`;
        if (log.darlingReply) {
          text += `応答: ${log.darlingReply}\n`;
        }
        text += `-----------------------------------\n`;
      });
    }

    return text;
  };

  const handleCopyLog = () => {
    navigator.clipboard.writeText(getLogText()).then(() => {
      toast.success("行動ログ（結果）をクリップボードにコピーしました！");
    }).catch(err => {
      console.error("Failed to copy", err);
      toast.error("コピーに失敗しました。");
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2, delay: 0.5 }}
      className="flex flex-col items-center justify-center py-12 w-full max-w-lg mx-auto"
    >
      {/* 保存対象エリア */}
      <div 
        ref={resultRef}
        className="p-8 rounded-3xl glass-card text-white/90 w-full bg-[#111111]"
      >
        <h2 className="text-xl font-light tracking-widest mb-4 border-b border-white/20 pb-4 text-center">
          あなたの時間旅行の記憶
        </h2>
        
        <div className="text-center mb-8">
          <p className="text-3xl font-sans tracking-[0.2em] font-medium mb-2">{typeString}</p>
          <p className="text-xs opacity-60 font-light mb-8">Temporistics Type</p>
          
          <div className="w-full max-w-xs mx-auto mb-8 space-y-3 text-left">
            {[
              { type: 'V', label: '永遠(V)', color: 'bg-purple-500', value: data.V },
              { type: 'B', label: '未来(B)', color: 'bg-blue-500', value: data.B },
              { type: 'P', label: '過去(P)', color: 'bg-amber-700', value: data.P },
              { type: 'N', label: '現在(N)', color: 'bg-green-500', value: data.N },
            ].map(item => {
              const maxVal = Math.max(1, data.V, data.B, data.P, data.N);
              const width = Math.max(0, Math.min(100, (item.value / maxVal) * 100));
              return (
                <div key={item.type} className="flex items-center text-xs">
                  <span className="w-16 font-mono opacity-80">{item.label}</span>
                  <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden mx-2 relative">
                    <div 
                      className={`absolute top-0 left-0 h-full ${item.color} rounded-full`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono opacity-80">{Math.round(item.value)}</span>
                </div>
              );
            })}
          </div>

          {(() => {
            const sorted = [
              { type: 'V', value: data.V },
              { type: 'B', value: data.B },
              { type: 'P', value: data.P },
              { type: 'N', value: data.N * 0.9 },
            ].sort((a, b) => b.value - a.value);
            const topDiff = sorted[0].value - sorted[1].value;
            const secondDiff = sorted[1].value - sorted[2].value;
            const messages = [];
            if (topDiff < 20) {
              messages.push(`第1側面と第2側面（${sorted[0].type}と${sorted[1].type}）が非常に拮抗しています。どちらが本来の第1側面か、自己分析の参考にしてください。`);
            }
            if (secondDiff < 20) {
              messages.push(`第2側面と第3側面（${sorted[1].type}と${sorted[2].type}）のスコアが近いです。`);
            }
            if (messages.length === 0) return null;
            return (
              <div className="w-full max-w-xs mx-auto mb-8 p-4 rounded-xl border border-blue-500/30 bg-blue-900/20 text-blue-200 text-xs leading-relaxed text-left">
                <p className="font-bold mb-1"><i className="fa-solid fa-circle-info mr-1"></i> スコア分析</p>
                {messages.map((m, i) => <p key={i} className="mb-1 opacity-90">・{m}</p>)}
              </div>
            );
          })()}

          <div className="relative w-40 h-40 mx-auto mt-4 mb-6">
            <svg className="absolute inset-0 w-full h-full text-white/10 pointer-events-none" viewBox="0 0 100 100">
              <polygon points="50,15 85,50 50,85 15,50" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
            
            {/* Top: V */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 flex flex-col items-center justify-center">
              <span className="text-2xl drop-shadow-md">🌌</span>
              <span className="text-[10px] bg-white/20 px-1.5 rounded-full mt-1 border border-white/10">{results.find(r => r.type === 'V')?.position}V</span>
            </div>
            {/* Right: B */}
            <div className="absolute top-1/2 right-0 translate-x-2 -translate-y-1/2 flex flex-col items-center justify-center">
              <span className="text-2xl drop-shadow-md">🚢</span>
              <span className="text-[10px] bg-white/20 px-1.5 rounded-full mt-1 border border-white/10">{results.find(r => r.type === 'B')?.position}B</span>
            </div>
            {/* Bottom: N */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 flex flex-col items-center justify-center">
              <span className="text-[10px] bg-white/20 px-1.5 rounded-full mb-1 border border-white/10">{results.find(r => r.type === 'N')?.position}N</span>
              <span className="text-2xl drop-shadow-md">🏡</span>
            </div>
            {/* Left: P */}
            <div className="absolute top-1/2 left-0 -translate-x-2 -translate-y-1/2 flex flex-col items-center justify-center">
              <span className="text-2xl drop-shadow-md">📜</span>
              <span className="text-[10px] bg-white/20 px-1.5 rounded-full mt-1 border border-white/10">{results.find(r => r.type === 'P')?.position}P</span>
            </div>
          </div>
        </div>

        <div className="w-full space-y-4 mb-8">
          {results.map((res) => (
            <div key={res.key} className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex flex-col items-center justify-center border border-white/20">
                <span className="text-sm opacity-80 font-mono">{res.position}{res.type}</span>
              </div>
              <div>
                <h3 className="text-md font-medium tracking-wide mb-1">{res.role}</h3>
                <p className="text-xs font-light opacity-80 leading-relaxed">{res.text}</p>
              </div>
            </div>
          ))}
          
          {(data.hasSeTalent || data.hasFeVulnerable) && (
            <div className="mt-6 p-4 rounded-xl border border-pink-500/30 bg-pink-900/20 text-pink-200 text-xs leading-relaxed">
              <h3 className="font-medium mb-2 text-pink-300">
                <i className="fa-solid fa-microscope mr-1"></i> 観測ログ
              </h3>
              {data.hasSeTalent && (
                <p className="mb-1">・<span className="font-medium text-pink-100">Seの才能あり</span>：対象は外部からの物理的な支配力に対して強い抗いを示しました。自分のテリトリーを守り抜く意志が観測されました。</p>
              )}
              {data.hasFeVulnerable && (
                <p>・<span className="font-medium text-pink-100">Fe脆弱性の兆候</span>：対象は予期せぬストレスに対し、感情統制を失い原始的な言葉（Fe極限）に頼る防衛反応を示しました。脆く愛おしい内面が観測されました。</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        <button
          onClick={() => setShowLogModal(true)}
          className="px-5 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors text-sm flex items-center"
        >
          <i className="fa-solid fa-microscope mr-2"></i> 行動ログを見る
        </button>
        <button
          onClick={handleSaveImage}
          className="px-5 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors text-sm flex items-center"
        >
          <i className="fa-solid fa-download mr-2"></i> 画像を保存
        </button>
        <button
          onClick={handleShare}
          className="px-5 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors text-sm flex items-center"
        >
          <i className="fa-solid fa-share-nodes mr-2"></i> 共有する
        </button>
      </div>
      
      {onReset && (
        <button
          onClick={onReset}
          className="mt-8 text-sm opacity-50 hover:opacity-100 transition-opacity flex items-center"
        >
          <i className="fa-solid fa-rotate-left mr-2"></i> タイトルに戻る
        </button>
      )}

      {/* ログモーダル */}
      <AnimatePresence>
        {showLogModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowLogModal(false)}
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              className="bg-[#1a1a1a] border border-white/20 text-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto text-left relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowLogModal(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white w-8 h-8 flex items-center justify-center rounded-full bg-white/5"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              
              <h2 className="text-xl font-bold mb-6 border-b border-white/20 pb-4">🔬 行動ログ（観測データ）</h2>
              
              <div className="space-y-4 text-sm leading-relaxed text-white/80 font-mono whitespace-pre-wrap">
                {getLogText()}
              </div>

              <div className="mt-8 pt-4 border-t border-white/20 flex justify-end">
                <button
                  onClick={handleCopyLog}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors text-sm flex items-center"
                >
                  <i className="fa-regular fa-copy mr-2"></i> コピーする
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
