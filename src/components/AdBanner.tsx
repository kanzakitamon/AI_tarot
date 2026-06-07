import React, { useEffect, useState } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/tokens';

// AdMob バナー広告ユニットID
// TODO: iOS 用バナーユニットを AdMob で作成し、IOS_BANNER_UNIT_ID に設定する
const IOS_BANNER_UNIT_ID = '';
const ANDROID_BANNER_UNIT_ID = 'ca-app-pub-4764153276310493/6781288504';

type AdsModule = typeof import('react-native-google-mobile-ads');

/**
 * 画面下部に常時表示するアンカーバナー広告。
 * Expo Go では広告モジュールが無いため何も描画しない（既存のリワード広告と同じ方針）。
 */
export default function AdBanner() {
  const [ads, setAds] = useState<AdsModule | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Constants.appOwnership === 'expo') {
      return;
    }
    let mounted = true;
    import('react-native-google-mobile-ads')
      .then(module => {
        if (mounted) {
          setAds(module);
        }
      })
      .catch(() => {
        // 広告モジュールの読み込み失敗時は何も表示しない
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!ads) {
    return null;
  }

  const { BannerAd, BannerAdSize, TestIds } = ads;

  const unitId = __DEV__
    ? TestIds.BANNER
    : Platform.OS === 'ios'
    ? IOS_BANNER_UNIT_ID || TestIds.BANNER
    : ANDROID_BANNER_UNIT_ID;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: colors.bgBase,
  },
});
