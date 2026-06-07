import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { playSoundEffect } from '../services/soundEffect';

export const FLIP_PHASE_DURATION = 650;

export interface UseCardFlipAnimationOptions {
  resetTrigger: unknown;
  onFlipComplete: (index: number) => void;
}

export interface UseCardFlipAnimationResult {
  flipAnimations: Animated.Value[];
  showFrontStates: boolean[];
  isFlippingSequence: boolean;
  setIsFlippingSequence: React.Dispatch<React.SetStateAction<boolean>>;
  flipAllSequentially: (flippedState: boolean[]) => Promise<void>;
}

export function useCardFlipAnimation(
  options: UseCardFlipAnimationOptions,
): UseCardFlipAnimationResult {
  const { resetTrigger, onFlipComplete } = options;
  const flipAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const [showFrontStates, setShowFrontStates] = useState([false, false, false]);
  const [isFlippingSequence, setIsFlippingSequence] = useState(false);
  const onFlipCompleteRef = useRef(onFlipComplete);
  onFlipCompleteRef.current = onFlipComplete;

  useEffect(() => {
    flipAnimations.forEach(anim => anim.setValue(0));
    setShowFrontStates([false, false, false]);
    setIsFlippingSequence(false);
  }, [resetTrigger, flipAnimations]);

  const flipOne = useCallback(
    (index: number, alreadyFlipped: boolean, onComplete?: () => void) => {
      if (alreadyFlipped) {
        onComplete?.();
        return;
      }
      const anim = flipAnimations[index];
      const firstHalf = Animated.timing(anim, {
        toValue: 0.5,
        duration: FLIP_PHASE_DURATION,
        useNativeDriver: true,
      });
      const secondHalf = Animated.timing(anim, {
        toValue: 1,
        duration: FLIP_PHASE_DURATION,
        useNativeDriver: true,
      });
      playSoundEffect('cardFlip').catch(() => {});
      firstHalf.start(() => {
        setShowFrontStates(prev => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
        secondHalf.start(() => {
          onFlipCompleteRef.current(index);
          onComplete?.();
        });
      });
    },
    [flipAnimations],
  );

  const flipAllSequentially = useCallback(
    (flippedState: boolean[]): Promise<void> => {
      return new Promise<void>(resolve => {
        const step = (i: number) => {
          if (i >= 3) {
            resolve();
            return;
          }
          flipOne(i, flippedState[i], () => step(i + 1));
        };
        step(0);
      });
    },
    [flipOne],
  );

  return {
    flipAnimations,
    showFrontStates,
    isFlippingSequence,
    setIsFlippingSequence,
    flipAllSequentially,
  };
}
