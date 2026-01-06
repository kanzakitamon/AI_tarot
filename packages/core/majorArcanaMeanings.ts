import { CARD_MEANINGS_MAJOR_ARCANA, splitKeywords } from './cardMeaningsMajorArcana';

export type MajorArcanaMeaning = {
  name: string;
  upright: string[];
  reversed: string[];
};

export const MAJOR_ARCANA_MEANINGS: Record<number, MajorArcanaMeaning> =
  Object.fromEntries(
    CARD_MEANINGS_MAJOR_ARCANA.map(def => [
      def.id,
      {
        name: def.nameJa,
        upright: splitKeywords(def.upright.core),
        reversed: splitKeywords(def.reversed.core),
      },
    ]),
  );
