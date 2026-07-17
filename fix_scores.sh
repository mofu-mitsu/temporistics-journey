#!/bin/bash
sed -i 's/scores.P = Math.max(0, 100 - cost \* 5);/scores.P = Math.max(0, 30 - cost * 1.5);/g' src/components/scenes/FreezeWriteScene.tsx
sed -i 's/{ P: hasDrawn ? 80 : 20 }/{ P: hasDrawn ? 30 : 10 }/g' src/components/scenes/TrumpCardScene.tsx
sed -i 's/onNext({ N: 100 });/onNext({ N: 30 });/g' src/components/scenes/BugMashScene.tsx
sed -i 's/onNext({ N: Math.max(0, 100 - reactionTime \/ 20) });/onNext({ N: Math.max(0, 30 - reactionTime \/ 60) });/g' src/components/scenes/GravityScrollScene.tsx
sed -i 's/const score = Math.max(0, 100 - (delay \/ 50));/const score = Math.max(0, 30 - (delay \/ 150));/g' src/components/scenes/DoubleTapScene.tsx
sed -i 's/const score = 100 - val;/const score = (100 - val) * 0.3;/g' src/components/scenes/CityScrollScene.tsx
sed -i 's/const score = Math.min((time \/ 15000) \* 100, 100);/const score = Math.min((time \/ 15000) \* 30, 30);/g' src/components/scenes/TimeStopScene.tsx
sed -i 's/const score = isTimeout === true ? 0 : 100 - progress;/const score = isTimeout === true ? 0 : (100 - progress) * 0.3;/g' src/components/scenes/SandglassScene.tsx
sed -i 's/onNext({ N: 100 - (elapsed \/ duration) \* 100 });/onNext({ N: (100 - (elapsed \/ duration) \* 100) * 0.3 });/g' src/components/scenes/HoldTestScene.tsx
sed -i 's/onNext({ V: 100 });/onNext({ V: 30 });/g' src/components/scenes/HoldTestScene.tsx
sed -i 's/const score = 100 - Math.abs(val - 50) \* 2;/const score = (100 - Math.abs(val - 50) \* 2) * 0.3;/g' src/components/scenes/SunScene.tsx
