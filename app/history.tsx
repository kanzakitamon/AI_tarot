import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { getDatabase, getReadingResults } from '../src/db';
import { ReadingResult } from '../packages/core/types';
import { CARDS } from '../packages/core/deck';
import AppHeader from '../src/components/AppHeader';
import OccultBackground from '../src/components/OccultBackground';
import MysticButton from '../src/components/MysticButton';
import { colors, typography, spacing, radius } from '../src/theme/tokens';

const roleLabels: Record<string, string> = {
  situation: '状況',
  obstacle: '障害',
  advice: '助言',
};

export default function HistoryScreen() {
  const router = useRouter();
  const [results, setResults] = useState<ReadingResult[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const db = await getDatabase();
      const history = await getReadingResults(db);
      setResults(history);
    } catch (error) {
      console.error('Load history error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  if (loading) {
    return (
      <OccultBackground>
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <AppHeader title="鑑定履歴" showBack={true} showSettings={true} />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </SafeAreaView>
      </OccultBackground>
    );
  }

  const hasResults = results.length > 0;

  return (
    <OccultBackground>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <AppHeader title="鑑定履歴" showBack={true} showSettings={true} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.actionRow}>
              <MysticButton
                title="新しい鑑定をはじめる"
                onPress={() => router.push('/read')}
                variant="primary"
                size="large"
              />
              <View style={styles.buttonSpacer} />
              <MysticButton
                title="トップへ戻る"
                onPress={() => router.push('/')}
                variant="secondary"
                size="large"
              />
            </View>

            {!hasResults ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>まだ鑑定の記録はありません</Text>
                <Text style={styles.emptyDescription}>
                  カードをめくって、あなたのいまを残してみましょう。
                </Text>
                <MysticButton
                  title="鑑定をはじめる"
                  onPress={() => router.push('/read')}
                  variant="primary"
                  size="large"
                />
              </View>
            ) : (
              <View style={styles.list}>
                {results.map(result => {
                  const date = new Date(result.createdAt);
                  const dateStr = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${String(
                    date.getHours(),
                  ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                  const previewText = result.finalText
                    .split(/\r?\n/)
                    .map(line => line.trim())
                    .filter(Boolean)
                    .slice(0, 3)
                    .join(' ');

                  return (
                    <TouchableOpacity
                      key={result.id}
                      style={styles.itemTouchable}
                      onPress={() =>
                        router.push({
                          pathname: '/history-detail',
                          params: { id: result.id.toString() },
                        })
                      }
                    >
                      <View style={styles.itemCard}>
                        <Text style={styles.itemDate}>{dateStr}</Text>
                        <Text style={styles.itemQuestion} numberOfLines={2}>
                          {result.inputText}
                        </Text>
                        <Text style={styles.itemPreview} numberOfLines={2}>
                          {previewText}
                        </Text>
                        <View style={styles.cardRow}>
                          {result.picks.map((pick, index) => {
                            const card = CARDS[pick.cardId];
                            return (
                              <View key={index} style={styles.cardSlot}>
                                {card.image ? (
                                  <Image
                                    source={card.image}
                                    style={[
                                      styles.cardImage,
                                      pick.isReversed && styles.cardReversed,
                                    ]}
                                    contentFit="cover"
                                  />
                                ) : (
                                  <View style={styles.cardPlaceholder}>
                                    <Text style={styles.cardPlaceholderText}>?</Text>
                                  </View>
                                )}
                                <Text style={styles.cardRole}>{roleLabels[pick.role]}</Text>
                                <Text style={styles.cardName}>{card.nameJP}</Text>
                                {pick.isReversed && (
                                  <Text style={styles.cardReversedLabel}>逆位置</Text>
                                )}
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
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
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'column',
    gap: spacing.md,
  },
  buttonSpacer: {
    height: spacing.md,
  },
  emptyState: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.bgCardDark,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.titleSmall,
    color: colors.textPrimaryDark,
  },
  emptyDescription: {
    ...typography.body,
    color: colors.textSecondaryDark,
    textAlign: 'center',
    lineHeight: 22,
  },
  list: {
    gap: spacing.md,
  },
  itemTouchable: {
    marginBottom: spacing.md,
  },
  itemCard: {
    backgroundColor: colors.bgCardDark,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  itemDate: {
    ...typography.bodySmall,
    color: colors.textSecondaryDark,
  },
  itemQuestion: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimaryDark,
  },
  itemPreview: {
    ...typography.bodySmall,
    color: colors.textSecondaryDark,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  cardSlot: {
    width: 90,
    alignItems: 'center',
    gap: spacing.xs,
  },
  cardImage: {
    width: 90,
    height: 140,
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  cardReversed: {
    transform: [{ scaleY: -1 }],
  },
  cardPlaceholder: {
    width: 90,
    height: 140,
    borderRadius: radius.card,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardPlaceholderText: {
    ...typography.titleLarge,
    color: '#fff',
  },
  cardRole: {
    ...typography.bodySmall,
    color: colors.textSecondaryDark,
  },
  cardName: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimaryDark,
    textAlign: 'center',
  },
  cardReversedLabel: {
    ...typography.bodySmall,
    color: colors.error,
    fontWeight: '600',
  },
});
