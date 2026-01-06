import { SQLiteDatabase } from 'expo-sqlite';
import { ReadingResult, PickedCard } from '../../packages/core/types';

export async function saveReadingResult(
  db: SQLiteDatabase,
  result: Omit<ReadingResult, 'id'>
): Promise<number> {
  const result_ = await db.runAsync(
    `INSERT INTO ReadingResult (createdAt, inputText, questionNormalized, picks, finalText)
     VALUES (?, ?, ?, ?, ?)`,
    [
      result.createdAt || new Date().toISOString(),
      result.inputText,
      result.questionNormalized,
      JSON.stringify(result.picks),
      result.finalText,
    ]
  );
  return result_.lastInsertRowId;
}

export async function getReadingResults(
  db: SQLiteDatabase,
  limit: number = 50
): Promise<ReadingResult[]> {
  const results = await db.getAllAsync<{
    id: number;
    createdAt: string;
    inputText: string;
    questionNormalized: string;
    picks: string;
    finalText: string;
  }>(
    `SELECT * FROM ReadingResult ORDER BY createdAt DESC LIMIT ?`,
    [limit]
  );

  return results.map(r => ({
    id: r.id,
    createdAt: r.createdAt,
    inputText: r.inputText,
    questionNormalized: r.questionNormalized,
    picks: JSON.parse(r.picks) as PickedCard[],
    finalText: r.finalText,
  }));
}

export async function getReadingResultById(
  db: SQLiteDatabase,
  id: number
): Promise<ReadingResult | null> {
  const result = await db.getFirstAsync<{
    id: number;
    createdAt: string;
    inputText: string;
    questionNormalized: string;
    picks: string;
    finalText: string;
  }>(
    `SELECT * FROM ReadingResult WHERE id = ?`,
    [id]
  );

  if (!result) return null;

  return {
    id: result.id,
    createdAt: result.createdAt,
    inputText: result.inputText,
    questionNormalized: result.questionNormalized,
    picks: JSON.parse(result.picks) as PickedCard[],
    finalText: result.finalText,
  };
}
