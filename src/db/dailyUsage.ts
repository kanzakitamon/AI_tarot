import { SQLiteDatabase } from 'expo-sqlite';
import { DailyUsage } from '../../packages/core/types';

const FREE_LIMIT = 3;
const REWARD_LIMIT = 10; // 1日の上限（無料3回 + リワード7回）

export function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export async function getDailyUsage(
  db: SQLiteDatabase,
  dateKey: string = getTodayKey()
): Promise<DailyUsage> {
  const result = await db.getFirstAsync<DailyUsage>(
    `SELECT * FROM DailyUsage WHERE dateKey = ?`,
    [dateKey]
  );

  if (!result) {
    return {
      dateKey,
      freeUsedCount: 0,
      rewardUsedCount: 0,
    };
  }

  return result;
}

export async function incrementFreeUsage(db: SQLiteDatabase, dateKey: string = getTodayKey()): Promise<void> {
  const current = await getDailyUsage(db, dateKey);
  await db.runAsync(
    `INSERT OR REPLACE INTO DailyUsage (dateKey, freeUsedCount, rewardUsedCount)
     VALUES (?, ?, ?)`,
    [dateKey, current.freeUsedCount + 1, current.rewardUsedCount]
  );
}

export async function incrementRewardUsage(db: SQLiteDatabase, dateKey: string = getTodayKey()): Promise<void> {
  const current = await getDailyUsage(db, dateKey);
  await db.runAsync(
    `INSERT OR REPLACE INTO DailyUsage (dateKey, freeUsedCount, rewardUsedCount)
     VALUES (?, ?, ?)`,
    [dateKey, current.freeUsedCount, current.rewardUsedCount + 1]
  );
}

export async function canUseFree(db: SQLiteDatabase, dateKey: string = getTodayKey()): Promise<boolean> {
  // 開発時は無制限
  if (__DEV__) {
    return true;
  }
  const usage = await getDailyUsage(db, dateKey);
  return usage.freeUsedCount < FREE_LIMIT;
}

export async function canUseReward(db: SQLiteDatabase, dateKey: string = getTodayKey()): Promise<boolean> {
  // 開発時は無制限
  if (__DEV__) {
    return true;
  }
  const usage = await getDailyUsage(db, dateKey);
  const total = usage.freeUsedCount + usage.rewardUsedCount;
  return total < REWARD_LIMIT;
}

export async function getRemainingFreeCount(db: SQLiteDatabase, dateKey: string = getTodayKey()): Promise<number> {
  // 開発時は無制限（999を返す）
  if (__DEV__) {
    return 999;
  }
  const usage = await getDailyUsage(db, dateKey);
  return Math.max(0, FREE_LIMIT - usage.freeUsedCount);
}

export async function getRemainingRewardCount(db: SQLiteDatabase, dateKey: string = getTodayKey()): Promise<number> {
  // 開発時は無制限（999を返す）
  if (__DEV__) {
    return 999;
  }
  const usage = await getDailyUsage(db, dateKey);
  const total = usage.freeUsedCount + usage.rewardUsedCount;
  return Math.max(0, REWARD_LIMIT - total);
}

export async function rollbackUsage(
  db: SQLiteDatabase,
  isReward: boolean,
  dateKey: string = getTodayKey()
): Promise<void> {
  const current = await getDailyUsage(db, dateKey);
  if (isReward) {
    await db.runAsync(
      `INSERT OR REPLACE INTO DailyUsage (dateKey, freeUsedCount, rewardUsedCount)
       VALUES (?, ?, ?)`,
      [dateKey, current.freeUsedCount, Math.max(0, current.rewardUsedCount - 1)]
    );
  } else {
    await db.runAsync(
      `INSERT OR REPLACE INTO DailyUsage (dateKey, freeUsedCount, rewardUsedCount)
       VALUES (?, ?, ?)`,
      [dateKey, Math.max(0, current.freeUsedCount - 1), current.rewardUsedCount]
    );
  }
}
