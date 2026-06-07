import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

type AdsApi = {
  mobileAds: () => { initialize: () => Promise<unknown> };
  RewardedAd: {
    createForAdRequest: (
      id: string,
      options?: Record<string, unknown>,
    ) => any;
  };
  RewardedAdEventType: Record<string, string>;
  AdEventType: Record<string, string>;
  TestIds: { REWARDED: string };
};

const IOS_REWARDED_UNIT_ID = 'ca-app-pub-4764153276310493/3366326448';
// 鑑定結果を確認するために表示するリワード広告（2026-06-07 作成の新ユニット）
const ANDROID_REWARDED_UNIT_ID = 'ca-app-pub-4764153276310493/7104722138';
const REWARDED_LOAD_TIMEOUT_MS = 15000;

export interface UseRewardedAdOptions {
  onLoadError?: (message: string) => void;
}

export interface UseRewardedAdResult {
  showRewardedAd: () => Promise<boolean>;
}

export function useRewardedAd(
  options: UseRewardedAdOptions = {},
): UseRewardedAdResult {
  const { onLoadError } = options;
  const onLoadErrorRef = useRef(onLoadError);
  onLoadErrorRef.current = onLoadError;

  const adsApiRef = useRef<AdsApi | null>(null);
  const rewardedAdRef = useRef<any>(null);
  const [adsLoaded, setAdsLoaded] = useState(false);
  const [isRewardedLoaded, setIsRewardedLoaded] = useState(false);

  useEffect(() => {
    if (Constants.appOwnership === 'expo') {
      return;
    }
    let isMounted = true;
    import('react-native-google-mobile-ads')
      .then(module => {
        if (!isMounted) {
          return;
        }
        adsApiRef.current = {
          mobileAds: module.default,
          RewardedAd: module.RewardedAd,
          RewardedAdEventType: module.RewardedAdEventType,
          AdEventType: module.AdEventType,
          TestIds: module.TestIds,
        };
        setAdsLoaded(true);
        module.default().initialize().catch(() => {});
      })
      .catch(() => {
        onLoadErrorRef.current?.('広告モジュールの初期化に失敗しました。');
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const rewardedAdUnitId = useMemo(() => {
    if (!adsApiRef.current) {
      return '';
    }
    if (__DEV__) {
      return adsApiRef.current.TestIds.REWARDED;
    }
    if (Platform.OS === 'ios') {
      return IOS_REWARDED_UNIT_ID;
    }
    return ANDROID_REWARDED_UNIT_ID;
  }, [adsLoaded]);

  useEffect(() => {
    if (!adsApiRef.current || !rewardedAdUnitId) {
      return;
    }
    const api = adsApiRef.current;
    const ad = api.RewardedAd.createForAdRequest(rewardedAdUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });
    rewardedAdRef.current = ad;
    const unsubscribeLoaded = ad.addAdEventListener(
      api.RewardedAdEventType.LOADED,
      () => {
        setIsRewardedLoaded(true);
      },
    );
    const unsubscribeClosed = ad.addAdEventListener(
      api.AdEventType.CLOSED,
      () => {
        setIsRewardedLoaded(false);
      },
    );
    const unsubscribeError = ad.addAdEventListener(
      api.AdEventType.ERROR,
      (error: any) => {
        setIsRewardedLoaded(false);
        onLoadErrorRef.current?.(
          `広告の読み込みに失敗しました：${error?.message ?? '不明なエラー'}`,
        );
      },
    );
    ad.load();
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, [rewardedAdUnitId]);

  const showRewardedAd = useCallback((): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (Constants.appOwnership === 'expo') {
        reject(new Error('広告は公開ビルドでのみ利用できます。'));
        return;
      }
      const ad = rewardedAdRef.current;
      const api = adsApiRef.current;
      if (!ad || !api) {
        reject(new Error('広告の初期化に失敗しました。'));
        return;
      }
      let earned = false;
      const unsubscribeReward = ad.addAdEventListener(
        api.RewardedAdEventType.EARNED_REWARD,
        () => {
          earned = true;
        },
      );
      const unsubscribeClosed = ad.addAdEventListener(
        api.AdEventType.CLOSED,
        () => {
          unsubscribeReward();
          unsubscribeClosed();
          unsubscribeError();
          resolve(earned);
        },
      );
      const unsubscribeError = ad.addAdEventListener(
        api.AdEventType.ERROR,
        (error: any) => {
          unsubscribeReward();
          unsubscribeClosed();
          unsubscribeError();
          reject(error);
        },
      );

      if (isRewardedLoaded) {
        ad.show();
        return;
      }

      const loadTimeout = setTimeout(() => {
        unsubscribeReward();
        unsubscribeClosed();
        unsubscribeError();
        reject(new Error('広告の読み込みがタイムアウトしました。'));
      }, REWARDED_LOAD_TIMEOUT_MS);
      const unsubscribeLoaded = ad.addAdEventListener(
        api.RewardedAdEventType.LOADED,
        () => {
          clearTimeout(loadTimeout);
          unsubscribeLoaded();
          ad.show();
        },
      );
      ad.load();
    });
  }, [isRewardedLoaded]);

  return { showRewardedAd };
}
