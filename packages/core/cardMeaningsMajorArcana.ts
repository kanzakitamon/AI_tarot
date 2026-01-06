export type ReversedType = 'lack' | 'excess' | 'stagnation' | 'inward';
export type ReversalMode = 'blocked' | 'released';
export type Role = 'situation' | 'obstacle' | 'advice';
export type Domain =
  | 'work'
  | 'love'
  | 'relationship'
  | 'health'
  | 'parenting'
  | 'money'
  | 'life'
  | 'unknown';

export type ActionHint = {
  domain: Domain | 'any';
  text: string;
};

export type Branch = {
  role: Role;
  lead: string;
  concretes: string[];
  riskOrBlindspot: string;
  avoidKeywords?: string[];
};

export type CardMeaning = {
  id: number;
  nameJa: string;
  upright: {
    core: string;
    branches: Branch[];
    actionHints: ActionHint[];
    domainLexicon?: Partial<Record<Domain, { keywords: string[] }>>;
  };
  reversed: {
    reversalMode: ReversalMode;
    reversedType: ReversedType;
    core: string;
    branches: Branch[];
    actionHints: ActionHint[];
    domainLexicon?: Partial<Record<Domain, { keywords: string[] }>>;
  };
};

export const REVERSED_TYPE_LABELS: Record<ReversedType, string> = {
  lack: '不足',
  excess: '過剰',
  stagnation: '滞り',
  inward: '内向き',
};

