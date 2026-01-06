import type { CardPick, CardRole, PickedCard } from './deck';

export interface ReadingResult {
  id: number;
  createdAt: string;
  inputText: string;
  questionNormalized: string;
  picks: PickedCard[];
  finalText: string;
}

export interface DailyUsage {
  dateKey: string;
  freeUsedCount: number;
  rewardUsedCount: number;
}

export type { CardPick, CardRole, PickedCard };
