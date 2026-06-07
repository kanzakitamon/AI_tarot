import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

import OccultBackground from '../src/components/OccultBackground';
import AppHeader from '../src/components/AppHeader';
import MysticButton from '../src/components/MysticButton';
import { colors, typography, spacing, radius } from '../src/theme/tokens';
import { CARDS, getDailyCardId, getDailyCardReversed } from '../packages/core/deck';
import { getCardMeaningById } from '../packages/core/cardMeaningsMajorArcana';

// カード画像の実寸比率（300x527）
const CARD_ASPECT = 300 / 527;

function formatToday(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export default function DailyScreen() {
  const router = useRouter();

  const { card, isReversed, theme, body, todayLabel } = useMemo(() => {
    const today = new Date();
    const id = getDailyCardId(today);
    const reversed = getDailyCardReversed(today);
    const def = getCardMeaningById(id);
    const orientation = reversed ? def.reversed : def.upright;
    const adviceBranch =
      orientation.branches.find(b => b.role === 'advice') ?? orientation.branches[0];
    return {
      card: CARDS[id],
      isReversed: reversed,
      theme: orientation.core,
      body: adviceBranch?.lead ?? '',
      todayLabel: formatToday(today),
    };
  }, []);

  return (
    <OccultBackground>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <AppHeader title="今日の1枚" showBack={true} showSettings={true} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.dateLabel}>{todayLabel}</Text>
          <Text style={styles.lead}>今日のあなたへのメッセージ</Text>

          <View style={styles.cardFrame}>
            <Image
              source={card.image}
              style={[styles.cardImage, isReversed && styles.reversedImage]}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          </View>

          <Text style={styles.cardName}>{card.nameJP}</Text>
          <Text
            style={[
              styles.orientation,
              { color: isReversed ? colors.error : colors.textSecondaryDark },
            ]}
          >
            {isReversed ? '逆位置' : '正位置'}
          </Text>

          <View style={styles.messageBox}>
            <Text style={styles.themeText}>{theme}</Text>
            <Text style={styles.messageText}>{body}</Text>
          </View>

          <View style={styles.actions}>
            <MysticButton
              title="3枚で詳しく鑑定する"
              onPress={() => router.push('/read')}
              variant="primary"
              size="large"
            />
            <View style={styles.spacer} />
            <MysticButton
              title="ホームに戻る"
              onPress={() => router.push('/')}
              variant="secondary"
              size="large"
            />
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
  content: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  dateLabel: {
    ...typography.bodySmall,
    color: colors.textSecondaryDark,
  },
  lead: {
    ...typography.titleSmall,
    color: colors.textPrimaryDark,
    marginBottom: spacing.md,
  },
  cardFrame: {
    width: '58%',
    aspectRatio: CARD_ASPECT,
    borderRadius: radius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
    marginBottom: spacing.md,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  reversedImage: {
    transform: [{ rotate: '180deg' }],
  },
  cardName: {
    ...typography.titleSmall,
    color: colors.textPrimaryDark,
  },
  orientation: {
    ...typography.body,
    marginBottom: spacing.sm,
  },
  messageBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderWhite,
    padding: spacing.lg,
    width: '100%',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  themeText: {
    ...typography.titleSmall,
    fontSize: 18,
    lineHeight: 26,
    color: colors.textPrimaryDark,
    textAlign: 'center',
  },
  messageText: {
    ...typography.body,
    color: colors.textSecondaryDark,
    lineHeight: 24,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    maxWidth: 360,
  },
  spacer: {
    height: spacing.md,
  },
});
