/**
 * 共通デザイントークン
 * React Native用のデザインシステム
 */

export const colors = {
  // 背景色
  bgBase: '#0B0B10', // 黒寄り
  bgOverlay: 'rgba(15, 12, 24, 0.35)', // 紫の薄膜
  bgCard: 'rgba(255, 255, 255, 0.95)', // カード背景（読みやすさ確保）
  bgCardDark: 'rgba(20, 18, 30, 0.95)', // ダークモード用カード背景

  // アクセントカラー
  primary: '#5C6CFF', // 既存の青紫を踏襲
  primaryLight: '#7B8AFF', // グラデ用（明るい方）
  primaryDark: '#4A5AE6', // グラデ用（暗い方）
  gold: '#C8A25A', // 装飾用

  // テキスト
  textPrimary: '#111', // Web白背景の時
  textPrimaryDark: '#F3F3F7', // 暗背景の時
  textSecondary: '#666',
  textSecondaryDark: '#999',
  textOnPrimary: '#FFF', // プライマリボタン上のテキスト

  // ボーダー
  borderLight: 'rgba(200, 162, 90, 0.3)', // 薄い金
  borderWhite: 'rgba(255, 255, 255, 0.2)', // 薄い白
  borderDivider: 'rgba(0, 0, 0, 0.1)', // ヘッダー下線用

  // 状態
  disabled: '#999',
  disabledBg: '#E5E5E5',
  error: '#EF4444',
  success: '#10B981',
} as const;

export const radius = {
  button: 14,
  card: 18,
  input: 12,
  small: 8,
  lg: 16,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    lineHeight: 36,
  },
  titleLarge: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    lineHeight: 36,
  },
  titleSmall: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  button: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    lineHeight: 24,
  },
} as const;

export const shadow = {
  // 浅い影（ボタン用）
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4, // Android
  },
  // カード用
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6, // Android
  },
  // 押下時（影を弱く）
  pressed: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android
  },
} as const;

export const header = {
  height: 56,
  minTouchSize: 44, // タップ領域最小サイズ
} as const;

export const button = {
  large: {
    height: 56,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  medium: {
    height: 48,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
} as const;

// 型定義
export type ColorKey = keyof typeof colors;
export type RadiusKey = keyof typeof radius;
export type SpacingKey = keyof typeof spacing;
export type ShadowKey = keyof typeof shadow;


