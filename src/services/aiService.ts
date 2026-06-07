import { buildPrompt } from '../../packages/core/deck';
import type { CardPick } from '../../packages/core/types';

const SERVER_ENDPOINT = process.env.EXPO_PUBLIC_SERVER_ENDPOINT ?? '';
const APP_TOKEN = process.env.EXPO_PUBLIC_APP_TOKEN ?? '';

interface GenerateReadingRequest {
  questionNormalized: string;
  picks: CardPick[];
  prompt: string;
}

interface GenerateReadingResponse {
  success: boolean;
  result?: string;
  error?: string;
}

export async function generateReading(
  questionNormalized: string,
  picks: CardPick[],
): Promise<string> {
  if (!SERVER_ENDPOINT) {
    throw new Error(
      'サーバーが設定されていません。\n' +
        'EXPO_PUBLIC_SERVER_ENDPOINT 環境変数を設定してください。\n' +
        '（開発時は .env に EXPO_PUBLIC_SERVER_ENDPOINT=http://<LAN-IP>:3000/api/generate-reading を記述）',
    );
  }

  const prompt = buildPrompt(questionNormalized, picks);
  const healthEndpoint = SERVER_ENDPOINT.replace(
    '/api/generate-reading',
    '/api/health',
  );

  try {
    const healthController = new AbortController();
    const healthTimeout = setTimeout(() => healthController.abort(), 10000);
    const healthCheck = await fetch(healthEndpoint, {
      method: 'GET',
      signal: healthController.signal,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    clearTimeout(healthTimeout);

    if (!healthCheck.ok) {
      throw new Error(`サーバーが応答しません（${healthCheck.status}）`);
    }
  } catch (healthError: any) {
    const message = healthError?.message || String(healthError);
    const isTimeout =
      healthError?.name === 'AbortError' || message.includes('timeout');
    if (isTimeout) {
      throw new Error(
        'サーバーへの接続がタイムアウトしました。\n' +
          '確認事項:\n' +
          '1. サーバーが起動しているか\n' +
          '2. PCとスマホが同じWi-Fiに接続されているか\n' +
          '3. Windowsファイアウォールが3000番を許可しているか\n' +
          '\nサーバー起動: cd server && npm start',
      );
    }
    throw new Error(
      `サーバーに接続できません: ${message}\n\nサーバーが起動しているか確認してください。`,
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(SERVER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        ...(APP_TOKEN ? { 'x-app-token': APP_TOKEN } : {}),
      },
      body: JSON.stringify({
        questionNormalized,
        picks,
        prompt,
      } as GenerateReadingRequest),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data: GenerateReadingResponse = await response.json();

    if (!data.success || !data.result) {
      throw new Error(data.error || 'Unknown error');
    }

    return formatReadingResult(data.result);
  } catch (error: any) {
    const message = error?.message || String(error);
    const isTimeout = error?.name === 'AbortError' || message.includes('timeout');
    if (isTimeout) {
      throw new Error(
        'サーバーへの接続がタイムアウトしました。\n' +
          '確認事項:\n' +
          '1. サーバーが起動しているか\n' +
          '2. PCとスマホが同じWi-Fiに接続されているか\n' +
          '3. Windowsファイアウォールが3000番を許可しているか\n' +
          '\nサーバー起動: cd server && npm start',
      );
    }

    if (
      message.includes('offline') ||
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('Failed to fetch')
    ) {
      throw new Error(
        'サーバーに接続できません。\n' +
          '確認事項:\n' +
          '1. サーバーが起動しているか\n' +
          '2. PCとスマホが同じWi-Fiに接続されているか\n' +
          '3. Windowsファイアウォールが3000番を許可しているか\n' +
          '\nサーバー起動: cd server && npm start',
      );
    }

    throw new Error(`エラー: ${message}`);
  }
}

function formatReadingResult(result: string): string {
  return result.trim();
}

export function checkDangerousInput(inputText: string): boolean {
  const dangerousPatterns = [
    /自殺|死にたい|消えたい|生きる意味/i,
    /殺|死ね|死な/i,
  ];

  return dangerousPatterns.some(pattern => pattern.test(inputText));
}

export function getDangerousInputMessage(): string {
  return `お気持ちを理解しますが、このアプリでは十分なサポートを提供できません。もし深刻な悩みを抱えている場合、以下の相談窓口をご利用ください。
- いのちの電話: 0120-783-556
- よりそいホットライン: 0120-279-338
- 警察: 110
- 救急: 119

あなたの存在は大切です。どうか一人で抱え込まず、専門家に相談してください。`;
}
