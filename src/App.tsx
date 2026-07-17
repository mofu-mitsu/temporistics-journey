import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import TitleScene from './components/scenes/TitleScene';
import ButterflyObserver from './components/ButterflyObserver';
import SunScene from './components/scenes/SunScene';
import CityScrollScene from './components/scenes/CityScrollScene';
import SandglassScene from './components/scenes/SandglassScene';
import TimeStopScene from './components/scenes/TimeStopScene';
import HoldTestScene from './components/scenes/HoldTestScene';
import TrumpCardScene from './components/scenes/TrumpCardScene';
import DoubleTapScene from './components/scenes/DoubleTapScene';
import ReverseScrollScene from './components/scenes/ReverseScrollScene';
import BugMashScene from './components/scenes/BugMashScene';
import ResultScene from './components/scenes/ResultScene';
import LsiCaterpillar from './components/LsiCaterpillar';
import { ResultData, ActionLog } from './types';
import './index.css';

const bgColors = [
  '#fdf9f3', // 0: タイトル
  '#fef08a', // 1: レモンイエロー
  '#fde047', // 2
  '#facc15', // 3
  '#eab308', // 4
  '#fbbf24', // 5
  '#f59e0b', // 6
  '#ea580c', // 7: ディープオレンジ
  '#c2410c', // 8
  '#9a3412', // 9
  '#1e1b4b', // 10: 紺青
  '#312e81', // 11
  '#1e1b4b', // 12
  '#0f172a', // 13
  '#020617', // 14
  '#000000', // 15
  '#111111', // 16: 結果ローディング
  '#111111', // 17: 結果
];

import TextQuestionScene from './components/scenes/TextQuestionScene';
import DarlingQuestionScene from './components/scenes/DarlingQuestionScene';
import GravityScrollScene from './components/scenes/GravityScrollScene';
import FreezeWriteScene from './components/scenes/FreezeWriteScene';
import ElevatorScene from './components/scenes/ElevatorScene';
import TimeWeightScene from './components/scenes/TimeWeightScene';
import CitrusTreeScene from './components/scenes/CitrusTreeScene';
import LadybugFingerScene from './components/scenes/LadybugFingerScene';
import CheckboxQuizScene from './components/scenes/CheckboxQuizScene';
import DragRankScene from './components/scenes/DragRankScene';
import ThirdFunctionScene from './components/scenes/ThirdFunctionScene';
import LikertScaleScene from './components/scenes/LikertScaleScene';
import FruitRipenScene from './components/scenes/FruitRipenScene';

