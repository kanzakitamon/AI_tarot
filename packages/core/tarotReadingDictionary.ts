export type ReversedType = '不足' | '過剰' | '滞り' | '内向き';

export interface TarotMeaning {
  core: string;
  concretes: string[];
  caution: string;
  actionHints: string[];
  keywords: string[];
}

export interface TarotCardDefinition {
  id: number;
  nameJa: string;
  upright: TarotMeaning;
  reversed: TarotMeaning & { type: ReversedType };
}

export const TAROT_READING_DICTIONARY: TarotCardDefinition[] = [
  {
    id: 0,
    nameJa: '愚者',
    upright: {
      core: '自由な出発。枠に縛られず新章へ踏み出す。',
      concretes: [
        'やりたい方向はまだ曖昧だが、動きながら形が見えやすい。',
        '未知の環境や試し行動が追い風になりやすい。',
      ],
      caution: '勢いだけで準備不足になると空回りする。',
      actionHints: [
        '小さく試す行動を1つ入れる。',
        '初めての選択肢を調べて体験する。',
      ],
      keywords: ['自由', '新章', '好奇心'],
    },
    reversed: {
      type: '過剰',
      core: '自由が暴走し、現実逃避や無計画になりやすい。',
      concretes: [
        '気分で動き、やるべき順序が抜けやすい。',
        '責任や準備が後回しになり、結果が続かない。',
      ],
      caution: '軽率な選択で戻りコストが増える。',
      actionHints: [
        'やる順番を3つに絞って書く。',
        '期限を決めて小さく試す。',
      ],
      keywords: ['無計画', '逃避', '軽率'],
    },
  },
  {
    id: 1,
    nameJa: '魔術師',
    upright: {
      core: '手札は揃っており、形にする開始の段階。',
      concretes: [
        '準備は十分で、やれば動く状態にある。',
        '小さな実行が一気に流れを作りやすい。',
      ],
      caution: '口だけで満足すると停滞する。',
      actionHints: [
        '今日中に成果物を1つ出す。',
        '応募や提案を1件送る。',
      ],
      keywords: ['手札が揃う', '実行', '開始'],
    },
    reversed: {
      type: '不足',
      core: '実行が伴わず、準備や言葉が先行しやすい。',
      concretes: [
        'やることが散り、肝心の一手が止まる。',
        'できるはずなのに手が動かず自信が落ちる。',
      ],
      caution: '空回りのループに入る。',
      actionHints: [
        '作業を1つに絞って30分だけやる。',
        '締切を短く設定する。',
      ],
      keywords: ['空回り', '口先', '自信低下'],
    },
  },
  {
    id: 2,
    nameJa: '女教皇',
    upright: {
      core: '直感と本質を見抜く静かな判断が働く。',
      concretes: [
        '情報のノイズを減らすと答えが見えやすい。',
        '感情に流されず、内側の声が指針になる。',
      ],
      caution: '冷静さが強すぎて温度が下がる。',
      actionHints: [
        '一人で静かに考える時間を取る。',
        '事実と感情を分けて書く。',
      ],
      keywords: ['直感', '本質', '静観'],
    },
    reversed: {
      type: '滞り',
      core: '直感が遮られ、本音や情報が曖昧になりやすい。',
      concretes: [
        '違和感はあるのに理由が言語化できない。',
        '秘密やごまかしが混ざり、判断が揺れる。',
      ],
      caution: '他人の期待に流されやすい。',
      actionHints: [
        '気になる事実を3つ書き出す。',
        '信頼できる1人に状況を話す。',
      ],
      keywords: ['直感遮断', '情報不足', '本音不明'],
    },
  },
  {
    id: 3,
    nameJa: '女帝',
    upright: {
      core: '受け取る豊かさと育てる力が強い。',
      concretes: [
        '支援や環境に恵まれやすい。',
        '時間をかければ実りが増える。',
      ],
      caution: '心地よさに甘えすぎると停滞する。',
      actionHints: [
        '支援を受け取る。',
        '育てたい対象を1つ決める。',
      ],
      keywords: ['豊かさ', '包容', '育てる'],
    },
    reversed: {
      type: '過剰',
      core: '甘えや浪費が出やすく、伸びが鈍る。',
      concretes: [
        '楽な方に流れ、結果が薄くなる。',
        '過保護で自立が進まない。',
      ],
      caution: '依存や無駄が増える。',
      actionHints: [
        '支出か時間を1つ減らす。',
        '頼りすぎを1つやめる。',
      ],
      keywords: ['甘え', '浪費', '過保護'],
    },
  },
  {
    id: 4,
    nameJa: '皇帝',
    upright: {
      core: '基盤を固め、責任を持って統率する力。',
      concretes: [
        'ルールや方針を立てると前に進む。',
        '土台作りに向く。',
      ],
      caution: '硬くなりすぎると柔軟さが失われる。',
      actionHints: [
        '方針を1つ決める。',
        '期限を区切る。',
      ],
      keywords: ['秩序', '責任', '統率'],
    },
    reversed: {
      type: '過剰',
      core: '支配的・硬直的になり、摩擦が増える。',
      concretes: [
        '思い通りにしようとして反発を招く。',
        '責任範囲が曖昧で負担が偏る。',
      ],
      caution: '強さが孤立につながる。',
      actionHints: [
        '譲れる点を1つ決める。',
        '役割の境界を見直す。',
      ],
      keywords: ['硬直', '支配', '孤立'],
    },
  },
  {
    id: 5,
    nameJa: '教皇',
    upright: {
      core: '正攻法と信頼が効く。学びが道を作る。',
      concretes: [
        '先人の方法やルールが有効。',
        '相談や助言が役に立つ。',
      ],
      caution: '形式に寄りすぎると動きが鈍る。',
      actionHints: [
        '経験者に相談する。',
        '正攻法の手順を確認する。',
      ],
      keywords: ['王道', '信頼', '学び'],
    },
    reversed: {
      type: '内向き',
      core: '形式だけに縛られるか、反発で学びが止まる。',
      concretes: [
        '形だけ守って中身が薄くなる。',
        '反発心で必要な助言を拒みやすい。',
      ],
      caution: '意地で損をする。',
      actionHints: [
        '信頼できる助言を1つ選ぶ。',
        '反発の理由を言語化する。',
      ],
      keywords: ['形式だけ', '依存', '反発'],
    },
  },
  {
    id: 6,
    nameJa: '恋人',
    upright: {
      core: '価値観の一致が鍵になる選択。',
      concretes: [
        'どれを大事にするかで答えが変わる。',
        '関係性や相性の良さが追い風。',
      ],
      caution: '魅力に流されると後悔しやすい。',
      actionHints: [
        '優先順位を3つ書く。',
        '比較ポイントを明確化する。',
      ],
      keywords: ['価値観の選択', '一致', '調和'],
    },
    reversed: {
      type: '滞り',
      core: '他人軸や誘惑で迷いが長引きやすい。',
      concretes: [
        '決めきれず、先延ばしになりやすい。',
        '周囲の期待で選びかける。',
      ],
      caution: 'ブレが大きくなる。',
      actionHints: [
        '自分基準を1行で書く。',
        'NOを1つ決める。',
      ],
      keywords: ['優柔不断', '誘惑', '他人軸'],
    },
  },
  {
    id: 7,
    nameJa: '戦車',
    upright: {
      core: '勝ちに行く前進力。勢いが結果につながる。',
      concretes: [
        '目標に集中すると突破できる。',
        '行動量が成果を押し上げる。',
      ],
      caution: '突っ走りすぎると事故が起きる。',
      actionHints: [
        'やることを1つに絞る。',
        '期限を短く設定する。',
      ],
      keywords: ['前進', '勝ちに行く', '行動力'],
    },
    reversed: {
      type: '過剰',
      core: '勢いが空回りし、方向を見失いやすい。',
      concretes: [
        '動いているのに成果が出にくい。',
        '焦りが判断を乱す。',
      ],
      caution: '疲弊だけが残る。',
      actionHints: [
        '目的を1行で言い直す。',
        '止まって軌道修正する。',
      ],
      keywords: ['暴走', '空回り', '方向喪失'],
    },
  },
  {
    id: 8,
    nameJa: '力',
    upright: {
      core: '優しい胆力で感情を制御し、粘り強く進む。',
      concretes: [
        '不安を抱えつつも折れない。',
        '静かな強さが評価される。',
      ],
      caution: '我慢しすぎると消耗する。',
      actionHints: [
        '小さく続ける。',
        '休息を確保する。',
      ],
      keywords: ['胆力', '自制', '粘り'],
    },
    reversed: {
      type: '過剰',
      core: '意地や我慢が限界に近く、感情が噴き出しやすい。',
      concretes: [
        '怒りや焦りで判断がブレる。',
        '自分に厳しすぎて疲れが溜まる。',
      ],
      caution: '爆発すると関係が壊れる。',
      actionHints: [
        '感情トリガーを1つ書く。',
        '休む時間を先に決める。',
      ],
      keywords: ['意地', '限界', '感情噴出'],
    },
  },
  {
    id: 9,
    nameJa: '隠者',
    upright: {
      core: '内省と探究の時間が必要。',
      concretes: [
        '表面ではなく本質を深掘りする時期。',
        '一人で考えるほど整理が進む。',
      ],
      caution: '孤立しすぎると視野が狭い。',
      actionHints: [
        '静かな時間を確保する。',
        '仮説を1つ立てる。',
      ],
      keywords: ['内省', '探究', '慎重'],
    },
    reversed: {
      type: '内向き',
      core: '孤立してこじらせやすく、視野が閉じる。',
      concretes: [
        '考えすぎて動けなくなる。',
        '他者の意見を遮断しがち。',
      ],
      caution: '独断で判断しやすい。',
      actionHints: [
        '信頼できる人に話す。',
        '小さく外に出る。',
      ],
      keywords: ['孤立', 'こじらせ', '閉鎖'],
    },
  },
  {
    id: 10,
    nameJa: '運命の輪',
    upright: {
      core: '転機が近い。流れに乗ると加速する。',
      concretes: [
        '偶然の出会いがヒントになる。',
        'タイミングが合うと一気に進む。',
      ],
      caution: '流されすぎると軸が弱くなる。',
      actionHints: [
        '来た機会に乗る。',
        '流れが強い方向を選ぶ。',
      ],
      keywords: ['転機', '追い風', 'チャンス'],
    },
    reversed: {
      type: '滞り',
      core: '流れが噛み合わず停滞しやすい。',
      concretes: [
        'タイミングがずれ、空回りが起きやすい。',
        '動くほど疲れるだけになりやすい。',
      ],
      caution: '無理に動くと逆流する。',
      actionHints: [
        '準備に時間を使う。',
        '1週間だけ様子を見る。',
      ],
      keywords: ['停滞', 'タイミング難', '空回り'],
    },
  },
  {
    id: 11,
    nameJa: '正義',
    upright: {
      core: '公平な基準で決断する力が働く。',
      concretes: [
        '感情よりルールや条件が鍵。',
        '白黒をつけることで整理される。',
      ],
      caution: '冷たく見られやすい。',
      actionHints: [
        '判断基準を数値化する。',
        '条件を整理する。',
      ],
      keywords: ['公平', '基準', '決断'],
    },
    reversed: {
      type: '不足',
      core: '基準が曖昧で迷いが長引く。',
      concretes: [
        '不公平感が強く判断がぶれる。',
        '責任を避けたくなる。',
      ],
      caution: '決断の先送りが損を生む。',
      actionHints: [
        '基準を1つだけ決める。',
        '責任範囲を明確にする。',
      ],
      keywords: ['不公平感', '迷い', '責任回避'],
    },
  },
  {
    id: 12,
    nameJa: '吊るされた男',
    upright: {
      core: 'いったん止めて視点を変える時。',
      concretes: [
        '犠牲の中に学びがある。',
        '急がない方が答えが見える。',
      ],
      caution: '止まりすぎると停滞する。',
      actionHints: [
        '情報収集を優先する。',
        '試し行動を1件だけ入れる。',
      ],
      keywords: ['視点転換', '一時停止', '学び'],
    },
    reversed: {
      type: '滞り',
      core: '無駄な我慢で停滞が固定されやすい。',
      concretes: [
        '耐えているのに意味が見えない。',
        '動かない理由が惰性になりやすい。',
      ],
      caution: '学びのない忍耐になる。',
      actionHints: [
        '意味のない我慢を1つやめる。',
        '視点を変える相談をする。',
      ],
      keywords: ['無駄な我慢', '停滞', '惰性'],
    },
  },
  {
    id: 13,
    nameJa: '死神',
    upright: {
      core: '終わらせて始める変化のカード。',
      concretes: [
        '区切りをつけるほど次が動く。',
        '古い流れを断つ時期。',
      ],
      caution: '未練が足を引っ張る。',
      actionHints: [
        '不要なものを手放す。',
        '区切りを宣言する。',
      ],
      keywords: ['終わらせる', '区切り', '再出発'],
    },
    reversed: {
      type: '滞り',
      core: '終わらせられず延命が続きやすい。',
      concretes: [
        '変化の決断が先延ばしになる。',
        '手放したくない理由に縛られる。',
      ],
      caution: '時間と気力が消耗する。',
      actionHints: [
        '期限を決める。',
        '手放す対象を1つ選ぶ。',
      ],
      keywords: ['延命', '先延ばし', '手放せない'],
    },
  },
  {
    id: 14,
    nameJa: '節制',
    upright: {
      core: 'バランス調整と回復。',
      concretes: [
        '無理なく整えるほど流れが良くなる。',
        '折衷案で前進できる。',
      ],
      caution: '妥協で芯がぼやける。',
      actionHints: [
        '生活のバランスを整える。',
        '中間案を作る。',
      ],
      keywords: ['調整', '折衷', '回復'],
    },
    reversed: {
      type: '過剰',
      core: '偏りが強く、不調和が出やすい。',
      concretes: [
        '頑張りすぎか怠けすぎに振れる。',
        'リズムが崩れて疲れやすい。',
      ],
      caution: '反動が大きくなる。',
      actionHints: [
        '偏りを1つ減らす。',
        '睡眠を整える。',
      ],
      keywords: ['不調和', '偏り', '乱れ'],
    },
  },
  {
    id: 15,
    nameJa: '悪魔',
    upright: {
      core: '執着や依存が強く、鎖が外れにくい。',
      concretes: [
        '怖さや欲で動きが縛られる。',
        'やめたいのにやめられない。',
      ],
      caution: '自覚が薄いと悪化する。',
      actionHints: [
        '依存の対象を可視化する。',
        '距離を置くルールを作る。',
      ],
      keywords: ['執着', '依存', '鎖'],
    },
    reversed: {
      type: '内向き',
      core: '執着をほどき始めるが、揺り戻しが出やすい。',
      concretes: [
        '解放の兆しはあるが不安が残る。',
        '切れたと思って戻る波がある。',
      ],
      caution: '油断すると元に戻る。',
      actionHints: [
        '距離を置く期限を決める。',
        '代替行動を1つ用意する。',
      ],
      keywords: ['解放', '断ち切り', '揺り戻し'],
    },
  },
  {
    id: 16,
    nameJa: '塔',
    upright: {
      core: '崩れ落ちることで真実が露呈する。',
      concretes: [
        '想定外の変化で方向転換が起きる。',
        '隠れていた問題が表に出る。',
      ],
      caution: '強行突破は傷が深くなる。',
      actionHints: [
        'リスクを洗い出す。',
        '安全第一で縮小する。',
      ],
      keywords: ['崩壊', '衝撃', '真実'],
    },
    reversed: {
      type: '滞り',
      core: '小さな崩壊で済ませて問題を先送りしやすい。',
      concretes: [
        '見て見ぬふりで不安定が続く。',
        '根本原因が残る。',
      ],
      caution: '後で大きく響く。',
      actionHints: [
        '痛い所を先に直す。',
        '1箇所だけ改善する。',
      ],
      keywords: ['先送り', '見て見ぬふり', '不安定'],
    },
  },
  {
    id: 17,
    nameJa: '星',
    upright: {
      core: '希望が見え、回復と道筋が整う。',
      concretes: [
        '少しずつ良い兆しが出る。',
        '理想が指針になりやすい。',
      ],
      caution: '理想だけで手が止まる。',
      actionHints: [
        '小さな成果を1つ作る。',
        '希望の根拠を書き出す。',
      ],
      keywords: ['希望', '回復', '道筋'],
    },
    reversed: {
      type: '不足',
      core: '希望が薄れ、手応えが不足しやすい。',
      concretes: [
        '成果が見えず意欲が下がる。',
        '理想疲れで距離が伸びる。',
      ],
      caution: '諦め癖が出やすい。',
      actionHints: [
        '目標を小さく再設定する。',
        '達成を1回作る。',
      ],
      keywords: ['希望薄れ', '理想疲れ', '手応え不足'],
    },
  },
  {
    id: 18,
    nameJa: '月',
    upright: {
      core: '不安と霧で視界が曖昧になりやすい。',
      concretes: [
        '情報が揃わず想像で揺れる。',
        '疲労で判断が曇る。',
      ],
      caution: '思い込みが強くなる。',
      actionHints: [
        '事実と想像を分けて書く。',
        '睡眠を整える。',
      ],
      keywords: ['不安', '霧', '疑心'],
    },
    reversed: {
      type: '過剰',
      core: '霧が晴れつつも過敏さが強まりやすい。',
      concretes: [
        '細部に敏感で警戒が強い。',
        '疑いが先に立つ。',
      ],
      caution: '疑心が人間関係を削る。',
      actionHints: [
        '確認を1つだけ取る。',
        '一晩置いて判断する。',
      ],
      keywords: ['霧が晴れる', '過敏', '疑いすぎ'],
    },
  },
  {
    id: 19,
    nameJa: '太陽',
    upright: {
      core: '明快な成功と追い風。',
      concretes: [
        '評価や成果が出やすい。',
        '前向きなエネルギーが増える。',
      ],
      caution: '勢いで雑になりやすい。',
      actionHints: [
        '成果を共有する。',
        '勢いのあるうちに進める。',
      ],
      keywords: ['成功', '明快', '追い風'],
    },
    reversed: {
      type: '過剰',
      core: '過信や息切れが出やすい。',
      concretes: [
        '勢いがあるが体力が追いつかない。',
        '見栄で無理をしがち。',
      ],
      caution: '無理の反動が大きい。',
      actionHints: [
        '休息を先に確保する。',
        '足元を確認する。',
      ],
      keywords: ['過信', '息切れ', '見栄'],
    },
  },
  {
    id: 20,
    nameJa: '審判',
    upright: {
      core: '再起と決着のタイミング。',
      concretes: [
        '過去の努力が評価されやすい。',
        '止まっていた件が動く。',
      ],
      caution: '迷いを残すと失速する。',
      actionHints: [
        '未完の件を整理する。',
        '連絡を1本入れる。',
      ],
      keywords: ['再起', '評価', '決着'],
    },
    reversed: {
      type: '滞り',
      core: '決着を避けて先延ばしになりやすい。',
      concretes: [
        '清算すべきことが残る。',
        '再挑戦の機会を逃しやすい。',
      ],
      caution: '結論が遅れるほど損が増える。',
      actionHints: [
        '期限を決める。',
        '清算の一歩を踏む。',
      ],
      keywords: ['先延ばし', '未清算', '停滞'],
    },
  },
  {
    id: 21,
    nameJa: '世界',
    upright: {
      core: '完成と達成。一区切りがつく。',
      concretes: [
        '成果が形になりやすい。',
        '次のステージへ移れる。',
      ],
      caution: '満足で止まる。',
      actionHints: [
        '成果をまとめて言語化する。',
        '次の目標を決める。',
      ],
      keywords: ['完成', '達成', '次へ'],
    },
    reversed: {
      type: '不足',
      core: '詰めが甘く未完成になりやすい。',
      concretes: [
        '中途半端で終わる。',
        '惰性が残る。',
      ],
      caution: '最後の一手を逃す。',
      actionHints: [
        '締めの確認を1つ入れる。',
        '最後の仕上げをする。',
      ],
      keywords: ['未完成', '物足りない', '惰性'],
    },
  },
];

export const TAROT_READING_MAP: Record<number, TarotCardDefinition> =
  Object.fromEntries(TAROT_READING_DICTIONARY.map(def => [def.id, def]));

export function getReadingDefinition(cardId: number): TarotCardDefinition {
  const def = TAROT_READING_MAP[cardId];
  if (!def) {
    throw new Error(`Unknown cardId: ${cardId}`);
  }
  return def;
}

export function getKeywordsForOrientation(cardId: number, isReversed: boolean): string[] {
  const def = getReadingDefinition(cardId);
  return isReversed ? def.reversed.keywords : def.upright.keywords;
}
