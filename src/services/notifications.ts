import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const STORAGE_KEY = 'daily_reminder_enabled';
const DAILY_IDENTIFIER = 'daily-card-reminder';
const DEFAULT_HOUR = 8;
const DEFAULT_MINUTE = 0;

// 通知をタップした時に「今日の1枚」画面へ誘導するためのデータ
export const DAILY_NOTIFICATION_ROUTE = '/daily';

// フォアグラウンドでも通知バナーを表示する
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const isExpoGo = Constants.appOwnership === 'expo';

export async function isDailyReminderEnabled(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

async function ensurePermission(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }
  const request = await Notifications.requestPermissionsAsync();
  return request.granted;
}

async function setupAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  await Notifications.setNotificationChannelAsync('daily-card', {
    name: '今日の1枚',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

/**
 * 毎朝の「今日の1枚」通知を有効化する。
 * 権限が拒否された場合は false を返す。
 */
export async function enableDailyReminder(
  hour: number = DEFAULT_HOUR,
  minute: number = DEFAULT_MINUTE,
): Promise<boolean> {
  if (isExpoGo) {
    // Expo Go では予約通知が制限されるため、設定のみ保存
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
    return true;
  }

  const granted = await ensurePermission();
  if (!granted) {
    return false;
  }

  await setupAndroidChannel();
  await Notifications.cancelScheduledNotificationAsync(DAILY_IDENTIFIER).catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_IDENTIFIER,
    content: {
      title: '今日の1枚が届いています',
      body: 'タップして、今日のあなたへのメッセージを受け取りましょう。',
      data: { route: DAILY_NOTIFICATION_ROUTE },
      ...(Platform.OS === 'android' ? { channelId: 'daily-card' } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  await AsyncStorage.setItem(STORAGE_KEY, 'true');
  return true;
}

export async function disableDailyReminder(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, 'false');
  if (isExpoGo) {
    return;
  }
  await Notifications.cancelScheduledNotificationAsync(DAILY_IDENTIFIER).catch(() => {});
}

/**
 * アプリ起動時に呼ぶ。設定がONなら通知の予約を確実に張り直す。
 */
export async function syncDailyReminder(): Promise<void> {
  if (isExpoGo) {
    return;
  }
  const enabled = await isDailyReminderEnabled();
  if (!enabled) {
    return;
  }
  const scheduled = await Notifications.getAllScheduledNotificationsAsync().catch(() => []);
  const exists = scheduled.some(item => item.identifier === DAILY_IDENTIFIER);
  if (!exists) {
    await enableDailyReminder();
  }
}
