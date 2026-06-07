import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  getDatabase,
  getRemainingFreeCount,
  getRemainingRewardCount,
} from '../db';

export interface UseDailyUsageResult {
  remainingFree: number;
  remainingReward: number;
  refresh: () => Promise<void>;
}

export function useDailyUsage(): UseDailyUsageResult {
  const [remainingFree, setRemainingFree] = useState<number>(0);
  const [remainingReward, setRemainingReward] = useState<number>(0);

  const refresh = useCallback(async () => {
    try {
      const db = await getDatabase();
      const [freeCount, rewardCount] = await Promise.all([
        getRemainingFreeCount(db),
        getRemainingRewardCount(db),
      ]);
      setRemainingFree(freeCount);
      setRemainingReward(rewardCount);
    } catch (error) {
      console.error('Failed to load usage counts', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return { remainingFree, remainingReward, refresh };
}
