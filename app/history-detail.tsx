import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { getDatabase, getReadingResultById } from '../src/db';
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

export default function HistoryDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const resultId = params.id ? parseInt(params.id as string, 10) : null;

  const [result, setResult] = useState<ReadingResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resultId) {
      loadResult();
    } else {
      setLoading(false);
    }
  }, [resultId]);

  const loadResult = async () => {
    if (!resultId) return;
    setLoading(true);
    try {
      const db = await getDatabase();
      const entry = await getReadingResultById(db, resultId);
      setResult(entry);
    } catch (error) {
      console.error('Load result error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <OccultBackground>
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <AppHeader title="鑑定詳細" showBack={true} showSettings={true} />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </SafeAreaView>
      </OccultBackground>
    );
  }

  if (!result) {
    return (
      <OccultBackground>
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <AppHeader title="鑑定詳細" showBack={true} showSettings={true} />
          <View style={styles.content}>
            <Text style={styles.errorText}>鑑定結果が見つかりませんでした。</Text>
            <MysticButton
              title="履歴に戻る"
              variant="primary"
              size="large"
              onPress={() => router.back()}
            />
          </View>
        </SafeAreaView>
      </OccultBackground>
    );
  }

  const date = new Date(result.createdAt);
  const dateStr = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${String(
    date.getHours(),
  ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

  const paragraphs = result.finalText
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean);
  if (!paragraphs.length) {
    paragraphs.push(result.finalText.trim());
  }

  return (
    <OccultBackground>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <AppHeader title="鑑定詳細" showBack={true} showSettings={true} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.dateText}>{dateStr}</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>相談内容</Text>
              <Text style={styles.sectionText}>{result.inputText}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>選んだカード</Text>
              <View style={styles.cardsRow}>
                {result.picks.map((pick, index) => {
                  const card = CARDS[pick.cardId];
                  return (
                    <View key={index} style={styles.cardItem}>
                      <Text style={styles.cardRole}>{roleLabels[pick.role]}</Text>
                      {card.image ? (
                        <Image
                          source={card.image}
                          style={[styles.cardImage, pick.isReversed && styles.cardReversed]}
                          contentFit="cover"
                        />
                      ) : (
                        <View style={styles.cardPlaceholder}>
                          <Text style={styles.cardPlaceholderText}>?</Text>
                        </View>
                      )}
                      <Text style={styles.cardName}>{card.nameJP}</Text>
                      <Text
                        style={[
                          styles.cardOrientation,
                          { color: pick.isReversed ? colors.error : colors.textSecondaryDark },
                        ]}
                      >
                        {pick.isReversed ? '逆位置' : '正位置'}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>鑑定結果</Text>
              {paragraphs.map((line, index) => (
                <Text key={`${line}-${index}`} style={styles.sectionText}>
                  {line}
                </Text>
              ))}
            </View>

            <MysticButton
              title="履歴に戻る"
              onPress={() => router.back()}
              variant="primary"
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
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondaryDark,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  dateText: {
    ...typography.bodySmall,
    color: colors.textSecondaryDark,
    textAlign: 'center',
  },
  section: {
    backgroundColor: colors.bgCardDark,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.body,
    color: colors.textPrimaryDark,
    fontWeight: '600',
  },
  sectionText: {
    ...typography.body,
    color: colors.textSecondaryDark,
    lineHeight: 24,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  cardItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  cardRole: {
    ...typography.bodySmall,
    color: colors.textSecondaryDark,
  },
  cardImage: {
    width: 100,
    height: 150,
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  cardReversed: {
    transform: [{ scaleY: -1 }],
  },
  cardPlaceholder: {
    width: 100,
    height: 150,
    borderRadius: radius.card,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardPlaceholderText: {
    ...typography.titleLarge,
    color: '#fff',
  },
  cardName: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimaryDark,
    textAlign: 'center',
  },
  cardOrientation: {
    ...typography.bodySmall,
    fontWeight: '500',
  },
});