export const CARD_MEANINGS_MAJOR_ARCANA: CardMeaning[] = [
  {
    id: 0,
    nameJa: '愚者',
    upright: {
      core: '自由・新章・未確定の旅',
      branches: [
        {
          role: 'situation',
          lead: '新しい方向に踏み出す気持ちが強く、余白の多い状態。',
          concretes: [
            '予定が固まっていないぶん、試しながら形を作る流れになりやすい。',
            '常識より好奇心が勝ち、選択肢を広げる動きが出やすい。',
          ],
          riskOrBlindspot: '土台が薄いまま進むと、後半で不安が膨らみやすい。',
        },
        {
          role: 'obstacle',
          lead: '自由さが裏目に出て、軸が定まりにくい。',
          concretes: [
            '決めないことが安心になり、判断が先送りになりやすい。',
            '選択肢を広げすぎて、比較ばかりが増えやすい。',
          ],
          riskOrBlindspot: '方向が散るほど、成果より疲労が残りやすい。',
        },
        {
          role: 'advice',
          lead: '小さく試して、感覚を確かめるのが最短。',
          concretes: [
            '完璧さよりも、1回やって微調整する姿勢が合う。',
            '最初の一歩を軽くし、勢いを落とさず回すと進む。',
          ],
          riskOrBlindspot: '頭だけで計画すると、結局動けなくなりやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に「小さな初回」を1回だけ試す（応募1件・体験1回など）。' },
        { domain: 'any', text: '今週中に候補を3つ書き出し、1つに絞って試す（1回）。' },
        { domain: 'any', text: '48時間で不安点を2項目に縮め、確認の連絡を1回入れる。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'lack',
      core: '地に足がない・無計画・逃避',
      branches: [
        {
          role: 'situation',
          lead: '勢いだけで動き、現実の段取りが追いついていない。',
          concretes: [
            '気分で方向転換が増え、やりかけが積み上がりやすい。',
            '責任や条件の確認が後回しになり、落差が出やすい。',
          ],
          riskOrBlindspot: '信用や体力を削りやすいので、踏み出し直しが必要。',
        },
        {
          role: 'obstacle',
          lead: '「決めない自由」が逃げ道になりやすい。',
          concretes: [
            '選ばないことで不安を回避し、先延ばしが長引きやすい。',
            '軽さを優先するほど、肝心の条件が見えなくなる。',
          ],
          riskOrBlindspot: '曖昧さが増えるほど、迷いが固着しやすい。',
        },
        {
          role: 'advice',
          lead: '一度止めて、最低限の条件を決める。',
          concretes: [
            '必須条件を少数に絞ると、迷いが急に減る。',
            '進むなら小さく、戻るなら早めに切り替えるのが吉。',
          ],
          riskOrBlindspot: '条件がないまま動くと、同じ失敗が繰り返されやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に必須条件を2つだけ決め、紙に1行で書く。' },
        { domain: 'any', text: '今週中に「やらないこと」を1つ宣言する（1回）。' },
        { domain: 'any', text: '48時間で迷いの原因を3項目に分解し、1項目だけ対処する。' },
      ],
    },
  },
  {
    id: 1,
    nameJa: '魔術師',
    upright: {
      core: '形にする・開始・手札が揃う',
      branches: [
        {
          role: 'situation',
          lead: 'やるべき材料は揃い、実行に移す段階。',
          concretes: [
            '準備が整い、あとは手を動かすかどうかの局面。',
            '小さく始めると流れが乗りやすい。',
          ],
          riskOrBlindspot: '頭の中だけで終わると、機会が逃げやすい。',
        },
        {
          role: 'obstacle',
          lead: '準備で満足して、初動が遅れやすい。',
          concretes: [
            'できることが多すぎて手順が散り、焦点がぼやける。',
            '完璧に整えるほど、タイミングが遅れやすい。',
          ],
          riskOrBlindspot: '動かなさが自信低下を招きやすい。',
        },
        {
          role: 'advice',
          lead: '最初の一手を具体化し、形から入る。',
          concretes: [
            '道具や環境を先に整えると、迷いが減る。',
            '期限を切って実行すると、次の材料が集まる。',
          ],
          riskOrBlindspot: '言葉だけで押すと、信頼が削れやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に最初の一手を1つ決め、実行を1回する。' },
        { domain: 'any', text: '今週中に必要な道具を2つ準備し、開始の合図を作る。' },
        { domain: 'any', text: '48時間以内に試作品や下書きを1件作る。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'stagnation',
      core: '空回り・口先・実行不足',
      branches: [
        {
          role: 'situation',
          lead: '動きたいのに手順が噛み合わず、空回りしやすい。',
          concretes: [
            '言葉や計画だけ増え、実行が追いつかない。',
            '自信の波が大きく、勢いが続きにくい。',
          ],
          riskOrBlindspot: '期待値だけが上がり、失速が目立ちやすい。',
        },
        {
          role: 'obstacle',
          lead: '手札があるのに、使い方が定まらない。',
          concretes: [
            'あれもこれも触れて、結果が薄くなりやすい。',
            '周囲の評価を気にしすぎて、決断が遅れる。',
          ],
          riskOrBlindspot: '動けない自分を責め、さらに停滞しやすい。',
        },
        {
          role: 'advice',
          lead: 'やることを1つに絞って回す。',
          concretes: [
            '小さく終わるタスクを選ぶと、実行力が戻る。',
            '成果の形を先に決めると、迷いが減る。',
          ],
          riskOrBlindspot: '口先だけだと信頼が失われやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内にタスクを1つだけ選び、完了を1回作る。' },
        { domain: 'any', text: '今週中にやることを3項目に絞り、優先1位だけ着手する。' },
        { domain: 'any', text: '48時間以内に「動いた証拠」を1つ残す（提出1件など）。' },
      ],
    },
  },
  {
    id: 2,
    nameJa: '女教皇',
    upright: {
      core: '直感・本質・静観',
      branches: [
        {
          role: 'situation',
          lead: '感情よりも内側の確信が強く、静かな判断期。',
          concretes: [
            '派手さはないが、深く理解できる状態になりやすい。',
            '表面の情報より、本質を見抜く力が出ている。',
          ],
          riskOrBlindspot: '黙りすぎると、周囲に伝わらず誤解されやすい。',
        },
        {
          role: 'obstacle',
          lead: '静かさが強く、情報交換が止まりやすい。',
          concretes: [
            '正しさを保つほど、相談相手が減りやすい。',
            '慎重さが先行し、決断の材料が増えにくい。',
          ],
          riskOrBlindspot: '孤立が進むと、判断が内向きに偏りやすい。',
        },
        {
          role: 'advice',
          lead: '直感を言語化して、軸を見える形にする。',
          concretes: [
            '言葉にした瞬間、迷いが整理される。',
            '秘密を減らすほど判断の速度が戻る。',
          ],
          riskOrBlindspot: '感情だけで閉じると、選択肢が狭まりやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に本音を3行で書き、1人にだけ共有する。' },
        { domain: 'any', text: '今週中に判断軸を2項目に整理し、メモに残す。' },
        { domain: 'any', text: '48時間以内に情報源を1つ厳選して読み直す。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'stagnation',
      core: '直感遮断・本音不明・情報不足・隠し事',
      branches: [
        {
          role: 'situation',
          lead: '本音と情報が噛み合わず、判断軸が揺れている。',
          concretes: [
            '見えているはずのことが信じられず、疑いが増えやすい。',
            '要点が隠れたままで、決断が曖昧になりやすい。',
          ],
          riskOrBlindspot: '曖昧さが続くほど、疲労が強くなりやすい。',
        },
        {
          role: 'obstacle',
          lead: '情報が足りず、直感が機能しにくい。',
          concretes: [
            '事実確認より想像が先に立ち、判断が濁る。',
            '話せないことが増え、状況が閉じていく。',
          ],
          riskOrBlindspot: '秘密が増えるほど、選択を誤りやすい。',
        },
        {
          role: 'advice',
          lead: '隠し事を減らし、事実を一つずつ出す。',
          concretes: [
            '情報の穴を埋めると、直感が戻りやすい。',
            '決めない理由より、決める材料を集める。',
          ],
          riskOrBlindspot: '曖昧なまま進むと、誤解が積み上がりやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に不足情報を2項目だけ特定し、確認を1回する。' },
        { domain: 'any', text: '今週中に事実と想像を2列に書き分ける（1回）。' },
        { domain: 'any', text: '48時間以内に話せる範囲を1つ決めて共有する。' },
      ],
    },
  },
  {
    id: 3,
    nameJa: '女帝',
    upright: {
      core: '豊かさ・育てる・包容',
      branches: [
        {
          role: 'situation',
          lead: '育てる力が高まり、環境が実りやすい。',
          concretes: [
            '人や計画に余裕が生まれ、受け皿が広がりやすい。',
            '安心感が増え、魅力や引力が強く出やすい。',
          ],
          riskOrBlindspot: '甘さが増えると、締まりが弱くなりやすい。',
        },
        {
          role: 'obstacle',
          lead: '豊かさが過信になり、判断が緩みやすい。',
          concretes: [
            '手厚さが裏目に出て、相手の依存が増えやすい。',
            '居心地の良さが優先され、必要な決断が遅れる。',
          ],
          riskOrBlindspot: '現実の数字が甘く見積もられやすい。',
        },
        {
          role: 'advice',
          lead: '与える量を調整し、育てる範囲を決める。',
          concretes: [
            '境界線を引くほど、長期の安定が作れる。',
            '育てる対象を絞ると、実りがはっきりする。',
          ],
          riskOrBlindspot: '広げすぎると、疲労が先に出やすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に「育てたい対象」を1つ決め、1回だけ手をかける。' },
        { domain: 'any', text: '今週中に余裕の範囲を2項目で定義する（時間/お金など）。' },
        { domain: 'any', text: '48時間以内に支出や工数を3項目だけ見直す。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'excess',
      core: '甘え・浪費・過保護',
      branches: [
        {
          role: 'situation',
          lead: '与えすぎや甘えが強まり、バランスが崩れやすい。',
          concretes: [
            '気持ちはあるのに、結果がだらけやすい。',
            '楽さを優先し、やるべき締めが抜けやすい。',
          ],
          riskOrBlindspot: '信用と実利の両方が落ちやすい。',
        },
        {
          role: 'obstacle',
          lead: '過保護が成長を止めやすい。',
          concretes: [
            '相手の自立を奪い、関係が重くなる。',
            '甘さが続き、改善の機会が失われる。',
          ],
          riskOrBlindspot: '負担が偏ると、突然の反発が起きやすい。',
        },
        {
          role: 'advice',
          lead: '優しさを残しつつ、線を引く。',
          concretes: [
            '役割の線引きをするだけで、関係が軽くなる。',
            '使い方のルールを決めると、浪費が止まる。',
          ],
          riskOrBlindspot: '言いにくさを放置すると、後で大きく崩れやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に支出か工数を1項目だけ削減する。' },
        { domain: 'any', text: '今週中に「任せること」を2つ決め、1回手放す。' },
        { domain: 'any', text: '48時間以内に境界線のルールを1つ書き出す。' },
      ],
    },
  },
  {
    id: 4,
    nameJa: '皇帝',
    upright: {
      core: '統率・責任・ルール',
      branches: [
        {
          role: 'situation',
          lead: '主導権が必要な局面で、秩序を作る力が強い。',
          concretes: [
            '判断基準が明確で、周囲が動きやすい。',
            '責任を持って枠を作るほど安定する。',
          ],
          riskOrBlindspot: '強さが前に出すぎると、柔軟さが失われやすい。',
        },
        {
          role: 'obstacle',
          lead: '正しさへの固さが、対話の余地を狭める。',
          concretes: [
            '正論が強く、相手の本音が引っ込みやすい。',
            '手順を優先しすぎて、現場の声が遅れる。',
          ],
          riskOrBlindspot: '硬さが続くと、反発が増えやすい。',
        },
        {
          role: 'advice',
          lead: 'ルールを決めて、責任の範囲を明確にする。',
          concretes: [
            '決める範囲が明確になるほど、迷いが減る。',
            '基準を見せると、周囲の動きが早まる。',
          ],
          riskOrBlindspot: '締めるだけだと、協力が得られにくい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に判断基準を3項目で書き、1回共有する。' },
        { domain: 'any', text: '今週中に役割分担を2つ整理して伝える。' },
        { domain: 'any', text: '48時間以内に期限を1つ設定する。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'excess',
      core: '硬直・支配・独断',
      branches: [
        {
          role: 'situation',
          lead: '統率が強すぎて、柔軟性が落ちている。',
          concretes: [
            '自分の正しさが先行し、対話が減りやすい。',
            '責任を抱え込み、周囲の動きが鈍る。',
          ],
          riskOrBlindspot: '硬さが続くと、孤立が進みやすい。',
        },
        {
          role: 'obstacle',
          lead: '支配的な姿勢が摩擦を生みやすい。',
          concretes: [
            '指示が細かすぎて、相手の自発性が止まる。',
            '自分で抱えることで、判断が遅れる。',
          ],
          riskOrBlindspot: '反発が表面化すると、収拾がつきにくい。',
        },
        {
          role: 'advice',
          lead: '決める領域と任せる領域を分ける。',
          concretes: [
            '任せる範囲を決めるだけで、負荷が下がる。',
            '意見の入口を作ると、空気が変わる。',
          ],
          riskOrBlindspot: '全部握り続けると、限界が早く来やすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に任せる作業を2つ決め、1回手放す。' },
        { domain: 'any', text: '今週中に相談ルートを1つ作り、1回使う。' },
        { domain: 'any', text: '48時間以内に決裁基準を3項目に絞る。' },
      ],
    },
  },
  {
    id: 5,
    nameJa: '教皇',
    upright: {
      core: '王道・信頼・学び',
      branches: [
        {
          role: 'situation',
          lead: '正攻法が効きやすく、信頼を積む流れ。',
          concretes: [
            '教わる・守る姿勢が成果につながりやすい。',
            '共同体との結びつきが力になる。',
          ],
          riskOrBlindspot: '型に頼りすぎると、独自性が弱くなりやすい。',
        },
        {
          role: 'obstacle',
          lead: '伝統や常識が壁になりやすい。',
          concretes: [
            '正しさに寄りすぎて、柔軟な発想が出にくい。',
            '周囲の期待が重く、自由な判断が難しい。',
          ],
          riskOrBlindspot: '形式を守るほど、現実との差が開きやすい。',
        },
        {
          role: 'advice',
          lead: '王道を押さえつつ、自分の言葉にする。',
          concretes: [
            '基本に沿った上で、自分の意図を添えると通りやすい。',
            '相談できる人を選ぶと、迷いが整理される。',
          ],
          riskOrBlindspot: '反発だけだと、孤立が深まりやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に信頼できる人へ1回相談し、結論を仮決めする。' },
        { domain: 'any', text: '今週中に基本ルールを2項目確認し、遵守プランを作る。' },
        { domain: 'any', text: '48時間以内に学びのメモを3行にまとめる。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'stagnation',
      core: '形式だけ・依存・反発',
      branches: [
        {
          role: 'situation',
          lead: '型はあるのに中身が伴わず、停滞しやすい。',
          concretes: [
            '誰かの言葉に頼りすぎて、自分の判断が弱い。',
            '反発心が先に立ち、建設的な対話が止まりやすい。',
          ],
          riskOrBlindspot: '表面的な正しさだけ残り、信頼が薄くなりやすい。',
        },
        {
          role: 'obstacle',
          lead: '規範が息苦しさになり、動きが遅れる。',
          concretes: [
            '正しさを守るほど、本音が言えない。',
            '守るべきものが多すぎて、選択が鈍る。',
          ],
          riskOrBlindspot: '我慢が続くと、急な反動が出やすい。',
        },
        {
          role: 'advice',
          lead: '正しさの理由を言葉にし、主体性を戻す。',
          concretes: [
            '必要な型だけ残し、不要な型を外すと楽になる。',
            '自分の判断軸を出すと、協力が得やすい。',
          ],
          riskOrBlindspot: '依存だけだと、同じ停滞が繰り返されやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に守るルールを2つだけ残し、1つ外す。' },
        { domain: 'any', text: '今週中に自分の判断軸を3項目で書く（1回）。' },
        { domain: 'any', text: '48時間以内に相談相手を1人だけ変えて話す。' },
      ],
    },
  },
  {
    id: 6,
    nameJa: '恋人',
    upright: {
      core: '価値観の選択・一致',
      branches: [
        {
          role: 'situation',
          lead: '選択の軸が価値観に寄り、関係性が鍵になる。',
          concretes: [
            '条件よりも「何を大切にしたいか」が強く出る。',
            '他者との一致が見えると、一気に進みやすい。',
          ],
          riskOrBlindspot: '気持ちだけで進むと、条件の穴が残りやすい。',
        },
        {
          role: 'obstacle',
          lead: '選択肢が魅力的で、決め手が曖昧になりやすい。',
          concretes: [
            '周囲の期待や評価が混ざり、軸がぶれる。',
            'どちらも良く見え、決断が遅れる。',
          ],
          riskOrBlindspot: '優柔不断が続くと、機会を逃しやすい。',
        },
        {
          role: 'advice',
          lead: '価値観を一言で決め、その軸で選ぶ。',
          concretes: [
            '迷いは「優しさ」より「軸の不在」から起きやすい。',
            '軸が決まると、条件の優先順位が整う。',
          ],
          riskOrBlindspot: '周囲の声に寄ると、後で後悔が残りやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に大事にしたい価値観を1語で決め、メモに書く。' },
        { domain: 'any', text: '今週中に選択肢を2つ並べ、価値観で1回採点する。' },
        { domain: 'any', text: '48時間以内に相手の期待を1回だけ確認する。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'stagnation',
      core: '迷い・選べない・軸がブレる',
      branches: [
        {
          role: 'situation',
          lead: '決めきれず、軸が揺れて選択が止まりやすい。',
          concretes: [
            'どちらにも良さが見えて、決断が先延ばしになる。',
            '迷いが続き、行動が細切れになりやすい。',
          ],
          riskOrBlindspot: '迷いが続くと、満足度が下がりやすい。',
        },
        {
          role: 'obstacle',
          lead: '決め手が定まらず、選択が滞る。',
          concretes: [
            '条件や周囲の声が混ざり、軸がぶれる。',
            '結論を出しても揺れが戻りやすい。',
          ],
          riskOrBlindspot: '迷いが続くと、信頼が揺らぎやすい。',
        },
        {
          role: 'advice',
          lead: '選ばない選択をやめ、軸を固定する。',
          concretes: [
            '一言の軸があれば、誘惑に耐えやすい。',
            '価値観を言語化すると、決断が速くなる。',
          ],
          riskOrBlindspot: '軸がないままだと、同じ迷いが再発しやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に「譲れない条件」を2つだけ決める。' },
        { domain: 'any', text: '今週中に比較表を1枚作り、軸で1回だけ決める。' },
        { domain: 'any', text: '48時間以内に他人の期待を1つ外して考える。' },
      ],
    },
  },
  {
    id: 7,
    nameJa: '戦車',
    upright: {
      core: '前進・勝ちに行く・突破',
      branches: [
        {
          role: 'situation',
          lead: '勢いと行動力があり、前に進む局面。',
          concretes: [
            '迷うより動くことで成果が出やすい。',
            '勝ち筋が見えれば、加速が効く。',
          ],
          riskOrBlindspot: 'スピード重視だと、細部の確認が抜けやすい。',
        },
        {
          role: 'obstacle',
          lead: '勢いが強く、周囲との調整が遅れやすい。',
          concretes: [
            '前に出るほど、摩擦が起きやすい。',
            '勝ちに行く姿勢が、慎重さを削りやすい。',
          ],
          riskOrBlindspot: '暴走すると、信頼を失いやすい。',
        },
        {
          role: 'advice',
          lead: '目標を絞って、一直線に進む。',
          concretes: [
            '勝ち筋を1つに固定すると、迷いが消える。',
            '短期で区切ると、勢いが持続しやすい。',
          ],
          riskOrBlindspot: '方向がずれると、疲労が一気に出やすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に目標を1つ決め、最初の行動を1回打つ。' },
        { domain: 'any', text: '今週中に勝ち筋を2項目で定義し、進路を固定する。' },
        { domain: 'any', text: '48時間以内に進捗の区切りを1回作る。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'excess',
      core: '暴走・空回り・方向喪失',
      branches: [
        {
          role: 'situation',
          lead: '動いているのに前に進まず、空回りしやすい。',
          concretes: [
            '勢いだけが先行し、結果が伴わない。',
            '進む方向がぶれて、疲労が増える。',
          ],
          riskOrBlindspot: '勢いの反動で一気に失速しやすい。',
        },
        {
          role: 'obstacle',
          lead: '方向の合意が取れず、摩擦が強い。',
          concretes: [
            '自分のペースだけで動き、周囲がついてこない。',
            '勝ち急ぐほど、判断が粗くなる。',
          ],
          riskOrBlindspot: '衝突が増えると、協力が得にくい。',
        },
        {
          role: 'advice',
          lead: '速度を落として、進路を修正する。',
          concretes: [
            '短い停止が、結果的に速さを戻す。',
            '勝つよりも「ズレない」ことを優先する。',
          ],
          riskOrBlindspot: '修正を先送りすると、崩れが大きくなりやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に進行中の計画を1つ止め、方向を再確認する。' },
        { domain: 'any', text: '今週中に進路の合意を1回取り直す。' },
        { domain: 'any', text: '48時間以内に優先順位を3項目に絞る。' },
      ],
    },
  },
  {
    id: 8,
    nameJa: '力',
    upright: {
      core: '優しい胆力・自制',
      branches: [
        {
          role: 'situation',
          lead: '静かな強さで、感情を扱える状態。',
          concretes: [
            '強引に押すより、ゆっくり整えるほど進む。',
            '自分の感情をコントロールでき、安定が出やすい。',
          ],
          riskOrBlindspot: '我慢だけになると、疲労が溜まりやすい。',
        },
        {
          role: 'obstacle',
          lead: '耐えすぎて、限界が見えにくい。',
          concretes: [
            '優しさが先に立ち、言うべきことが遅れる。',
            '我慢が積み上がり、爆発の引き金になりやすい。',
          ],
          riskOrBlindspot: '我慢が続くと、反動が強く出やすい。',
        },
        {
          role: 'advice',
          lead: '落ち着いた強さで、主導権を取り戻す。',
          concretes: [
            '感情を抑えるより、扱う姿勢が効く。',
            '丁寧な一歩が、長期の安定につながる。',
          ],
          riskOrBlindspot: '自制を手放すと、関係が崩れやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に感情が揺れる場面を1つ選び、深呼吸を3回する。' },
        { domain: 'any', text: '今週中に我慢していることを1つ言語化する。' },
        { domain: 'any', text: '48時間以内に休息を1回確保し、回復の時間を作る。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'lack',
      core: '自制不足・空回り・感情が先に出る',
      branches: [
        {
          role: 'situation',
          lead: '我慢の限界が近く、感情が溢れやすい。',
          concretes: [
            '小さな刺激で反応が強く出やすい。',
            '自分にも相手にも厳しくなりやすい。',
          ],
          riskOrBlindspot: '爆発すると、関係の修復が難しくなる。',
        },
        {
          role: 'obstacle',
          lead: '意地が強く、素直な調整ができない。',
          concretes: [
            '折れない姿勢が、逆に消耗を増やす。',
            '頼ることができず、孤立が進む。',
          ],
          riskOrBlindspot: '限界を超えると、体調や判断が乱れやすい。',
        },
        {
          role: 'advice',
          lead: 'まず緩める。強さは回復から戻る。',
          concretes: [
            '無理を止めるだけで、状況が落ち着く。',
            '支えを借りると、力が循環しやすい。',
          ],
          riskOrBlindspot: '意地を通すほど、損失が大きくなりやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に頼れる相手に1回だけ相談する。' },
        { domain: 'any', text: '今週中に休息の時間を2回確保する。' },
        { domain: 'any', text: '48時間以内に無理な予定を1つ減らす。' },
      ],
    },
  },
  {
    id: 9,
    nameJa: '隠者',
    upright: {
      core: '内省・探究・賢い助言',
      branches: [
        {
          role: 'situation',
          lead: '内側を掘り下げ、答えを探す時間。',
          concretes: [
            '情報より洞察が重要になりやすい。',
            '一人の静かな時間が判断を助ける。',
          ],
          riskOrBlindspot: '閉じすぎると、チャンスを逃しやすい。',
        },
        {
          role: 'obstacle',
          lead: '内向きが強く、外の動きが止まりやすい。',
          concretes: [
            '慎重さが行動を止め、結果が遅れる。',
            '考えすぎで疲れが出やすい。',
          ],
          riskOrBlindspot: '孤立が進むと視野が狭まりやすい。',
        },
        {
          role: 'advice',
          lead: '深掘りしつつ、必要な一歩を外に出す。',
          concretes: [
            '小さな外部接点で十分に進む。',
            '問いを一つに絞ると、答えが見える。',
          ],
          riskOrBlindspot: '内省だけだと、現実が動かない。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に自分への質問を1つ決め、答えを3行書く。' },
        { domain: 'any', text: '今週中に信頼できる人と1回だけ対話する。' },
        { domain: 'any', text: '48時間以内に情報源を1つに絞って読み直す。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'inward',
      core: '孤立・こじらせ・閉じこもり',
      branches: [
        {
          role: 'situation',
          lead: '内向きが過ぎて、視野が硬くなっている。',
          concretes: [
            '一人で抱え込み、視点が固定されやすい。',
            '正解探しが長引き、結論が出にくい。',
          ],
          riskOrBlindspot: '孤立が続くと、判断が偏りやすい。',
        },
        {
          role: 'obstacle',
          lead: '外部の情報や支えを遮断しやすい。',
          concretes: [
            '人の意見が刺激になりすぎて避けてしまう。',
            '過去の経験に引っ張られ、今が見えない。',
          ],
          riskOrBlindspot: '閉じるほど、不安が増幅しやすい。',
        },
        {
          role: 'advice',
          lead: '小さな外の光を入れて、視野を戻す。',
          concretes: [
            '短い対話だけで思考がほぐれる。',
            '別の視点を入れると、答えが動く。',
          ],
          riskOrBlindspot: '一人で抱えるほど、行動が止まりやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に第三者の視点を1回だけ借りる。' },
        { domain: 'any', text: '今週中に「今の事実」を2項目だけ書く。' },
        { domain: 'any', text: '48時間以内に外に出る予定を1回入れる。' },
      ],
    },
  },
  {
    id: 10,
    nameJa: '運命の輪',
    upright: {
      core: '転機・流れに乗る・チャンス',
      branches: [
        {
          role: 'situation',
          lead: '流れが動き、転機が入りやすい。',
          concretes: [
            '偶然の連鎖で好機が生まれやすい。',
            'タイミング次第で一気に進む。',
          ],
          riskOrBlindspot: '流れ任せだけだと、主導権を失いやすい。',
        },
        {
          role: 'obstacle',
          lead: '流れの読み違いが、迷いを生みやすい。',
          concretes: [
            'チャンスが多く、選択が散る。',
            '動くべき時期が曖昧で、足踏みしやすい。',
          ],
          riskOrBlindspot: '流れを待ち続けると、停滞が長引く。',
        },
        {
          role: 'advice',
          lead: '小さく乗って、タイミングを掴む。',
          concretes: [
            '流れが来たら、軽い行動で乗る。',
            '止まるより試して調整する方が合う。',
          ],
          riskOrBlindspot: '受け身が続くと、運が薄くなりやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に来たチャンスに1回だけ乗る（応募1件など）。' },
        { domain: 'any', text: '今週中に流れの兆しを2項目メモする。' },
        { domain: 'any', text: '48時間以内に小さな選択を1回決める。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'stagnation',
      core: '停滞・タイミング難・流れが詰まる',
      branches: [
        {
          role: 'situation',
          lead: '流れが詰まり、追い風が止まっている。',
          concretes: [
            '動こうとしても噛み合わず、空回りしやすい。',
            'タイミングがずれ、結果が出にくい。',
          ],
          riskOrBlindspot: '焦るほど逆回転になりやすい。',
        },
        {
          role: 'obstacle',
          lead: '待ちすぎで、機会が通り過ぎやすい。',
          concretes: [
            '完璧なタイミングを探し、行動が遅れる。',
            '流れの変化に気づきにくい。',
          ],
          riskOrBlindspot: '遅れが続くと、選択肢が減りやすい。',
        },
        {
          role: 'advice',
          lead: '流れを作る側に回る。',
          concretes: [
            '小さく動くことで、停滞がほどける。',
            'タイミングを自分で区切ると進む。',
          ],
          riskOrBlindspot: '待ち続けると、閉塞感が強くなる。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に自分で期限を1つ設定する。' },
        { domain: 'any', text: '今週中に動けるタスクを2つ選び、1回着手する。' },
        { domain: 'any', text: '48時間以内に情報の更新を1回行う。' },
      ],
    },
  },
  {
    id: 11,
    nameJa: '正義',
    upright: {
      core: '公平・基準・決断',
      branches: [
        {
          role: 'situation',
          lead: '感情より基準が求められる局面。',
          concretes: [
            '整理すれば判断できる材料が揃い始めている。',
            '公平な視点が必要になる。',
          ],
          riskOrBlindspot: '基準が曖昧だと、迷いが長引きやすい。',
        },
        {
          role: 'obstacle',
          lead: '感情と基準がぶつかり、判断が揺れる。',
          concretes: [
            '正しさを求めるほど、決断が遅れる。',
            '周囲の評価が入り、基準が濁る。',
          ],
          riskOrBlindspot: '基準がないと、選択が後悔に変わりやすい。',
        },
        {
          role: 'advice',
          lead: '基準を固定し、機械的に判定する。',
          concretes: [
            '点数化や条件化が迷いを切る。',
            '期限を決めると決断が進む。',
          ],
          riskOrBlindspot: '感情だけで決めると、後で揺れやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に判断基準を3項目に固定し、1回採点する。' },
        { domain: 'any', text: '今週中に期限を1つ決めて宣言する。' },
        { domain: 'any', text: '48時間以内に基準に合わない要素を1つ切る。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'stagnation',
      core: '基準ブレ・決められない・責任が曖昧',
      branches: [
        {
          role: 'situation',
          lead: '公平さが揺らぎ、決断を避けやすい。',
          concretes: [
            'どちらも損に見えて、判断が止まる。',
            '責任を背負うことが怖くなりやすい。',
          ],
          riskOrBlindspot: '迷いが続くと、選択肢が狭まる。',
        },
        {
          role: 'obstacle',
          lead: '基準が曖昧で、判断が感情に傾く。',
          concretes: [
            '不公平感が強く、納得が作れない。',
            '正しさより楽さで決めてしまう。',
          ],
          riskOrBlindspot: '不満が残ると、やり直しが増えやすい。',
        },
        {
          role: 'advice',
          lead: '小さな基準から作り直す。',
          concretes: [
            '最低条件を決めるだけで迷いが減る。',
            '責任を背負う範囲を明確にすると動ける。',
          ],
          riskOrBlindspot: '基準がないままだと、後悔が残りやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に最低条件を2つ決め、1回だけ比較する。' },
        { domain: 'any', text: '今週中に責任範囲を1つ明文化する。' },
        { domain: 'any', text: '48時間以内に不公平だと感じる点を3行で書く。' },
      ],
    },
  },
  {
    id: 12,
    nameJa: '吊るされた男',
    upright: {
      core: '視点転換・一時停止・忍耐',
      branches: [
        {
          role: 'situation',
          lead: '今は止めて見直すことで道が開く。',
          concretes: [
            '動かず観察すると、違和感の正体が見える。',
            '遠回りに見えても、必要な時間になりやすい。',
          ],
          riskOrBlindspot: '耐えすぎると、停滞が固定されやすい。',
        },
        {
          role: 'obstacle',
          lead: '止まることが不安で、焦りが強い。',
          concretes: [
            '動けない自分を責めて、判断が乱れる。',
            '結果を急ぐほど、必要な学びが抜ける。',
          ],
          riskOrBlindspot: '焦りが増えると、選択を誤りやすい。',
        },
        {
          role: 'advice',
          lead: '視点を変えることで、次の一手が見える。',
          concretes: [
            '今は努力より、見方の切り替えが有効。',
            '一時停止を選ぶことで、無駄な消耗が止まる。',
          ],
          riskOrBlindspot: '止める理由が曖昧だと、ただの停滞になる。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に視点を変える質問を1つ作り、答えを1回書く。' },
        { domain: 'any', text: '今週中に「一旦止めること」を1つ決める。' },
        { domain: 'any', text: '48時間以内に情報収集を1回だけ行う。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'stagnation',
      core: '無駄な我慢・停滞の固定',
      branches: [
        {
          role: 'situation',
          lead: '止まっているのに、意味が見えない状態。',
          concretes: [
            '我慢が目的化し、前に進む理由が薄い。',
            '苦しさだけが続き、学びが得られにくい。',
          ],
          riskOrBlindspot: '停滞が固定されると、気力が削れやすい。',
        },
        {
          role: 'obstacle',
          lead: '犠牲が大きく、回復が遅れている。',
          concretes: [
            '頑張り続けるほど、現実が変わらない。',
            '止まる理由が整理されず、方向が見えない。',
          ],
          riskOrBlindspot: '疲労が溜まると、判断が鈍る。',
        },
        {
          role: 'advice',
          lead: '止める理由を整理し、動く条件を作る。',
          concretes: [
            '条件が決まると、停滞が終わりやすい。',
            '我慢の量を減らすと、視野が戻る。',
          ],
          riskOrBlindspot: '意味のない我慢を続けると、損失が増える。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に「止める条件」を2つ決める。' },
        { domain: 'any', text: '今週中に無駄な我慢を1つやめる。' },
        { domain: 'any', text: '48時間以内に回復の時間を1回確保する。' },
      ],
    },
  },
  {
    id: 13,
    nameJa: '死神',
    upright: {
      core: '終わりを区切って次へ進む',
      branches: [
        {
          role: 'situation',
          lead: '区切りが必要で、次の段階に移る流れ。',
          concretes: [
            '古い形を終えることで、新しい選択肢が開く。',
            '終わらせる対象が見え始めている。',
          ],
          riskOrBlindspot: '区切りを曖昧にすると、再出発が遅れる。',
        },
        {
          role: 'obstacle',
          lead: '区切る対象が曖昧で、次の一手が出ない。',
          concretes: [
            'やめる対象を決めない限り、選択肢が広がっても前に進まない。',
            '終わりを先に決めないと、行動が散りやすい。',
          ],
          riskOrBlindspot: '先延ばしが続くほど、消耗が積み上がる。',
          avoidKeywords: ['未練', '執着', '手放せない'],
        },
        {
          role: 'advice',
          lead: '終わらせることを決めて、始まりを作る。',
          concretes: [
            '区切りが決まると、迷いが急に減る。',
            '終わりを宣言すると、次が動き出す。',
          ],
          riskOrBlindspot: '決めないまま進むと、同じ停滞が続く。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に「終わらせること」を1つ決め、紙に1行で書く。' },
        { domain: 'any', text: '今週中に期限を1つ設定し、区切りを作る。' },
        { domain: 'any', text: '48時間以内にやらないことを1つ宣言する。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'stagnation',
      core: '延命・先延ばし・手放せない',
      branches: [
        {
          role: 'situation',
          lead: '終わらせるべきものが残り、停滞が続いている。',
          concretes: [
            '区切りを避けるほど、負担が重くなる。',
            '変化を怖がって、古い形を維持しやすい。',
          ],
          riskOrBlindspot: '延命が長引くと、回復に時間がかかる。',
        },
        {
          role: 'obstacle',
          lead: '変化の怖さが判断を止めている。',
          concretes: [
            '終わらせる決断が先送りになり、結論が伸びる。',
            '失う痛みが大きく見え、動けなくなる。',
          ],
          riskOrBlindspot: '先送りが続くと、選択肢が減りやすい。',
        },
        {
          role: 'advice',
          lead: '小さくでも区切って、流れを動かす。',
          concretes: [
            '小さな終わりを作ると、次が見える。',
            '区切りの言葉を出すだけで空気が変わる。',
          ],
          riskOrBlindspot: '曖昧なままだと、消耗が続く。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に「やめる理由」を1つ言語化する。' },
        { domain: 'any', text: '今週中に整理する対象を2項目決め、1つ手放す。' },
        { domain: 'any', text: '48時間以内に区切りの期限を1つ設定する。' },
      ],
    },
  },
  {
    id: 14,
    nameJa: '節制',
    upright: {
      core: '調整・折衷・回復',
      branches: [
        {
          role: 'situation',
          lead: '整えれば改善する流れで、バランスが鍵。',
          concretes: [
            '極端を避けるほど、安定が戻る。',
            '調整役が必要で、つなぎ方が重要。',
          ],
          riskOrBlindspot: 'ゆっくりすぎると、決断が遅れる。',
        },
        {
          role: 'obstacle',
          lead: 'バランスが崩れ、焦点が散る。',
          concretes: [
            '忙しさや疲れで、調整が後回しになる。',
            '両立に無理が出て、どちらも中途半端になる。',
          ],
          riskOrBlindspot: '偏りが続くと、回復が遅れる。',
        },
        {
          role: 'advice',
          lead: '配分を見直して、流れを整える。',
          concretes: [
            '少しの調整が、全体の安定につながる。',
            '混ぜ合わせを意識すると、摩擦が減る。',
          ],
          riskOrBlindspot: '放置すると、歪みが大きくなる。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に時間配分を2項目見直し、1回だけ調整する。' },
        { domain: 'any', text: '今週中に体調管理のルールを1つ決める。' },
        { domain: 'any', text: '48時間以内に優先順位を3つ書き出す。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'stagnation',
      core: '不調和・偏り・乱れ',
      branches: [
        {
          role: 'situation',
          lead: 'バランスが崩れ、どこかが過剰になっている。',
          concretes: [
            '片方に寄りすぎて、疲労が溜まりやすい。',
            '調整の余裕がなく、乱れが続く。',
          ],
          riskOrBlindspot: '放置すると、回復が遅れやすい。',
        },
        {
          role: 'obstacle',
          lead: '整える時間が取れず、乱れが固定される。',
          concretes: [
            '忙しさが続き、休息が削られる。',
            '優先順位が曖昧で、修正ができない。',
          ],
          riskOrBlindspot: '偏りが続くと、判断が荒れやすい。',
        },
        {
          role: 'advice',
          lead: '偏りを一つ戻して、回復を作る。',
          concretes: [
            '一ヶ所の調整だけでも流れが変わる。',
            'まず休息を戻すと、判断が落ち着く。',
          ],
          riskOrBlindspot: '整えないままだと、崩れが拡大する。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に休息時間を2回確保する。' },
        { domain: 'any', text: '今週中に過剰な予定を1つ減らす。' },
        { domain: 'any', text: '48時間以内に優先順位を1回整理する。' },
      ],
    },
  },
  {
    id: 15,
    nameJa: '悪魔',
    upright: {
      core: '執着・依存・鎖',
      branches: [
        {
          role: 'situation',
          lead: '欲や執着が強まり、手放しにくい状態。',
          concretes: [
            '楽さと引き換えに、自由が減りやすい。',
            'やめたいのにやめられない構造が出る。',
          ],
          riskOrBlindspot: '依存が続くと、判断が鈍る。',
        },
        {
          role: 'obstacle',
          lead: '快楽や安心が、判断を止めやすい。',
          concretes: [
            '短期の利得に引っ張られ、長期の損が見えない。',
            '不安を埋める行動が増え、選択が固定される。',
          ],
          riskOrBlindspot: '鎖が強いほど、抜けるのが難しくなる。',
        },
        {
          role: 'advice',
          lead: '鎖を自覚し、条件を切る。',
          concretes: [
            '依存の構造を見抜くと、抜け道が見える。',
            '誘惑を減らすほど、自由が戻る。',
          ],
          riskOrBlindspot: '放置すると、同じ循環に戻りやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に依存の対象を1つ特定し、距離を1回置く。' },
        { domain: 'any', text: '今週中に誘惑の入口を2つ減らす。' },
        { domain: 'any', text: '48時間以内に不安の原因を3行で書く。' },
      ],
    },
    reversed: {
      reversalMode: 'released',
      reversedType: 'stagnation',
      core: '解放の兆し・鎖がほどける',
      branches: [
        {
          role: 'situation',
          lead: '抜け出す兆しはあるが、揺り戻しが出やすい。',
          concretes: [
            '解放したい気持ちが強まり、決断のタイミング。',
            '鎖の存在に気づき、距離を取りたくなる。',
          ],
          riskOrBlindspot: '戻りやすいので、仕組み化が必要。',
        },
        {
          role: 'obstacle',
          lead: '習慣の力が強く、戻りやすい。',
          concretes: [
            '一時的に切れても、再び引き寄せられる。',
            '環境が変わらず、誘惑が残る。',
          ],
          riskOrBlindspot: '揺り戻しが続くと、自己否定が強まる。',
        },
        {
          role: 'advice',
          lead: '戻れない仕組みを作る。',
          concretes: [
            '距離を置くルールを作ると、解放が続く。',
            '代替行動を決めると、揺れが減る。',
          ],
          riskOrBlindspot: '仕組みがないと、再接続しやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に誘惑の入口を1つ閉じる。' },
        { domain: 'any', text: '今週中に代替行動を2つ決め、1回実行する。' },
        { domain: 'any', text: '48時間以内に距離を取るルールを1つ書く。' },
      ],
    },
  },
  {
    id: 16,
    nameJa: '塔',
    upright: {
      core: '崩壊・真実の露呈',
      branches: [
        {
          role: 'situation',
          lead: '隠れていた問題が表に出やすい局面。',
          concretes: [
            '予定外の出来事で、構造が揺さぶられる。',
            '誤魔化しが通らなくなり、真実が見える。',
          ],
          riskOrBlindspot: '衝撃が大きいほど、判断が荒れやすい。',
        },
        {
          role: 'obstacle',
          lead: '崩れを恐れて、対処が遅れやすい。',
          concretes: [
            '壊したくない気持ちが強く、対応が遅れる。',
            '衝撃への動揺で、優先順位が乱れる。',
          ],
          riskOrBlindspot: '先送りすると、被害が拡大しやすい。',
        },
        {
          role: 'advice',
          lead: '壊れるものを受け入れ、再構築へ。',
          concretes: [
            '事実を認めるほど、修復が早い。',
            '小さく壊して整える方が被害が少ない。',
          ],
          riskOrBlindspot: '否定し続けると、破綻が大きくなる。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に壊れた点を1つ特定し、対処を1回する。' },
        { domain: 'any', text: '今週中に不要な要素を2つ削減する。' },
        { domain: 'any', text: '48時間以内に優先順位を1回付け直す。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'stagnation',
      core: '小崩壊で済ませる・見て見ぬふり',
      branches: [
        {
          role: 'situation',
          lead: '問題を小さく見積もり、先送りしやすい。',
          concretes: [
            '崩れの兆しを見ているのに、手を付けない。',
            '表面だけ整えて、根の問題が残る。',
          ],
          riskOrBlindspot: '見過ごすほど、後で大きく崩れる。',
        },
        {
          role: 'obstacle',
          lead: '痛みを避けて、対応が中途半端になる。',
          concretes: [
            '修正の怖さが強く、触れない。',
            '今だけを凌いで、根本が置き去りになる。',
          ],
          riskOrBlindspot: '中途半端が続くと、信用が落ちやすい。',
        },
        {
          role: 'advice',
          lead: '小さな崩れのうちに手を入れる。',
          concretes: [
            '小修正を重ねるだけで、破綻を防げる。',
            '事実確認を先にすると、動きやすい。',
          ],
          riskOrBlindspot: '先延ばしが続くと、修復コストが上がる。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に問題の核を1つ書き出し、対処を1回始める。' },
        { domain: 'any', text: '今週中に先延ばし項目を2つ洗い出す。' },
        { domain: 'any', text: '48時間以内に現状確認を1回行う。' },
      ],
    },
  },
  {
    id: 17,
    nameJa: '星',
    upright: {
      core: '希望・回復・道筋',
      branches: [
        {
          role: 'situation',
          lead: '回復の兆しがあり、道筋が見え始める。',
          concretes: [
            '小さな希望が積み上がりやすい。',
            '理想に向けた方向感が戻りやすい。',
          ],
          riskOrBlindspot: '希望が抽象のままだと、行動が止まる。',
        },
        {
          role: 'obstacle',
          lead: '理想が高く、現実との距離が不安になる。',
          concretes: [
            '手応えの薄さが焦りを生む。',
            '理想が大きく、現実が小さく見える。',
          ],
          riskOrBlindspot: '希望が遠いほど、継続が難しい。',
        },
        {
          role: 'advice',
          lead: '希望を小さく形にして積み上げる。',
          concretes: [
            '小さな達成が自信を戻す。',
            '理想を分解すると、道が明確になる。',
          ],
          riskOrBlindspot: '理想だけだと、疲労が増える。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に小さな達成を1つ作る（提出1件など）。' },
        { domain: 'any', text: '今週中に理想を3項目に分解する。' },
        { domain: 'any', text: '48時間以内に進捗を1回記録する。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'lack',
      core: '希望薄れ・理想疲れ・手応え不足',
      branches: [
        {
          role: 'situation',
          lead: '理想はあるが手応えが薄く、気持ちが沈みやすい。',
          concretes: [
            '期待と現実の差が大きく感じる。',
            '頑張っているのに報われない感覚が強い。',
          ],
          riskOrBlindspot: '希望が消えると、継続が難しい。',
        },
        {
          role: 'obstacle',
          lead: '理想疲れが行動を止めやすい。',
          concretes: [
            '高望みになり、現実の改善が見えない。',
            '比較が増えて、自信が削られる。',
          ],
          riskOrBlindspot: '手応えの薄さが諦めに繋がる。',
        },
        {
          role: 'advice',
          lead: '希望のサイズを調整して、実感を作る。',
          concretes: [
            '目標を小さくすると、回復が早い。',
            'できたことを拾うほど、希望が戻る。',
          ],
          riskOrBlindspot: '理想だけ追うと、疲労が続く。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に達成できる目標を1つに縮める。' },
        { domain: 'any', text: '今週中にできたことを2項目書く。' },
        { domain: 'any', text: '48時間以内に比較対象を1つ外す。' },
      ],
    },
  },
  {
    id: 18,
    nameJa: '月',
    upright: {
      core: '不安・霧・疑心',
      branches: [
        {
          role: 'situation',
          lead: '視界が霧がかり、不安が増えやすい。',
          concretes: [
            '情報が曖昧で、想像が先に動く。',
            '気分の波で判断が揺れやすい。',
          ],
          riskOrBlindspot: '不安が増えるほど、決断が遅れる。',
        },
        {
          role: 'obstacle',
          lead: '疑いが強く、事実確認が進みにくい。',
          concretes: [
            '噂や主観に引っ張られ、判断が濁る。',
            '疲労で視界が狭くなる。',
          ],
          riskOrBlindspot: '疑心が続くと、人間関係が硬くなる。',
        },
        {
          role: 'advice',
          lead: '霧を晴らすために、事実を拾う。',
          concretes: [
            '疑いは確認で薄くなる。',
            '情報を絞ると、不安が落ち着く。',
          ],
          riskOrBlindspot: '放置すると、誤解が積み上がる。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に不安点を1つ選び、確認を1回する。' },
        { domain: 'any', text: '今週中に事実だけを3項目メモする。' },
        { domain: 'any', text: '48時間以内に情報源を1つ減らす。' },
      ],
    },
    reversed: {
      reversalMode: 'released',
      reversedType: 'stagnation',
      core: '霧が晴れる・見抜きが進む・明確化',
      branches: [
        {
          role: 'situation',
          lead: '霧が晴れ、事実が見え始めている。',
          concretes: [
            '疑いが薄れ、現実的な判断に戻る。',
            '違和感の正体が見えやすい。',
          ],
          riskOrBlindspot: '過敏になると、必要以上に反応しやすい。',
        },
        {
          role: 'obstacle',
          lead: '警戒が強く、確信に至りにくい。',
          concretes: [
            '疑いを手放せず、決断が遅れる。',
            '小さな違和感を過大に見積もる。',
          ],
          riskOrBlindspot: '過剰な警戒が、人間関係を硬くする。',
        },
        {
          role: 'advice',
          lead: '確かな情報だけを使い、判断を進める。',
          concretes: [
            '事実を積み上げると、迷いが消える。',
            '疑いは一度区切ると行動が進む。',
          ],
          riskOrBlindspot: '警戒が強いままだと、機会を逃しやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に事実確認を1回だけ行い、結論を1つ出す。' },
        { domain: 'any', text: '今週中に疑いの根拠を2項目書く。' },
        { domain: 'any', text: '48時間以内に過敏な反応を1回止める。' },
      ],
    },
  },
  {
    id: 19,
    nameJa: '太陽',
    upright: {
      core: '成功・明快・追い風',
      branches: [
        {
          role: 'situation',
          lead: '明るい追い風が吹き、成果が出やすい。',
          concretes: [
            '状況がクリアになり、迷いが消える。',
            '評価や成果が見えやすい。',
          ],
          riskOrBlindspot: '勢いに甘えると、細部が抜けやすい。',
        },
        {
          role: 'obstacle',
          lead: '明るさが強く、油断が出やすい。',
          concretes: [
            '順調さに頼り、準備が粗くなる。',
            '成功前提で進み、リスクが見えにくい。',
          ],
          riskOrBlindspot: '過信が続くと、反動が大きい。',
        },
        {
          role: 'advice',
          lead: '追い風を活かしつつ、確認を忘れない。',
          concretes: [
            '明快さを武器に、素早く決断する。',
            '成果を見える化すると、さらに伸びる。',
          ],
          riskOrBlindspot: '浮かれすぎると、信用を落としやすい。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に成果を1つ形にして共有する。' },
        { domain: 'any', text: '今週中に成功要因を2項目言語化する。' },
        { domain: 'any', text: '48時間以内に確認ポイントを1回見直す。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'excess',
      core: '過信・息切れ・見栄',
      branches: [
        {
          role: 'situation',
          lead: '勢いが強すぎて、息切れしやすい。',
          concretes: [
            '明るさが無理を生み、疲労が出る。',
            '見栄が先行し、実力とのズレが出る。',
          ],
          riskOrBlindspot: '過信が続くと、信頼が揺らぎやすい。',
        },
        {
          role: 'obstacle',
          lead: '順調さに依存し、確認が抜けやすい。',
          concretes: [
            '見せ方を優先し、実態が薄くなる。',
            '疲労を無視して進み、失速が出る。',
          ],
          riskOrBlindspot: '息切れすると、巻き返しが難しい。',
        },
        {
          role: 'advice',
          lead: '勢いを管理し、実力に合わせる。',
          concretes: [
            'ペース調整で成果が安定する。',
            '正直な見積もりが成功を守る。',
          ],
          riskOrBlindspot: '無理を続けると、信用が落ちる。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内にペースを1段階落とす。' },
        { domain: 'any', text: '今週中に現実の数値を2項目確認する。' },
        { domain: 'any', text: '48時間以内に休息を1回入れる。' },
      ],
    },
  },
  {
    id: 20,
    nameJa: '審判',
    upright: {
      core: '再起・評価・決着',
      branches: [
        {
          role: 'situation',
          lead: '再評価の時期で、決着が近づいている。',
          concretes: [
            '過去の努力が戻ってくる流れ。',
            'やり直しの機会が現れやすい。',
          ],
          riskOrBlindspot: '過去に囚われると、動きが遅れる。',
        },
        {
          role: 'obstacle',
          lead: '評価を恐れて、動きが止まりやすい。',
          concretes: [
            '判断されることが怖く、発表が遅れる。',
            '過去の失敗が足かせになる。',
          ],
          riskOrBlindspot: '躊躇が続くと、チャンスが薄れる。',
        },
        {
          role: 'advice',
          lead: 'やり直しの合図に応える。',
          concretes: [
            '結果を出すより、再挑戦の姿勢が鍵。',
            '決着を付ける覚悟で進むと道が開く。',
          ],
          riskOrBlindspot: '過去に縛られると、前に進めない。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に再挑戦の一歩を1回踏む（連絡1件など）。' },
        { domain: 'any', text: '今週中に過去の整理を2項目行う。' },
        { domain: 'any', text: '48時間以内に決着させたい点を1つ決める。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'stagnation',
      core: '先延ばし・未清算・呼び戻しに鈍い',
      branches: [
        {
          role: 'situation',
          lead: '決着がつかず、未清算が残っている。',
          concretes: [
            'やり直しの機会があるのに気づきにくい。',
            '過去が重く、動きが鈍る。',
          ],
          riskOrBlindspot: '未清算が続くと、次に進みにくい。',
        },
        {
          role: 'obstacle',
          lead: '決断の先延ばしが、停滞を作る。',
          concretes: [
            '答えを出すのが怖く、判断が遅れる。',
            '評価への不安が行動を止める。',
          ],
          riskOrBlindspot: '先延ばしが続くと、機会を逃す。',
        },
        {
          role: 'advice',
          lead: '未清算を一つだけ終わらせる。',
          concretes: [
            '小さな決着が、流れを動かす。',
            '過去の整理を進めるほど前に進む。',
          ],
          riskOrBlindspot: '曖昧さが残ると、同じ停滞が続く。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に未清算を1つ片付ける。' },
        { domain: 'any', text: '今週中に再評価の場を1回作る。' },
        { domain: 'any', text: '48時間以内に決める期限を1つ設定する。' },
      ],
    },
  },
  {
    id: 21,
    nameJa: '世界',
    upright: {
      core: '完成・達成・次へ',
      branches: [
        {
          role: 'situation',
          lead: '一区切りが見え、完成に近い。',
          concretes: [
            '今の段階で成果をまとめやすい。',
            '達成感があり、次の段階へ進む準備がある。',
          ],
          riskOrBlindspot: '完成を急ぐと、仕上げが甘くなる。',
        },
        {
          role: 'obstacle',
          lead: '完成が見えて油断しやすい。',
          concretes: [
            '詰めの確認が抜け、やり直しが出る。',
            '次を急ぐほど、今の仕上げが雑になる。',
          ],
          riskOrBlindspot: '最後の甘さが、評価を下げやすい。',
        },
        {
          role: 'advice',
          lead: 'まとめて完了させ、次へ渡す。',
          concretes: [
            '完成の定義を決めると迷いが消える。',
            '結果を共有すると、次が始まる。',
          ],
          riskOrBlindspot: '終わらせないと、次の流れが来ない。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に完成の条件を3項目で定義する。' },
        { domain: 'any', text: '今週中に成果を1回共有する。' },
        { domain: 'any', text: '48時間以内に仕上げの確認を1回行う。' },
      ],
    },
    reversed: {
      reversalMode: 'blocked',
      reversedType: 'lack',
      core: '未完成・詰めの甘さ・低迷',
      branches: [
        {
          role: 'situation',
          lead: '最後の詰めが弱く、未完成感が残る。',
          concretes: [
            '仕上げが足りず、達成感が出にくい。',
            '途中で止まり、低迷が続く。',
          ],
          riskOrBlindspot: '曖昧なままだと、評価が伸びない。',
        },
        {
          role: 'obstacle',
          lead: '完成条件が曖昧で、行動が止まる。',
          concretes: [
            '何をもって終わりかが決まらない。',
            '小さな不足が積み上がる。',
          ],
          riskOrBlindspot: '詰めが弱いと、やり直しが増える。',
        },
        {
          role: 'advice',
          lead: '完成条件を具体化し、締める。',
          concretes: [
            '最後の一歩を決めると、停滞が終わる。',
            '不足を埋めると、自信が戻る。',
          ],
          riskOrBlindspot: '曖昧なままだと、同じ低迷が続く。',
        },
      ],
      actionHints: [
        { domain: 'any', text: '7日以内に不足点を2つ書き出し、1つだけ補う。' },
        { domain: 'any', text: '今週中に完成条件を1回見直す。' },
        { domain: 'any', text: '48時間以内に詰めの作業を1つ終える。' },
      ],
    },
  },
];

const CARD_MEANINGS_BY_ID = new Map(
  CARD_MEANINGS_MAJOR_ARCANA.map(def => [def.id, def]),
);

export function getCardMeaningById(cardId: number): CardMeaning {
  const meaning = CARD_MEANINGS_BY_ID.get(cardId);
  if (!meaning) {
    throw new Error(`Card meaning not found for id: ${cardId}`);
  }
  return meaning;
}

export function splitKeywords(text: string): string[] {
  const parts = text
    .split(/[／・、]/)
    .map(part => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [text];
}

