import { useState, useCallback } from 'react';
import {
  CARDS,
  shuffleDeck,
  normalizeQuestion,
  pickRoles,
  decideReversed,
  getCardKeywords,
} from '../../packages/core/deck';
import type { CardRole, CardPick, PickedCard } from '../../packages/core/types';
import { generateReading } from '../services/aiService';
import {
  getDatabase,
  saveReadingResult,
  incrementFreeUsage,
  incrementRewardUsage,
} from '../db';

export type UsageType = 'free' | 'reward';

export type ReadingState =
  | 'input'
  | 'shuffling'
  | 'picking'
  | 'arranged'
  | 'flipping'
  | 'generating'
  | 'result';

export interface ReadingFlowState {
  state: ReadingState;
  inputText: string;
  questionNormalized: string;
  shuffledDeck: number[];
  pickedCardIds: number[];
  arrangedPicks: Array<{ role: CardRole; cardId: number }>;
  flippedCards: boolean[];
  reversedStates: boolean[];
  finalResult?: string;
  errorMessage?: string;
}

export function useReadingFlow() {
  const [flowState, setFlowState] = useState<ReadingFlowState>({
    state: 'input',
    inputText: '',
    questionNormalized: '',
    shuffledDeck: [],
    pickedCardIds: [],
    arrangedPicks: [],
    flippedCards: [],
    reversedStates: [],
    finalResult: undefined,
    errorMessage: undefined,
  });

  const startReading = useCallback((inputText: string) => {
    const normalized = normalizeQuestion(inputText);
    const shuffled = shuffleDeck();

    setFlowState({
      state: 'shuffling',
      inputText,
      questionNormalized: normalized,
      shuffledDeck: shuffled,
      pickedCardIds: [],
      arrangedPicks: [],
      flippedCards: [],
      reversedStates: [],
      finalResult: undefined,
      errorMessage: undefined,
    });

    setTimeout(() => {
      setFlowState(prev => ({
        ...prev,
        state: 'picking',
      }));
    }, 1200);
  }, []);

  const pickCard = useCallback((cardId: number) => {
    setFlowState(prev => {
      if (prev.pickedCardIds.includes(cardId) || prev.pickedCardIds.length >= 3) {
        return prev;
      }

      const newPickedIds = [...prev.pickedCardIds, cardId];

      if (newPickedIds.length === 3) {
        const arranged = pickRoles(newPickedIds);
        return {
          ...prev,
          pickedCardIds: newPickedIds,
          arrangedPicks: arranged,
          state: 'arranged',
        };
      }

      return {
        ...prev,
        pickedCardIds: newPickedIds,
      };
    });
  }, []);

  const toggleSelect = useCallback((cardId: number) => {
    setFlowState(prev => {
      const isSelected = prev.pickedCardIds.includes(cardId);
      let newPickedIds: number[];

      if (isSelected) {
        newPickedIds = prev.pickedCardIds.filter(id => id !== cardId);
      } else {
        if (prev.pickedCardIds.length >= 3) {
          return prev;
        }
        newPickedIds = [...prev.pickedCardIds, cardId];
      }

      return {
        ...prev,
        pickedCardIds: newPickedIds,
      };
    });
  }, []);

  const confirmSelection = useCallback(() => {
    setFlowState(prev => {
      if (prev.pickedCardIds.length !== 3) {
        return prev;
      }
      const arranged = pickRoles(prev.pickedCardIds);
      const reversedStates = arranged.map(pick => decideReversed(pick.cardId));
      return {
        ...prev,
        arrangedPicks: arranged,
        state: 'flipping',
        flippedCards: [false, false, false],
        reversedStates,
        errorMessage: undefined,
      };
    });
  }, []);

  const startFlipping = useCallback(() => {
    setFlowState(prev => {
      const reversedStates = prev.arrangedPicks.map(pick => decideReversed(pick.cardId));
      return {
        ...prev,
        state: 'flipping',
        flippedCards: [false, false, false],
        reversedStates,
        errorMessage: undefined,
      };
    });
  }, []);

  const flipCard = useCallback((index: number) => {
    setFlowState(prev => {
      const newFlipped = [...prev.flippedCards];
      newFlipped[index] = true;
      return {
        ...prev,
        flippedCards: newFlipped,
      };
    });
  }, []);

  const setFinalResult = useCallback((result: string) => {
    setFlowState(prev => ({
      ...prev,
      state: 'result',
      finalResult: result,
      errorMessage: undefined,
    }));
  }, []);
  const setErrorMessage = useCallback((message?: string) => {
    setFlowState(prev => ({
      ...prev,
      errorMessage: message,
    }));
  }, []);

  const reset = useCallback(() => {
    setFlowState({
      state: 'input',
      inputText: '',
      questionNormalized: '',
      shuffledDeck: [],
      pickedCardIds: [],
      arrangedPicks: [],
      flippedCards: [],
      reversedStates: [],
      finalResult: undefined,
      errorMessage: undefined,
    });
  }, []);

  const getCardPicks = useCallback((): CardPick[] => {
    return flowState.arrangedPicks.map((pick, index) => {
      const card = CARDS.find(c => c.id === pick.cardId)!;
      const isReversed = flowState.reversedStates[index] || false;
      return {
        role: pick.role,
        cardId: pick.cardId,
        isReversed,
        keywordsJP: getCardKeywords(pick.cardId, isReversed),
        cardNameJP: card.nameJP,
      };
    });
  }, [flowState.arrangedPicks, flowState.reversedStates]);

  const startGenerating = useCallback(async (usageType: UsageType) => {
    setFlowState(prev => ({
      ...prev,
      state: 'generating',
      errorMessage: undefined,
    }));

    const picks = getCardPicks();
    const normalized =
      flowState.questionNormalized || normalizeQuestion(flowState.inputText);

    try {
      const result = await generateReading(normalized, picks);
      const historyEntry: PickedCard[] = picks.map(pick => ({
        role: pick.role,
        cardId: pick.cardId,
        isReversed: pick.isReversed,
      }));

      try {
        const db = await getDatabase();
        await saveReadingResult(db, {
          createdAt: new Date().toISOString(),
          inputText: flowState.inputText,
          questionNormalized: normalized,
          picks: historyEntry,
          finalText: result,
        });
        if (usageType === 'free') {
          await incrementFreeUsage(db);
        } else {
          await incrementRewardUsage(db);
        }
      } catch (dbError) {
        console.error('Failed to save reading history', dbError);
      }

      setFinalResult(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error ?? '不明なエラー');
      console.error('Reading generation failed', error);
      setFlowState(prev => ({
        ...prev,
        state: 'flipping',
        errorMessage: message,
      }));
    }
  }, [flowState.inputText, flowState.questionNormalized, getCardPicks, setFinalResult]);

  return {
    flowState,
    startReading,
    pickCard,
    toggleSelect,
    confirmSelection,
    startFlipping,
    flipCard,
    startGenerating,
    setFinalResult,
    setErrorMessage,
    reset,
    getCardPicks,
  };
}
