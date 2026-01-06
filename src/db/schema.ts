import { SQLiteDatabase } from 'expo-sqlite';

export async function initDatabase(db: SQLiteDatabase): Promise<void> {
  // 履歴テーブル
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ReadingResult (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      createdAt TEXT NOT NULL,
      inputText TEXT NOT NULL,
      questionNormalized TEXT NOT NULL,
      picks TEXT NOT NULL,
      finalText TEXT NOT NULL
    );
  `);

  // 日次回数テーブル
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS DailyUsage (
      dateKey TEXT PRIMARY KEY,
      freeUsedCount INTEGER NOT NULL DEFAULT 0,
      rewardUsedCount INTEGER NOT NULL DEFAULT 0
    );
  `);

  // インデックス作成
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_ReadingResult_createdAt ON ReadingResult(createdAt DESC);
  `);
}
