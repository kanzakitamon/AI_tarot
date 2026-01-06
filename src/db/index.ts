import * as SQLite from 'expo-sqlite';
import { initDatabase } from './schema';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('tarot.db');
    await initDatabase(dbInstance);
  }
  return dbInstance;
}

export * from './readingResult';
export * from './dailyUsage';
export * from './schema';
