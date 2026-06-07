import { useEffect, useRef } from 'react';
import { Slot, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import AdBanner from '../src/components/AdBanner';
import { colors } from '../src/theme/tokens';
import { syncDailyReminder } from '../src/services/notifications';

export default function RootLayout() {
  const router = useRouter();
  const handledInitial = useRef(false);

  useEffect(() => {
    // 設定がONなら通知の予約を起動時に張り直す
    syncDailyReminder().catch(() => {});

    // 通知から起動された場合、「今日の1枚」へ遷移
    Notifications.getLastNotificationResponseAsync()
      .then(response => {
        if (handledInitial.current) {
          return;
        }
        handledInitial.current = true;
        const route = response?.notification.request.content.data?.route;
        if (typeof route === 'string') {
          router.push(route as any);
        }
      })
      .catch(() => {});

    // アプリ起動中に通知をタップした場合
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const route = response.notification.request.content.data?.route;
      if (typeof route === 'string') {
        router.push(route as any);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [router]);

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <Slot />
      </View>
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  content: {
    flex: 1,
  },
});

