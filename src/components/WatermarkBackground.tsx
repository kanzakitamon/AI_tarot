import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WatermarkBackgroundProps {
  position?: 'center' | 'bottom';
  opacity?: number;
}

/**
 * 背景透かしコンポーネント
 * 魔法陣風の円と星図を組み合わせたデザイン
 */
export default function WatermarkBackground({
  position = 'center',
  opacity = 0.06, // 6%の透明度（5-8%の範囲）
}: WatermarkBackgroundProps) {
  const size = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.7; // 画面サイズの70%
  const centerX = SCREEN_WIDTH / 2;
  const centerY = position === 'center' 
    ? SCREEN_HEIGHT / 2 
    : SCREEN_HEIGHT * 0.75; // 画面下寄り

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        style={styles.svg}
      >
        <G opacity={opacity}>
          {/* 外側の円（魔法陣風） */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={size / 2}
            fill="none"
            stroke="#6366f1"
            strokeWidth={1}
          />
          
          {/* 内側の円 */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={size / 2.5}
            fill="none"
            stroke="#6366f1"
            strokeWidth={0.8}
          />
          
          {/* さらに内側の円 */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={size / 3.5}
            fill="none"
            stroke="#6366f1"
            strokeWidth={0.6}
          />
          
          {/* 星図（8芒星） */}
          <G>
            {/* 上 */}
            <Path
              d={`M ${centerX} ${centerY - size / 2} L ${centerX} ${centerY - size / 3}`}
              stroke="#6366f1"
              strokeWidth={0.8}
            />
            {/* 下 */}
            <Path
              d={`M ${centerX} ${centerY + size / 2} L ${centerX} ${centerY + size / 3}`}
              stroke="#6366f1"
              strokeWidth={0.8}
            />
            {/* 左 */}
            <Path
              d={`M ${centerX - size / 2} ${centerY} L ${centerX - size / 3} ${centerY}`}
              stroke="#6366f1"
              strokeWidth={0.8}
            />
            {/* 右 */}
            <Path
              d={`M ${centerX + size / 2} ${centerY} L ${centerX + size / 3} ${centerY}`}
              stroke="#6366f1"
              strokeWidth={0.8}
            />
            {/* 右上 */}
            <Path
              d={`M ${centerX + size / 2 * 0.707} ${centerY - size / 2 * 0.707} L ${centerX + size / 3 * 0.707} ${centerY - size / 3 * 0.707}`}
              stroke="#6366f1"
              strokeWidth={0.8}
            />
            {/* 左上 */}
            <Path
              d={`M ${centerX - size / 2 * 0.707} ${centerY - size / 2 * 0.707} L ${centerX - size / 3 * 0.707} ${centerY - size / 3 * 0.707}`}
              stroke="#6366f1"
              strokeWidth={0.8}
            />
            {/* 右下 */}
            <Path
              d={`M ${centerX + size / 2 * 0.707} ${centerY + size / 2 * 0.707} L ${centerX + size / 3 * 0.707} ${centerY + size / 3 * 0.707}`}
              stroke="#6366f1"
              strokeWidth={0.8}
            />
            {/* 左下 */}
            <Path
              d={`M ${centerX - size / 2 * 0.707} ${centerY + size / 2 * 0.707} L ${centerX - size / 3 * 0.707} ${centerY + size / 3 * 0.707}`}
              stroke="#6366f1"
              strokeWidth={0.8}
            />
          </G>
          
          {/* 太陽・月の幾何学図形（中央） */}
          <G>
            {/* 太陽（円） */}
            <Circle
              cx={centerX}
              cy={centerY - size / 6}
              r={size / 12}
              fill="none"
              stroke="#6366f1"
              strokeWidth={0.6}
            />
            {/* 月（三日月風のシンプルな円弧） */}
            <Path
              d={`M ${centerX + size / 12} ${centerY + size / 6} A ${size / 12} ${size / 12} 0 1 1 ${centerX - size / 12} ${centerY + size / 6}`}
              fill="none"
              stroke="#6366f1"
              strokeWidth={0.6}
            />
            {/* 月の内側の円弧 */}
            <Path
              d={`M ${centerX + size / 24} ${centerY + size / 6} A ${size / 24} ${size / 24} 0 1 0 ${centerX - size / 24} ${centerY + size / 6}`}
              fill="none"
              stroke="#6366f1"
              strokeWidth={0.6}
            />
          </G>
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