// 出題可能な全シーン
const SCENES = [
  {
    id: 'q_reason',
    component: (props: any) => (
      <TextQuestionScene
        {...props}
        question="目の前で起きたトラブルの「原因」が分かりました。"
        description="さて、次にあなたが取る行動は？"
        choices={[
          { text: "詳細な記録を残す", scores: { P: 30 } },
          { text: "二度と起きないよう再発防止策を練る", scores: { B: 30 } },
          { text: "この出来事の意味を考える", scores: { V: 30 } },
          { text: "とりあえず今を立て直す", scores: { N: 30 } },
        ]}
      />
    )
  },
  { id: 'fruit', component: FruitRipenScene },
  { id: 'sun', component: SunScene },
  { id: 'city', component: CityScrollScene },
  { id: 'sand', component: SandglassScene },
  { id: 'time', component: TimeStopScene },
  { id: 'hold', component: HoldTestScene },
  { id: 'trump', component: TrumpCardScene },
  { id: 'tap', component: DoubleTapScene },
  { id: 'scroll', component: ReverseScrollScene },
  { id: 'bug', component: BugMashScene },
  { id: 'gravity', component: GravityScrollScene },
  { id: 'freeze', component: FreezeWriteScene },
  { id: 'elevator', component: ElevatorScene },
  { id: 'timeweight', component: TimeWeightScene },
  { id: 'citrus', component: CitrusTreeScene },
  { id: 'ladybug', component: LadybugFingerScene },
  { id: 'checkbox', component: CheckboxQuizScene },
  { id: 'dragrank', component: DragRankScene },
  { id: 'third', component: ThirdFunctionScene },
  { id: 'likert', component: LikertScaleScene },
  {
    id: 'dq1',
    component: (props: any) => (
      <DarlingQuestionScene
        {...props}
        question="目の前で、あなたが何年もかけて書き上げた『完璧な論理の設計図』を、私が笑いながら破り捨てているわ。……ねぇ、どうする？"
        choices={[
          { text: "冷めた目で私を見つめ、またゼロから全く同じものを書き直す。", scores: { V: 10 } },
          { text: "『どうせいつかは壊れるものだった』と、破片のシトラスの香りを嗅いで楽しむ。", scores: { V: 20 } },
          { text: "私の手を掴んで、破るのを物理的に止め、激しく非難する。", scores: { V: 30 } },
          { text: "『やっぱりね』と、破られる瞬間を静かに鑑賞する。", scores: { V: 5 } },
          { text: "私への逆襲を書く", scores: { V: 40 }, isTextInput: true },
        ]}
      />
    )
  },
  {
    id: 'dq2',
    component: (props: any) => (
      <DarlingQuestionScene
        {...props}
        question="ねぇ、時計の針が逆回転を始めたわ……。あなたは過去へ引き戻されようとしている。その時、あなたの頭の中を占めるのは何かしら？"
        choices={[
          { text: "「未来に帰る方法」を考え始める", scores: { B: 30 } },
          { text: "「今この瞬間の感覚」を失わないよう自分を保つ", scores: { N: 30 } },
          { text: "「やり直したい過去」への期待に胸を膨らませる", scores: { P: 30 } },
          { text: "「時間の流れという概念そのもの」について考え込む", scores: { V: 30 } },
        ]}
      />
    )
  },
  {
    id: 'dq3',
    component: (props: any) => (
      <DarlingQuestionScene
        {...props}
        question="ふふ、終わりの見えない嵐ね……。船は完全にコントロールを失っているわ。マストが折れる音が響く中で、あなたが一番気になっちゃうのはどれ？"
        choices={[
          { text: "嵐が過ぎ去った後の航路", scores: { B: 30 } },
          { text: "今、体が感じている波の揺れと恐怖", scores: { N: 30 } },
          { text: "なぜこんな海域に来てしまったのかという原因", scores: { P: 30 } },
          { text: "この試練が人生において持つ意味", scores: { V: 30 } },
        ]}
      />
    )
  },
  {
    id: 'dq4',
    component: (props: any) => (
      <DarlingQuestionScene
        {...props}
        question="『ここにいていいよ』と、誰かがあなたを温かく抱きしめてくれたわ。けれどその腕からは、うっすらと腐敗したレモンの匂いがしているの……。その匂いを嗅いだ時、あなたの意識はどこへ向かうかしら？"
        choices={[
          { text: "いつか完全に腐り落ちる未来", scores: { B: 30 } },
          { text: "今、肌に伝わってくる生暖かい体温", scores: { N: 30 } },
          { text: "この人が抱えてきた過去の腐敗の歴史", scores: { P: 30 } },
          { text: "愛と腐敗は表裏一体であるという普遍的真理", scores: { V: 30 } },
        ]}
      />
    )
  },
  {
    id: 'q_lib',
    component: (props: any) => (
      <TextQuestionScene
        {...props}
        question="古い図書館の奥深く。誰も知らない本棚の前に立ちました。"
        description="あなたが最初に手に取るのはどんな本ですか？"
        choices={[
          { text: "歴史の真実が記された古文書", scores: { P: 30 } },
          { text: "この図書館の現在の見取り図", scores: { N: 30 } },
          { text: "未来の予言書", scores: { B: 30 } },
          { text: "世界の真理を説いた哲学書", scores: { V: 30 } },
        ]}
      />
    )
  },
  {
    id: 'q_station',
    component: (props: any) => (
      <TextQuestionScene
        {...props}
        question="10年後のあなたから手紙が届きました。"
        description="受け取ったあなたが、最初に一番気になるのは？"
        choices={[
          { text: "そこに書かれている「未来の内容」", scores: { B: 30 } },
          { text: "「今の状況」でこれを読むべきかどうか", scores: { N: 30 } },
          { text: "なぜ「過去の自分」に宛てて書いたのか", scores: { P: 30 } },
          { text: "この手紙が届いた「運命的な意味」", scores: { V: 30 } },
        ]}
      />
    )
  },
  {
    id: 'q_port',
    component: (props: any) => (
      <TextQuestionScene
        {...props}
        question="霧に包まれた港。一隻の船が出航しようとしています。"
        description="あなたはこの船を見て、どう感じますか？"
        choices={[
          { text: "この船はどこへ向かうのだろう", scores: { B: 30 } },
          { text: "今、波に揺れる船の音が心地よい", scores: { N: 30 } },
          { text: "なぜこの船はここに存在するのだろう", scores: { V: 30 } },
          { text: "この船はどこから来たのだろう", scores: { P: 30 } },
        ]}
      />
    )
  }
];

