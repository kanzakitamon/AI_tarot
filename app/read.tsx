import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  LayoutChangeEvent,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

import { useReadingFlow } from '../src/hooks/useReadingFlow';
import { CARDS } from '../packages/core/deck';
import { MAJOR_ARCANA_MEANINGS } from '../packages/core/majorArcanaMeanings';
import OccultBackground from '../src/components/OccultBackground';
import AppHeader from '../src/components/AppHeader';
import MysticButton from '../src/components/MysticButton';
import { colors, typography, spacing, radius } from '../src/theme/tokens';
import { playSoundEffect } from '../src/services/soundEffect';
import mobileAds, {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = Math.round(screenWidth * 0.72);
const CARD_HEIGHT = Math.round(CARD_WIDTH * 1.6);
const GAP = 20;
const ITEM_WIDTH = CARD_WIDTH + GAP;
const FLIP_PHASE_DURATION = 650;
const REVIEW_ROW_HORIZONTAL_PADDING = spacing.lg;
const REVIEW_ROW_GAP = spacing.md;
const reviewAvailableWidth = Math.max(
  screenWidth - REVIEW_ROW_HORIZONTAL_PADDING * 2 - REVIEW_ROW_GAP * 2,
  0,
);
const REVIEW_CARD_WIDTH = Math.min(
  CARD_WIDTH,
  Math.max(1, Math.floor(reviewAvailableWidth / 3)),
);
const CARD_INFO_MIN_HEIGHT = 110;

const roleNames: Record<string, string> = {
  situation: '状況',
  obstacle: '障害',
  advice: '助言',
};

const INPUT_GUIDE_LINES = [
  '個人情報は書かないでください',
  '感情（不安・怒り・迷い）を1語入れると読みが深まります',
];

export default function ReadScreen() {
  const router = useRouter();
  const {
    flowState,
    startReading,
    toggleSelect,
    confirmSelection,
    flipCard,
    startGenerating,
    setErrorMessage,
    reset,
    getCardPicks,
  } = useReadingFlow();

  const [inputText, setInputText] = useState('今の仕事を辞めて転職するべきか？');
  const [listWidth, setListWidth] = useState(0);
  const [listContentWidth, setListContentWidth] = useState(0);
  const [didInitialScroll, setDidInitialScroll] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const flatListRef = useRef<FlatList<{ id: number }>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [isFlippingSequence, setIsFlippingSequence] = useState(false);
  const [isRewarding, setIsRewarding] = useState(false);
  const rewardedAdRef = useRef<RewardedAd | null>(null);
  const [isRewardedLoaded, setIsRewardedLoaded] = useState(false);
  const flipAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const [showFrontStates, setShowFrontStates] = useState([false, false, false]);
  const didInitScrollRef = useRef(false);
  const listSidePadding = useMemo(
    () => Math.max(Math.round((listWidth - ITEM_WIDTH) / 2), 0),
    [listWidth],
  );
  const rewardedAdUnitId = useMemo(() => {
    if (Platform.OS === 'ios') {
      return __DEV__ ? TestIds.REWARDED : 'ca-app-pub-4764153276310493/3366326448';
    }
    return TestIds.REWARDED;
  }, []);
  const isListReady = listWidth > 0 && listContentWidth > 0;
  const resultSections = useMemo(() => {
    const raw = flowState.finalResult?.trim();
    if (!raw) {
      return [];
    }
    const normalizedRaw = raw
      .replace(/\r\n/g, '\n')
      .replace(
        /([^\n])\s*(結論|総評|現状|状況|障害|助言)(?=[\s:：（【\[])/g,
        '$1\n$2',
      );
    const stripLeadingParticles = (value: string) => {
      let cleaned = value.trim();
      if (!cleaned) {
        return '';
      }
      cleaned = cleaned.replace(/^[、，]\s*/, '');
      cleaned = cleaned.replace(
        /^(?:としては|として、は|として、|として|となっているのは|となっている|には)/,
        '',
      );
      cleaned = cleaned.replace(/^[、，]\s*/, '');
      return cleaned.trim();
    };
    const lines = normalizedRaw
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);
    const sections: Array<{ title: string; lines: string[] }> = [];
    let current: { title: string; lines: string[] } | null = null;
    lines.forEach(line => {
      const normalized = line.replace(/^[\s　]*[#■◆▶●・\-*]+\s*/g, '');
      const match = normalized.match(/^[【\[]?(結論|総評|現状|状況|障害|助言)[】\]]?/);
      if (match) {
        const rawTitle = match[1];
        const title = rawTitle === '総評' ? '結論' : rawTitle === '現状' ? '状況' : rawTitle;
        const remainderRaw = normalized
          .replace(/^[【\[]?(結論|総評|現状|状況|障害|助言)[】\]]?[\s:：\-]*\s*/, '')
          .replace(/^[\-]+\s*/, '')
          .trim();
        const remainder = stripLeadingParticles(remainderRaw);

        current = { title, lines: [] };
        if (remainder) {
          current.lines.push(remainder);
        }
        sections.push(current);
        return;
      }
      if (!current) {
        current = { title: '結論', lines: [] };
        sections.push(current);
      }
      const cleaned = stripLeadingParticles(normalized.replace(/^[\-–—]\s*/, ''));
      if (cleaned) {
        current.lines.push(cleaned);
      }
    });
    const orderedTitles = ['結論', '状況', '障害', '助言'];
    const ordered = orderedTitles
      .map(title => sections.find(section => section.title === title))
      .filter((section): section is { title: string; lines: string[] } => Boolean(section));
    const extras = sections.filter(section => !orderedTitles.includes(section.title));
    return [...ordered, ...extras];
  }, [flowState.finalResult]);

  const cardData = useMemo(
    () => flowState.shuffledDeck.map(id => ({ id })),
    [flowState.shuffledDeck],
  );
  const centerIndex = useMemo(
    () => Math.max(Math.floor((cardData.length - 1) / 2), 0),
    [cardData.length],
  );
  const snapOffsets = useMemo(
    () => cardData.map((_, index) => index * ITEM_WIDTH),
    [cardData.length],
  );
  const initialOffset = useMemo(() => centerIndex * ITEM_WIDTH, [centerIndex]);
  const selectedSet = useMemo(
    () => new Set(flowState.pickedCardIds),
    [flowState.pickedCardIds.join(',')],
  );
  useEffect(() => {
    if (flowState.state === 'flipping') {
      flipAnimations.forEach(anim => anim.setValue(0));
      setShowFrontStates([false, false, false]);
      setIsFlippingSequence(false);
    }
  }, [flowState.state, flipAnimations]);
  useEffect(() => {
    mobileAds().initialize().catch(() => {});
  }, []);
  useEffect(() => {
    const ad = RewardedAd.createForAdRequest(rewardedAdUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });
    rewardedAdRef.current = ad;
    const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      setIsRewardedLoaded(true);
    });
    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setIsRewardedLoaded(false);
    });
    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, error => {
      setIsRewardedLoaded(false);
      setErrorMessage(`広告の読み込みに失敗しました：${error.message ?? '不明なエラー'}`);
    });
    ad.load();
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, [rewardedAdUnitId, setErrorMessage]);

  useEffect(() => {
    if (flowState.state === 'picking') {
      if (
        flatListRef.current &&
        cardData.length > 0 &&
        isListReady &&
        !didInitScrollRef.current
      ) {
        didInitScrollRef.current = true;
        const offset = initialOffset;
        requestAnimationFrame(() => {
          flatListRef.current?.scrollToOffset({ offset, animated: false });
          scrollX.setValue(offset);
          setDidInitialScroll(true);
        });
      }
    } else {
      didInitScrollRef.current = false;
      if (listContentWidth !== 0) {
        setListContentWidth(0);
      }
      if (didInitialScroll) {
        setDidInitialScroll(false);
      }
    }
  }, [flowState.state, cardData.length, isListReady, scrollX, listContentWidth, didInitialScroll]);

  useEffect(() => {
    if (flowState.state !== 'flipping' && isFlippingSequence) {
      setIsFlippingSequence(false);
    }
  }, [flowState.state, isFlippingSequence]);

  const renderCard = useCallback(
    ({ item, index }: { item: { id: number }; index: number }) => {
      const isSelected = selectedSet.has(item.id);

      const inputRange = [
        (index - 1) * ITEM_WIDTH,
        index * ITEM_WIDTH,
        (index + 1) * ITEM_WIDTH,
      ];
      const shouldAnimate = isListReady && didInitialScroll;
      const isInitialFocus = !shouldAnimate && index === centerIndex;
      const scale = shouldAnimate
        ? scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
          })
        : isInitialFocus
        ? 1
        : 0.9;
      const opacity = shouldAnimate
        ? scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
          })
        : isInitialFocus
        ? 1
        : 0.5;

      return (
        <Animated.View style={[styles.cardShell, { width: ITEM_WIDTH, height: CARD_HEIGHT }]}>
          <Animated.View
            style={[
              styles.cardFrame,
              {
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                transform: [{ scale }],
                opacity,
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.cardTouchable}
              onPress={() => {
                if (!isSelected && selectedSet.size < 3) {
                  playSoundEffect('cardSelect').catch(() => {});
                }
                toggleSelect(item.id);
              }}
            >
              <Image
                source={require('../assets/cards/card-back.png')}
                style={styles.cardImage}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={0}
              />
              {isSelected && <View style={styles.cardOverlay} />}
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      );
    },
    [didInitialScroll, isListReady, selectedSet, scrollX, toggleSelect],
  );

  const handleListLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const width = Math.round(event.nativeEvent.layout.width);
      if (width > 0 && width !== listWidth) {
        setListWidth(width);
      }
    },
    [listWidth],
  );
  const handleContentSizeChange = useCallback(
    (width: number) => {
      if (width > 0 && width !== listContentWidth) {
        setListContentWidth(width);
      }
    },
    [listContentWidth],
  );

  const handleFlipPress = useCallback(
    (index: number, onComplete?: () => void) => {
      if (flowState.flippedCards[index]) {
        onComplete?.();
        return;
      }

      const anim = flipAnimations[index];
      const firstHalf = Animated.timing(anim, {
        toValue: 0.5,
        duration: FLIP_PHASE_DURATION,
        useNativeDriver: true,
      });
      const secondHalf = Animated.timing(anim, {
        toValue: 1,
        duration: FLIP_PHASE_DURATION,
        useNativeDriver: true,
      });

      playSoundEffect('cardFlip').catch(() => {});
      firstHalf.start(() => {
        setShowFrontStates(prev => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
        secondHalf.start(() => {
          flipCard(index);
          onComplete?.();
        });
      });
    },
    [flipAnimations, flipCard, flowState.flippedCards],
  );

  const flipAllSequentially = useCallback(() => {
    return new Promise<void>(resolve => {
      const flipSequentially = (i: number) => {
        if (i >= 3) {
          resolve();
          return;
        }
        handleFlipPress(i, () => flipSequentially(i + 1));
      };
      flipSequentially(0);
    });
  }, [handleFlipPress]);

  const areAllFlipped = flowState.flippedCards.length === 3 && flowState.flippedCards.every(Boolean);
  const showRewardedAd = useCallback((): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const ad = rewardedAdRef.current;
      if (!ad) {
        reject(new Error('広告の初期化に失敗しました。'));
        return;
      }
      let earned = false;
      const unsubscribeReward = ad.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          earned = true;
        },
      );
      const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
        unsubscribeReward();
        unsubscribeClosed();
        unsubscribeError();
        resolve(earned);
      });
      const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, error => {
        unsubscribeReward();
        unsubscribeClosed();
        unsubscribeError();
        reject(error);
      });

      if (isRewardedLoaded) {
        ad.show();
        return;
      }

      const loadTimeout = setTimeout(() => {
        unsubscribeReward();
        unsubscribeClosed();
        unsubscribeError();
        reject(new Error('広告の読み込みがタイムアウトしました。'));
      }, 15000);
      const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
        clearTimeout(loadTimeout);
        unsubscribeLoaded();
        ad.show();
      });
      ad.load();
    });
  }, [isRewardedLoaded]);

  const handleFlipButtonPress = useCallback(() => {
    if (areAllFlipped) {
      if (isRewarding) {
        return;
      }
      setIsRewarding(true);
      setErrorMessage(undefined);
      showRewardedAd()
        .then(earned => {
          if (!earned) {
            setErrorMessage('広告の視聴が完了しませんでした。もう一度お試しください。');
            return;
          }
          startGenerating();
        })
        .catch(error => {
          const message = error?.message || String(error ?? '不明なエラー');
          setErrorMessage(`広告の再生に失敗しました：${message}`);
        })
        .finally(() => {
          setIsRewarding(false);
        });
      return;
    }
    setIsFlippingSequence(true);
    flipAllSequentially().finally(() => {
      setIsFlippingSequence(false);
    });
  }, [areAllFlipped, startGenerating, flipAllSequentially, isRewarding, setErrorMessage, showRewardedAd]);

  if (flowState.state === 'input') {
    return (
      <OccultBackground>
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <AppHeader title="カード鑑定" showBack={true} showSettings={true} />
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.block}>
              <Text style={styles.title}>いまの状況や悩みを1〜3行で書いてください</Text>
              <View style={styles.guideBlock}>
                {INPUT_GUIDE_LINES.map(line => (
                  <Text key={line} style={styles.guideText}>
                    {line}
                  </Text>
                ))}
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="（例）仕事内容は◯◯で、◯◯がつらい"
                  placeholderTextColor="#aaa"
                  multiline
                  maxLength={100}
                />
                <Text style={styles.inputCounter}>{`${inputText.length}/100`}</Text>
              </View>
              <MysticButton
                title="鑑定を始める"
                onPress={() => startReading(inputText)}
                disabled={!inputText.trim()}
                variant="primary"
                size="large"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </OccultBackground>
    );
  }

  if (flowState.state === 'picking') {
    const selectedCount = flowState.pickedCardIds.length;
    const isLoading = cardData.length === 0;

    return (
      <OccultBackground>
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <AppHeader title="カード選択" showBack={true} showSettings={true} />
          <View style={[styles.block, styles.pickingBlock]}>
            <View style={styles.pickingTextBlock}>
              <Text style={styles.title}>直感で3枚、選んでください</Text>
              <Text style={styles.subtitle}>
                横にスクロールして、気になるカードをタップしてください。
              </Text>
              <Text style={styles.countLabel}>選択 {selectedCount}/3</Text>
            </View>
            <View style={styles.listContainer} onLayout={handleListLayout}>
              <Animated.FlatList
                ref={flatListRef}
                data={cardData}
                horizontal
                keyExtractor={item => item.id.toString()}
                renderItem={renderCard}
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={cardData.length > 0 ? centerIndex : undefined}
                getItemLayout={(_, index) => ({
                  length: ITEM_WIDTH,
                  offset: ITEM_WIDTH * index,
                  index,
                })}
                initialNumToRender={Math.min(cardData.length, 7)}
                snapToOffsets={snapOffsets}
                decelerationRate="fast"
                contentContainerStyle={[
                  styles.listContent,
                  { paddingHorizontal: listSidePadding },
                ]}
                onContentSizeChange={handleContentSizeChange}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  { useNativeDriver: true },
                )}
                scrollEventThrottle={16}
              />
              {isLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              )}
            </View>
            <View style={styles.pickingFooter}>
              <MysticButton
                title="鑑定を始める"
                onPress={confirmSelection}
                disabled={selectedCount !== 3}
                variant="primary"
                size="large"
              />
            </View>
          </View>
        </SafeAreaView>
      </OccultBackground>
    );
  }
  
  if (flowState.state === 'flipping') {
    const buttonTitle = areAllFlipped ? '鑑定結果へ' : 'カードをめくる';

    return (
      <OccultBackground>
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <AppHeader title="カードをめくる" showBack={false} showSettings={false} />
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.block}>
              <Text style={styles.title}>カードをめくってください</Text>
              {flowState.errorMessage && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorTitle}>接続エラー</Text>
                  <Text style={styles.errorText}>{flowState.errorMessage}</Text>
                </View>
              )}
              <View style={styles.flipArea}>
                <View style={styles.arrangedRow}>
                  {flowState.arrangedPicks.map((pick, index) => {
                    const card = CARDS[pick.cardId];
                    const meaning = MAJOR_ARCANA_MEANINGS[pick.cardId];
                    const isReversed = flowState.reversedStates[index];
                    const isFlipped = flowState.flippedCards[index];
                    const showFront = isFlipped || showFrontStates[index];
                    const infoOpacity = isFlipped ? 1 : 0;
                    const keywords = isReversed
                      ? meaning?.reversed ?? card.keywordsJP ?? []
                      : meaning?.upright ?? card.keywordsJP ?? [];
                    const backRotateY = flipAnimations[index].interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: ['0deg', '90deg', '180deg'],
                    });
                    const frontRotateY = flipAnimations[index].interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: ['180deg', '90deg', '0deg'],
                    });

                    return (
                      <View key={index} style={styles.arrangedCard}>
                        <Text style={styles.arrangedRole}>{roleNames[pick.role] ?? ''}</Text>
                        <View style={styles.flipCardFrame}>
                          <Animated.View
                            style={[
                              styles.flipSide,
                              { transform: [{ rotateY: backRotateY }] },
                              { opacity: showFront ? 0 : 1 },
                            ]}
                          >
                            <Image
                              source={require('../assets/cards/card-back.png')}
                              style={styles.arrangedImage}
                              contentFit="cover"
                            />
                          </Animated.View>
                          <Animated.View
                            style={[
                              styles.flipSide,
                              { transform: [{ rotateY: frontRotateY }] },
                              { opacity: showFront ? 1 : 0 },
                            ]}
                          >
                            <Image
                              source={card.image}
                              style={[
                                styles.arrangedImage,
                                isReversed && styles.reversedImage,
                              ]}
                              contentFit="cover"
                            />
                          </Animated.View>
                        </View>
                        <View style={styles.cardInfo}>
                          <Text style={[styles.cardName, { opacity: infoOpacity }]}>
                            {card.nameJP}
                          </Text>
                          <Text
                            style={[
                              styles.cardOrientation,
                              {
                                opacity: infoOpacity,
                                color: isReversed ? colors.error : colors.textSecondaryDark,
                              },
                            ]}
                          >
                            {isReversed ? '逆位置' : '正位置'}
                          </Text>
                          <Text style={[styles.cardMeaning, { opacity: infoOpacity }]}>
                            {keywords.map((word, idx) => (
                              <Text key={`${word}-${idx}`}>
                                {word}
                                {idx < keywords.length - 1 ? '、' : ''}
                              </Text>
                            ))}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
              <MysticButton
                title={buttonTitle}
                onPress={handleFlipButtonPress}
                disabled={isFlippingSequence || isRewarding}
                variant="primary"
                size="large"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </OccultBackground>
    );
  }

  if (flowState.state === 'result') {
    const picks = getCardPicks();
    const consultationText =
      flowState.inputText?.trim() || flowState.questionNormalized?.trim() || '';
    const shareText =
      resultSections.length > 0
        ? [
            '鑑定結果',
            '',
            '選んだカード',
            ...picks.map(pick => {
              const card = CARDS[pick.cardId];
              const orientation = pick.isReversed ? '逆位置' : '正位置';
              return `${roleNames[pick.role] ?? ''}：${card.nameJP}（${orientation}）`;
            }),
            '',
            ...resultSections.flatMap(section => [
              section.title,
              section.lines.join('\n'),
              '',
            ]),
          ]
            .filter(Boolean)
            .join('\n')
        : flowState.finalResult || '鑑定結果';
    return (
      <OccultBackground>
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <AppHeader title="鑑定結果" showBack={false} showSettings={true} />
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.block}>
              <View style={styles.consultationBox}>
                <TouchableOpacity
                  style={styles.consultationHeader}
                  onPress={() => setIsConsultationOpen(prev => !prev)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.consultationTitle}>相談内容</Text>
                  <Text style={styles.consultationToggle}>
                    {isConsultationOpen ? '閉じる' : '開く'}
                  </Text>
                </TouchableOpacity>
                {isConsultationOpen && (
                  <Text style={styles.consultationBody}>
                    {consultationText || '相談内容がありません。'}
                  </Text>
                )}
              </View>
              <Text style={styles.title}>選んだカード</Text>
              <View style={[styles.arrangedRow, styles.resultArrangedRow]}>
                {picks.map((pick, idx) => {
                  const card = CARDS[pick.cardId];
                  const meaning = MAJOR_ARCANA_MEANINGS[pick.cardId];
                  const textToSplit = pick.isReversed
                    ? meaning?.reversed ?? card.shortDescJP
                    : meaning?.upright ?? card.shortDescJP;
                  const keywordsText = Array.isArray(textToSplit)
                    ? textToSplit.join('、')
                    : typeof textToSplit === 'string'
                    ? textToSplit
                    : '';
                  const keywords = keywordsText
                    .split(/[／、]/)
                    .map(piece => piece.trim())
                    .filter(Boolean);
                  const orientationColor = pick.isReversed ? colors.error : colors.textSecondaryDark;
                  return (
                    <View key={idx} style={styles.arrangedCard}>
                      <Text style={styles.arrangedRole}>{roleNames[pick.role] ?? ''}</Text>
                      <View style={styles.flipCardFrameResult}>
                        <Image
                          source={card.image}
                          style={[
                            styles.arrangedImage,
                            pick.isReversed && styles.reversedImage,
                          ]}
                          contentFit="cover"
                        />
                      </View>
                      <View style={styles.cardInfo}>
                        <Text style={styles.cardName}>{card.nameJP}</Text>
                      <Text style={[styles.cardOrientation, { color: orientationColor }]}>
                        {pick.isReversed ? '逆位置' : '正位置'}
                      </Text>
                      <Text style={styles.cardDescription}>
                        {keywordsText.replace(/／/g, '、')}
                      </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
              {resultSections.length > 0 ? (
                <View style={styles.resultSections}>
                  {resultSections.map((section, sectionIndex) => (
                    <View
                      key={`${section.title}-${sectionIndex}`}
                      style={styles.resultSection}
                    >
                      <Text style={styles.resultSectionTitle}>{section.title}</Text>
                      {section.lines.map((line, idx) => (
                        <Text
                          key={`${section.title}-${sectionIndex}-${idx}`}
                          style={styles.resultSectionBody}
                        >
                          {line}
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.resultText}>
                  {flowState.finalResult || '鑑定結果がここに表示されます。'}
                </Text>
              )}
              <MysticButton
                title="共有する"
                onPress={async () => {
                  try {
                    await Share.share({ message: shareText });
                  } catch (error) {
                    console.error('Failed to share reading result', error);
                  }
                }}
                variant="primary"
                size="large"
              />
              <MysticButton
                title="最初に戻る"
                onPress={() => {
                  reset();
                  router.push('/');
                }}
                variant="secondary"
                size="large"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </OccultBackground>
    );
  }

  return (
    <OccultBackground>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <AppHeader title="カード鑑定" showBack={false} showSettings={false} />
        <View style={[styles.block, { alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.subtitle}>少々お待ちください…</Text>
        </View>
      </SafeAreaView>
    </OccultBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  block: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  flipArea: {
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%',
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.titleLarge,
    color: colors.textPrimaryDark,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondaryDark,
    lineHeight: 20,
  },
  guideBlock: {
    gap: spacing.xs,
  },
  errorBanner: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: 'rgba(255, 77, 79, 0.12)',
    padding: spacing.md,
    gap: spacing.xs,
  },
  errorTitle: {
    ...typography.body,
    color: colors.error,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.textSecondaryDark,
  },
  guideText: {
    ...typography.bodySmall,
    color: colors.textSecondaryDark,
    lineHeight: 18,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: colors.textPrimaryDark,
    borderRadius: radius.card,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputCounter: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.sm,
    ...typography.bodySmall,
    color: colors.textSecondaryDark,
  },
  countLabel: {
    ...typography.body,
    color: colors.primary,
    textAlign: 'center',
  },
  listContainer: {
    height: CARD_HEIGHT + spacing.md * 2,
    justifyContent: 'center',
    width: '100%',
  },
  listContent: {
    alignItems: 'center',
  },
  pickingBlock: {
    paddingHorizontal: 0,
  },
  pickingTextBlock: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  pickingFooter: {
    paddingHorizontal: spacing.lg,
  },
  cardShell: {
    alignItems: 'center',
  },
  cardFrame: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  cardTouchable: {
    width: '100%',
    height: '100%',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrangedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: REVIEW_ROW_GAP,
    paddingHorizontal: REVIEW_ROW_HORIZONTAL_PADDING,
    overflow: 'visible',
    flexWrap: 'nowrap',
    minHeight: CARD_HEIGHT * 0.72,
  },
  arrangedCard: {
    width: REVIEW_CARD_WIDTH,
    alignItems: 'center',
    gap: spacing.xs,
    flexShrink: 0,
    justifyContent: 'flex-start',
    paddingTop: spacing.sm,
    minHeight: CARD_HEIGHT * 0.9,
  },
  cardInfo: {
    minHeight: CARD_INFO_MIN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardOrientation: {
    ...typography.bodySmall,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  arrangedImage: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  reversedImage: {
    transform: [{ rotate: '180deg' }],
  },
  flipCardFrame: {
    width: '100%',
    aspectRatio: 2 / 3,
    perspective: 1000,
  },
  flipCardFrameResult: {
    width: '100%',
    aspectRatio: 2 / 3,
    justifyContent: 'center',
  },
  flipSide: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  },
  arrangedRole: {
    ...typography.titleSmall,
    color: colors.textPrimaryDark,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  cardName: {
    ...typography.bodySmall,
    color: colors.textPrimaryDark,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  arrangedName: {
    ...typography.bodySmall,
    color: colors.textPrimaryDark,
    fontWeight: '600',
  },
  resultText: {
    ...typography.body,
    color: colors.textPrimaryDark,
    lineHeight: 22,
  },
  cardMeaning: {
    ...typography.bodySmall,
    color: colors.textSecondaryDark,
    textAlign: 'center',
    lineHeight: 18,
  },
  cardDescription: {
    ...typography.bodySmall,
    color: colors.textSecondaryDark,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  resultArrangedRow: {
    marginBottom: -spacing.md,
  },
  consultationBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.card,
    padding: spacing.md,
    gap: spacing.xs,
  },
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consultationTitle: {
    ...typography.titleSmall,
    color: colors.textPrimaryDark,
    fontSize: 18,
    lineHeight: 24,
  },
  consultationToggle: {
    ...typography.bodySmall,
    color: colors.primary,
  },
  consultationBody: {
    ...typography.body,
    color: colors.textSecondaryDark,
    lineHeight: 22,
  },
  resultSections: {
    gap: spacing.md,
  },
  resultSection: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.card,
    padding: spacing.md,
    gap: spacing.xs,
  },
  resultSectionTitle: {
    ...typography.titleSmall,
    color: colors.textPrimaryDark,
    fontSize: 18,
    lineHeight: 24,
  },
  resultSectionBody: {
    ...typography.body,
    color: colors.textSecondaryDark,
    lineHeight: 22,
  },
});
