import { ResultData } from '../types';

const descriptions: Record<string, { role: string; text: string }> = {
  '1P': { role: '歴史小説家', text: '過去を創造し、自らの物語として再構築する。' },
  '2P': { role: 'クロニクル', text: '事実を静かに見つめ、ありのままを記録する。' },
  '3P': { role: '批評家', text: '歴史の矛盾を突き、過去に疑念を抱く。' },
  '4P': { role: '読者', text: '過去は過ぎ去った本の一部。ただそれを受け入れる。' },

  '1N': { role: '主人', text: '今この瞬間を支配し、現実の場を作り上げる。' },
  '2N': { role: '地元住人', text: '現在に馴染み、周囲の環境と調和して生きる。' },
  '3N': { role: '追放者', text: '現実から浮遊し、今ここにいることに違和感を覚える。' },
  '4N': { role: 'ゲスト', text: '現実は一時的な滞在場所。執着せず通り過ぎる。' },

  '1B': { role: '船長', text: '未来という海図なき海へ、自ら舵を取り進む。' },
  '2B': { role: '操舵手', text: '未来とは誰かが描いた航路ではない。あなたは流れを読み、最も穏やかな方向へ船を導く。' },
  '3B': { role: '密航者', text: '未来への不安を抱えながら、隠れるように進む。' },
  '4B': { role: '乗客', text: '運命の船に乗せられ、行き着く先をただ待つ。' },

  '1V': { role: '導師', text: '永遠の真理を掲げ、不変の法則を説く。' },
  '2V': { role: '哲学者', text: '普遍的な問いを考え続け、意味を探求する。' },
  '3V': { role: 'ペリシテ人', text: '形而上学的な問いを避け、永遠に苛立ちを覚える。' },
  '4V': { role: '弟子', text: '永遠の謎に対して、誰かの答えを素直に受け取る。' },
};

export function calculateResult(data: ResultData) {
  // Nが高くなりやすい傾向を補正する（わずかに重みを下げる）
  const scores = [
    { type: 'P', score: data.P },
    { type: 'N', score: data.N * 0.9 },
    { type: 'B', score: data.B },
    { type: 'V', score: data.V },
  ];

  // スコアが高い順に 1, 2, 3, 4 を割り当てる
  scores.sort((a, b) => b.score - a.score);

  const resultList = scores.map((item, index) => {
    const position = index + 1; // 1, 2, 3, 4
    const key = `${position}${item.type}`;
    return {
      type: item.type,
      position,
      key,
      role: descriptions[key].role,
      text: descriptions[key].text,
    };
  });

  return resultList;
}
