import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../src/components/AppHeader';
import OccultBackground from '../src/components/OccultBackground';
import { colors, typography, spacing } from '../src/theme/tokens';
import {
  enableDailyReminder,
  disableDailyReminder,
  isDailyReminderEnabled,
} from '../src/services/notifications';

export default function SettingsScreen() {
  const [reminderOn, setReminderOn] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    isDailyReminderEnabled().then(setReminderOn);
  }, []);

  const handleToggle = async (next: boolean) => {
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      if (next) {
        const granted = await enableDailyReminder();
        if (!granted) {
          Alert.alert(
            '通知が許可されていません',
            '端末の設定からこのアプリの通知を許可してください。',
          );
          setReminderOn(false);
          return;
        }
        setReminderOn(true);
      } else {
        await disableDailyReminder();
        setReminderOn(false);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <OccultBackground>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <AppHeader title="設定" showBack={true} showSettings={false} />
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>通知</Text>
            <View style={styles.row}>
              <View style={styles.rowTextBlock}>
                <Text style={styles.rowLabel}>今日の1枚を毎朝お届け</Text>
                <Text style={styles.rowSub}>毎朝8:00に通知でお知らせします</Text>
              </View>
              <Switch
                value={reminderOn}
                onValueChange={handleToggle}
                disabled={busy}
                trackColor={{ false: colors.disabled, true: colors.primary }}
                thumbColor={colors.textOnPrimary}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>アプリについて</Text>
            <Text style={styles.text}>
              タロット鑑定アプリへようこそ。
            </Text>
            <Text style={styles.text}>
              このアプリは、AIを活用したタロット占いを提供します。
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>使い方</Text>
            <Text style={styles.text}>
              1. トップページから「鑑定をはじめる」をタップします。
            </Text>
            <Text style={styles.text}>
              2. 気になることを入力します。
            </Text>
            <Text style={styles.text}>
              3. カードを3枚選びます。
            </Text>
            <Text style={styles.text}>
              4. 鑑定結果を確認します。
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </OccultBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.bgCardDark,
    borderRadius: 12,
    opacity: 0.9,
  },
  sectionTitle: {
    ...typography.titleSmall,
    color: colors.textPrimaryDark,
    marginBottom: spacing.md,
  },
  text: {
    ...typography.bodySmall,
    color: colors.textSecondaryDark,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rowTextBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  rowLabel: {
    ...typography.body,
    color: colors.textPrimaryDark,
  },
  rowSub: {
    ...typography.bodySmall,
    color: colors.textSecondaryDark,
  },
});