// 指定された数だけランダムにシーンを選ぶ
function getRandomScenes(count: number) {
  const constantIds = ['checkbox', 'dragrank', 'third', 'likert'];
  const constantScenes = constantIds.map(id => SCENES.find(s => s.id === id)!);
  const otherScenes = SCENES.filter(s => !constantIds.includes(s.id));
  const shuffled = [...otherScenes].sort(() => 0.5 - Math.random());
  
  // 常時出題する問題＋ランダムなギミックシーン
  const randomCount = Math.max(0, count - constantScenes.length);
  return [...constantScenes, ...shuffled.slice(0, randomCount)];
}

export default function App() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<ResultData>({ P: 0, N: 0, B: 0, V: 0 });
  const [selectedScenes, setSelectedScenes] = useState<typeof SCENES>([]);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);

  useEffect(() => {
    // 初回起動時に10シーン選ぶ
    setSelectedScenes(getRandomScenes(10));
  }, []);

  const handleNext = (newScores: Partial<ResultData>, log?: Omit<ActionLog, 'sceneId'> | Omit<ActionLog, 'sceneId'>[]) => {
    if (log && step > 0 && step <= 15 && selectedScenes.length > 0) {
      const sceneId = selectedScenes[step - 1].id;
      const logsToAdd = Array.isArray(log) ? log : [log];
      setActionLogs(prev => [
        ...prev,
        ...logsToAdd.map(l => ({ ...l, sceneId }))
      ]);
    }

    setScores((prev) => {
      const updated = { ...prev };
      (Object.keys(newScores) as (keyof ResultData)[]).forEach((key) => {
        if (newScores[key] !== undefined) {
          updated[key] += newScores[key]!;
        }
      });
      return updated;
    });
    setStep((prev) => prev + 1);
  };

  const handleStart = (initialScores?: Partial<ResultData>, log?: Omit<ActionLog, 'sceneId'> | Omit<ActionLog, 'sceneId'>[]) => {
    setStep(1);
    const s = { P: 0, N: 0, B: 0, V: 0 };
    if (initialScores && !('type' in initialScores)) {
      (Object.keys(initialScores) as (keyof ResultData)[]).forEach((key) => {
        if (initialScores[key] !== undefined) {
          s[key] += initialScores[key]!;
        }
      });
    }
    setScores(s);
    setActionLogs([]);
    setSelectedScenes(getRandomScenes(15));
  };

  const handleReset = () => {
    setStep(0);
    setScores({ P: 0, N: 0, B: 0, V: 0 });
    setSelectedScenes([]);
    setActionLogs([]);
  };

  const isNight = step >= 8;

  return (
    <motion.div
      className={`relative w-full min-h-screen overflow-x-hidden transition-colors duration-1000 flex flex-col items-center justify-center ${isNight ? 'text-slate-100' : 'text-slate-800'}`}
      animate={{ backgroundColor: bgColors[Math.min(step, bgColors.length - 1)] }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
    >
      <Toaster position="top-center" />
      <ButterflyObserver step={step} />
      {step === 0 && (
        <a 
          href="https://mofu-mitsu.github.io/lab.html"
          className="absolute top-6 left-6 opacity-60 hover:opacity-100 transition-opacity flex items-center text-sm z-50 text-slate-800"
        >
          <i className="fa-solid fa-house mr-2"></i> ホームへ
        </a>
      )}

      {/* 背景のエフェクト用レイヤー */}
      <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      
      {/* 夜景パーティクル */}
      <AnimatePresence>
        {isNight && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-0 fixed"
          >
            {Array.from({ length: 40 }).map((_, i) => {
              const size = Math.random() * 20 + 10;
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: size,
                    height: size,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    background: `radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)`,
                    opacity: Math.random() * 0.5 + 0.1
                  }}
                  animate={{
                    y: [0, -30, 0],
                    x: [0, Math.random() * 20 - 10, 0],
                    opacity: [0.1, 0.6, 0.1]
                  }}
                  transition={{
                    duration: Math.random() * 5 + 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-2xl px-6 py-12">
        <AnimatePresence mode="wait">
          {step === 0 && <TitleScene key="title" onNext={handleStart} />}
          
          {step >= 1 && step <= 15 && selectedScenes.length > 0 && (
            (() => {
              const SceneComponent = selectedScenes[step - 1].component;
              return (
                <SceneComponent 
                  key={`scene-${step}`} 
                  onNext={handleNext} 
                  isActive={true} 
                />
              );
            })()
          )}

          {step === 16 && (
            <ResultScene key="result" data={scores} onNext={() => setStep(17)} logs={actionLogs} />
          )}
          {step === 17 && (
            <ResultScene key="result-final" data={scores} final onReset={handleReset} logs={actionLogs} />
          )}
        </AnimatePresence>
      </div>

      {step > 0 && step < 16 && <LsiCaterpillar />}
    </motion.div>
  );
}
