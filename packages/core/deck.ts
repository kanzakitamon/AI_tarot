import {
  CARD_MEANINGS_MAJOR_ARCANA,
  REVERSED_TYPE_LABELS,
  getCardMeaningById,
  splitKeywords,
} from './cardMeaningsMajorArcana';

export interface Card {
  id: number;
  nameJP: string;
  keywordsJP: string[];
  shortDescJP: string;
  imageFront: string;
  image?: any;
}

export const CARD_BACK_IMAGE_PATH = '../../assets/cards/card-back.png';

const cardImages: Record<number, any> = {
  0: require('../../assets/cards/00-fool.png'),
  1: require('../../assets/cards/01-magician.png'),
  2: require('../../assets/cards/02-high-priestess.png'),
  3: require('../../assets/cards/03-empress.png'),
  4: require('../../assets/cards/04-emperor.png'),
  5: require('../../assets/cards/05-hierophant.png'),
  6: require('../../assets/cards/06-lovers.png'),
  7: require('../../assets/cards/07-chariot.png'),
  8: require('../../assets/cards/08-strength.png'),
  9: require('../../assets/cards/09-hermit.png'),
  10: require('../../assets/cards/10-wheel-of-fortune.png'),
  11: require('../../assets/cards/11-justice.png'),
  12: require('../../assets/cards/12-hanged-man.png'),
  13: require('../../assets/cards/13-death.png'),
  14: require('../../assets/cards/14-temperance.png'),
  15: require('../../assets/cards/15-devil.png'),
  16: require('../../assets/cards/16-tower.png'),
  17: require('../../assets/cards/17-star.png'),
  18: require('../../assets/cards/18-moon.png'),
  19: require('../../assets/cards/19-sun.png'),
  20: require('../../assets/cards/20-judgement.png'),
  21: require('../../assets/cards/21-world.png'),
};

const CARD_IMAGE_SLUGS = [
  '00-fool',
  '01-magician',
  '02-high-priestess',
  '03-empress',
  '04-emperor',
  '05-hierophant',
  '06-lovers',
  '07-chariot',
  '08-strength',
  '09-hermit',
  '10-wheel-of-fortune',
  '11-justice',
  '12-hanged-man',
  '13-death',
  '14-temperance',
  '15-devil',
  '16-tower',
  '17-star',
  '18-moon',
  '19-sun',
  '20-judgement',
  '21-world',
];

const CARD_DESCRIPTIONS = CARD_MEANINGS_MAJOR_ARCANA.map(def => ({
  id: def.id,
  nameJP: def.nameJa,
  keywordsJP: splitKeywords(def.upright.core),
  shortDescJP: def.upright.core,
}));

export const CARDS: Card[] = CARD_DESCRIPTIONS.map(def => ({
  id: def.id,
  nameJP: def.nameJP,
  keywordsJP: def.keywordsJP,
  shortDescJP: def.shortDescJP,
  imageFront: `assets/cards/${CARD_IMAGE_SLUGS[def.id]}.png`,
  image: cardImages[def.id],
}));

export type CardRole = 'situation' | 'obstacle' | 'advice';

export interface PickedCard {
  role: CardRole;
  cardId: number;
  isReversed: boolean;
}

export interface CardPick {
  role: CardRole;
  cardId: number;
  isReversed: boolean;
  keywordsJP: string[];
  cardNameJP: string;
}

export function shuffleDeck(seed?: number): number[] {
  const deck = Array.from({ length: CARD_DESCRIPTIONS.length }, (_, i) => i);
  const random = seed
    ? () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      }
    : Math.random;

  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

export function normalizeQuestion(inputText: string): string {
  const normalized = inputText.trim().replace(/\s+/g, ' ');
  if (normalized.length === 0) {
    return '\u4eca\u5f8c\u306e\u904b\u52e2\u306b\u3064\u3044\u3066';
  }
  return normalized.replace(/[\u3001\u3002\uff01\uff1f]+/g, ' ').slice(0, 100).trim();
}

export function pickRoles(
  pickedIdsInOrder: number[],
): Array<{ role: CardRole; cardId: number }> {
  const roles: CardRole[] = ['situation', 'obstacle', 'advice'];
  return pickedIdsInOrder.slice(0, 3).map((cardId, index) => ({
    role: roles[index],
    cardId,
  }));
}

export function decideReversed(cardId: number, seed?: number): boolean {
  const random = seed
    ? () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      }
    : Math.random;
  return random() < 0.5;
}

export function getCardKeywords(cardId: number, isReversed: boolean): string[] {
  const meaning = getCardMeaningById(cardId);
  const core = isReversed ? meaning.reversed.core : meaning.upright.core;
  return splitKeywords(core);
}

const ROLE_LABELS: Record<CardRole, string> = {
  situation: '状況',
  obstacle: '障害',
  advice: '助言',
};

export function buildPrompt(questionNormalized: string, picks: CardPick[]): string {
  const buildSection = (pick: CardPick, label: string) => {
    const def = getCardMeaningById(pick.cardId);
    const orientationLabel = pick.isReversed ? '逆位置' : '正位置';
    const meaning = pick.isReversed ? def.reversed : def.upright;
    const branch =
      meaning.branches.find(item => item.role === pick.role) ?? meaning.branches[0];
    const reversedType = pick.isReversed
      ? REVERSED_TYPE_LABELS[def.reversed.reversedType]
      : 'なし';
    const reversalMode = pick.isReversed ? def.reversed.reversalMode : 'なし';
    const concretes = branch.concretes.slice(0, 2).join(' / ');
    const actionHints = meaning.actionHints
      .slice(0, 2)
      .map(hint => hint.text)
      .join(' / ');

    return [
      `${label}: ${def.nameJa}（${orientationLabel}）`,
      `${label}_要点: ${meaning.core}`,
      `${label}_読み筋: ${branch.lead}`,
      `${label}_具体像候補: ${concretes}`,
      `${label}_注意点候補: ${branch.riskOrBlindspot}`,
      `${label}_行動ヒント候補: ${actionHints}`,
      `${label}_逆位置タイプ: ${reversedType}`,
      `${label}_reversalMode: ${reversalMode}`,
    ].join('\n');
  };

  const cardDescriptions = picks
    .map(pick => buildSection(pick, ROLE_LABELS[pick.role]))
    .join('\n\n');

  return [
    '以下は占いの入力データです。相談文とカード情報だけを根拠に鑑定してください。カード情報の文章は素材であり、原文を貼り付けず自然な日本語に再構成してください。出力はsystemにある4章の形式のみ。余計な説明、箇条書き記号、Markdown記号は使わない。',
    '',
    '【相談】',
    questionNormalized,
    '',
    '【カード情報】',
    cardDescriptions,
    '',
    '生成ルール',
    '相談文から相談ジャンルを推定し、語彙と行動をジャンルに合わせる。ジャンルが確信できない場合は中立語彙でまとめ、確認ポイントを1文だけ入れて補強する。助言の行動は候補から1つ選び、相談内容に合わせて具体化し、期限と数量を必ず入れる。reversalModeがreleasedの場合は逆位置でも改善や解除のトーンを優先する。結論では「カードが示す通り」「カードが告げるように」は使わず、カード名は1回までか省略する。本文に「核:」「具体像:」「注意点:」のラベルは出さない。',
    '本文の先頭は必ず主語か動詞で始め、「としては」「には」「となっている」「として、」など助詞から始めない。',
  ].join('\n');
}

