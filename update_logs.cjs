const fs = require('fs');
const path = require('path');

const scenesDir = path.join(__dirname, 'src/components/scenes');
const files = fs.readdirSync(scenesDir);

for (const file of files) {
  if (file === 'ResultScene.tsx' || file === 'TitleScene.tsx' || file === 'CheckboxQuizScene.tsx' || file === 'DragRankScene.tsx' || file === 'ThirdFunctionScene.tsx' || file === 'LikertScaleScene.tsx' || file === 'TextQuestionScene.tsx' || file === 'DarlingQuestionScene.tsx' || file === 'FreezeWriteScene.tsx' || file === 'LadybugFingerScene.tsx') continue;
  
  const filePath = path.join(scenesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // replace onNext({ ... }) with onNext({ ... }, { actionDesc: '...', scores: { ... } })
  // This is a bit tricky, let's just do it manually for a few key ones or write a regex.
  
  if (file === 'SunScene.tsx') {
    content = content.replace(/onNext\(\{\s*V:\s*30\s*\}\)/g, "onNext({ V: 30 }, { actionDesc: '太陽をタップした', scores: { V: 30 } })");
  } else if (file === 'SandglassScene.tsx') {
    content = content.replace(/onNext\(\{\s*P:\s*30\s*\}\)/g, "onNext({ P: 30 }, { actionDesc: '砂時計をタップした', scores: { P: 30 } })");
  } else if (file === 'CityScrollScene.tsx') {
    content = content.replace(/onNext\(\{\s*N:\s*30\s*\}\)/g, "onNext({ N: 30 }, { actionDesc: '街をスクロールした', scores: { N: 30 } })");
  } else if (file === 'TimeStopScene.tsx') {
    content = content.replace(/onNext\(\{\s*N:\s*30\s*\}\)/g, "onNext({ N: 30 }, { actionDesc: '時計を止めた', scores: { N: 30 } })");
  } else if (file === 'HoldTestScene.tsx') {
    content = content.replace(/onNext\(\{\s*P:\s*Math.min\(50,\s*Math.floor\(duration \/ 100\)\)\s*\}\)/g, "onNext({ P: Math.min(50, Math.floor(duration / 100)) }, { actionDesc: `長押し（${(duration/1000).toFixed(1)}秒）`, scores: { P: Math.min(50, Math.floor(duration / 100)) } })");
  } else if (file === 'TrumpCardScene.tsx') {
    content = content.replace(/onNext\(\{\s*B:\s*30\s*\}\)/g, "onNext({ B: 30 }, { actionDesc: 'カードを選択した', scores: { B: 30 } })");
  } else if (file === 'DoubleTapScene.tsx') {
    content = content.replace(/onNext\(\{\s*B:\s*30\s*\}\)/g, "onNext({ B: 30 }, { actionDesc: 'ダブルタップした', scores: { B: 30 } })");
  } else if (file === 'ReverseScrollScene.tsx') {
    content = content.replace(/onNext\(\{\s*V:\s*30\s*\}\)/g, "onNext({ V: 30 }, { actionDesc: '逆スクロールした', scores: { V: 30 } })");
  } else if (file === 'BugMashScene.tsx') {
    content = content.replace(/onNext\(\{\s*N:\s*30\s*\}\)/g, "onNext({ N: 30 }, { actionDesc: 'バグを潰した', scores: { N: 30 } })");
  } else if (file === 'GravityScrollScene.tsx') {
    content = content.replace(/onNext\(\{\s*P:\s*30\s*\}\)/g, "onNext({ P: 30 }, { actionDesc: '重力に逆らった', scores: { P: 30 } })");
  } else if (file === 'ElevatorScene.tsx') {
    content = content.replace(/onNext\(\{\s*B:\s*30\s*\}\)/g, "onNext({ B: 30 }, { actionDesc: 'エレベーターを操作した', scores: { B: 30 } })");
  } else if (file === 'TimeWeightScene.tsx') {
    content = content.replace(/onNext\(\{\s*V:\s*30\s*\}\)/g, "onNext({ V: 30 }, { actionDesc: '時間の重りを感じた', scores: { V: 30 } })");
  } else if (file === 'CitrusTreeScene.tsx') {
    content = content.replace(/onNext\(\{\s*N:\s*10\s*\}\)/g, "onNext({ N: 10 }, { actionDesc: 'シトラスを収穫した', scores: { N: 10 } })");
  }

  fs.writeFileSync(filePath, content);
}
console.log('done');
