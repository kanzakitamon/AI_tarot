import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AppHeader from '../src/components/AppHeader';
import OccultBackground from '../src/components/OccultBackground';
import MysticButton from '../src/components/MysticButton';
import { colors, typography, spacing } from '../src/theme/tokens';

export default function Index() {
  const router = useRouter();

  return (
    <OccultBackground>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <AppHeader title="カード鑑定" showBack={false} showSettings={true} />
        <View style={styles.content}>
          <Text style={styles.title}>今の心境をカードに委ねましょう</Text>
          <Text style={styles.description}>
            いま気になっていることをそのまま文字にしてください。カードがあなたの感情を映し出します。
          </Text>

          <View style={styles.buttonContainer}>
            <MysticButton
              title="鑑定をはじめる"
              onPress={() => router.push('/read')}
              variant="primary"
              size="large"
            />
            <View style={styles.buttonSpacer} />
            <MysticButton
              title="今日の1枚を見る"
              onPress={() => router.push('/daily')}
              variant="secondary"
              size="large"
            />
            <View style={styles.buttonSpacer} />
            <MysticButton
              title="鑑定履歴を確認"
              onPress={() => router.push('/history')}
              variant="secondary"
              size="large"
            />
          </View>
        </View>
      </SafeAreaView>
    </OccultBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.xl,
  },
  title: {
    ...typography.titleLarge,
    color: colors.textPrimaryDark,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textSecondaryDark,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  buttonSpacer: {
    height: spacing.md,
  },
});
