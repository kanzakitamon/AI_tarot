import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, header, shadow } from '../theme/tokens';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  showSettings?: boolean;
  onBackPress?: () => void;
  onSettingsPress?: () => void;
}

export default function AppHeader({
  title,
  showBack = true,
  showSettings = true,
  onBackPress,
  onSettingsPress,
}: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push('/');
      }
    }
  };

  const handleSettings = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      router.push('/settings');
    }
  };

  // ホーム画面では戻るボタンを非表示
  const shouldShowBack = showBack && pathname !== '/';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* 左側：戻るボタン */}
        <View style={styles.leftSection}>
          {shouldShowBack ? (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.iconText}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.iconButton} />
          )}
        </View>

        {/* 中央：タイトル */}
        <View style={styles.centerSection}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* 右側：設定ボタン */}
        <View style={styles.rightSection}>
          {showSettings ? (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleSettings}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.iconText}>⚙</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.iconButton} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
  },
  container: {
    height: header.height,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.bgOverlay,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDivider,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  leftSection: {
    width: header.minTouchSize,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  rightSection: {
    width: header.minTouchSize,
    alignItems: 'flex-end',
  },
  iconButton: {
    minWidth: header.minTouchSize,
    minHeight: header.minTouchSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18, // サイズを下げる
    color: colors.textPrimaryDark,
    opacity: 0.6, // 不透明度を下げる
    fontWeight: '500',
  },
  title: {
    ...typography.titleSmall,
    color: colors.textPrimaryDark,
    textAlign: 'center',
  },
});

