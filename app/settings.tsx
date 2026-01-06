import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../src/components/AppHeader';
import OccultBackground from '../src/components/OccultBackground';
import { colors, typography, spacing } from '../src/theme/tokens';

export default function SettingsScreen() {
  return (
    <OccultBackground>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <AppHeader title="設定" showBack={true} showSettings={false} />
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
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
});
