import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, typography, shadow, button } from '../theme/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'large' | 'medium';

interface MysticButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function MysticButton({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  style,
  textStyle,
}: MysticButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.99,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const buttonSize = button[size];
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';

  const renderContent = () => {
    const buttonStyle = {
      height: buttonSize.height,
      borderRadius: radius.button,
      paddingHorizontal: buttonSize.paddingHorizontal,
      paddingVertical: buttonSize.paddingVertical,
    };

    // 下方向にごく弱い影のみ
    const buttonShadow = {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3, // Android
    };

    if (isPrimary && !disabled) {
      // Primary: 弱いグラデーション背景 + 下方向の弱い影のみ（ボーダーなし）
      return (
        <LinearGradient
          colors={[colors.primaryLight, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            styles.gradient,
            buttonStyle,
            buttonShadow,
            styles.primaryBorder,
          ]}
        >
          <Text
            style={[
              styles.text,
              styles.primaryText,
              { fontSize: typography.button.fontSize, letterSpacing: 1 },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </LinearGradient>
      );
    }

    // Secondary / Ghost / Disabled
    return (
      <View
        style={[
          styles.buttonBase,
          buttonStyle,
          !disabled && !isGhost && buttonShadow,
          {
            backgroundColor: disabled
              ? colors.disabledBg
              : isGhost
              ? 'transparent'
              : 'rgba(255,255,255,0.06)', // Secondaryはガラス調
            borderWidth: disabled || isGhost ? 0 : 1,
            borderColor: colors.borderLight, // 薄い金の縁取り
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              color: disabled ? colors.disabled : colors.textPrimaryDark,
              fontSize: typography.button.fontSize,
              letterSpacing: 1,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1} // カスタムアニメーションを使用するため1に設定
        style={styles.touchable}
      >
        {renderContent()}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBorder: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  buttonBase: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.button,
    textAlign: 'center',
  },
  primaryText: {
    color: colors.textOnPrimary,
  },
});

