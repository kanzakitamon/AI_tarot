import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import { CARDS } from '../../packages/core/deck';
import type { CardPick } from '../../packages/core/types';
import { colors, typography, spacing, radius } from '../theme/tokens';

const roleNames: Record<string, string> = {
  situation: '状況',
  obstacle: '障害',
  advice: '助言',
};

// SNS 向けの縦長カード（固定幅でキャプチャ）
export const SHARE_CARD_WIDTH = 360;

interface ShareableReadingCardProps {
  picks: CardPick[];
  conclusion: string;
}

/**
 * 共有用にキャプチャする縦長のビジュアルカード。
 * 画面外（off-screen）にレンダリングして react-native-view-shot で撮影する。
 */
const ShareableReadingCard = forwardRef<View, ShareableReadingCardProps>(
  ({ picks, conclusion }, ref) => {
    return (
      <View ref={ref} collapsable={false} style={styles.root}>
        <LinearGradient
          colors={[colors.bgBase, '#1A1628', '#2D1F3D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.brand}>タロット占い</Text>
          <View style={styles.divider} />

          <View style={styles.cardsRow}>
            {picks.map((pick, idx) => {
              const card = CARDS[pick.cardId];
              return (
                <View key={idx} style={styles.cardCol}>
                  <Text style={styles.role}>{roleNames[pick.role] ?? ''}</Text>
                  <View style={styles.cardFrame}>
                    <Image
                      source={card.image}
                      style={[styles.cardImage, pick.isReversed && styles.reversedImage]}
                      contentFit="cover"
                      cachePolicy="memory-disk"
                    />
                  </View>
                  <Text style={styles.cardName} numberOfLines={1}>
                    {card.nameJP}
                  </Text>
                  <Text
                    style={[
                      styles.orientation,
                      { color: pick.isReversed ? colors.error : colors.gold },
                    ]}
                  >
                    {pick.isReversed ? '逆位置' : '正位置'}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.conclusionBox}>
            <Text style={styles.conclusionTitle}>結論</Text>
            <Text style={styles.conclusionText}>{conclusion}</Text>
          </View>

          <Text style={styles.footer}>AIタロット占いアプリ</Text>
        </LinearGradient>
      </View>
    );
  },
);

ShareableReadingCard.displayName = 'ShareableReadingCard';

export default ShareableReadingCard;

const styles = StyleSheet.create({
  root: {
    width: SHARE_CARD_WIDTH,
  },
  gradient: {
    width: SHARE_CARD_WIDTH,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  brand: {
    ...typography.titleSmall,
    color: colors.gold,
    letterSpacing: 2,
  },
  divider: {
    width: 48,
    height: 2,
    backgroundColor: colors.gold,
    opacity: 0.6,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    width: '100%',
    marginBottom: spacing.lg,
  },
  cardCol: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  role: {
    ...typography.bodySmall,
    color: colors.textPrimaryDark,
    fontWeight: '600',
  },
  cardFrame: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: radius.small,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  reversedImage: {
    transform: [{ rotate: '180deg' }],
  },
  cardName: {
    ...typography.bodySmall,
    color: colors.textPrimaryDark,
    fontWeight: '600',
    textAlign: 'center',
  },
  orientation: {
    fontSize: 12,
    lineHeight: 16,
  },
  conclusionBox: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  conclusionTitle: {
    ...typography.body,
    color: colors.gold,
    fontWeight: '600',
  },
  conclusionText: {
    ...typography.body,
    color: colors.textPrimaryDark,
    lineHeight: 24,
  },
  footer: {
    ...typography.bodySmall,
    color: colors.textSecondaryDark,
    marginTop: spacing.lg,
  },
});
