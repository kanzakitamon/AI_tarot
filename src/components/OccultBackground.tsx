import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/tokens';
import WatermarkBackground from './WatermarkBackground';

interface OccultBackgroundProps {
  children?: React.ReactNode;
  showPattern?: boolean;
}

export default function OccultBackground({
  children,
  showPattern = true,
}: OccultBackgroundProps) {
  return (
    <View style={styles.container}>
      {/* グラデーション背景 */}
      <LinearGradient
        colors={[colors.bgBase, '#1A1628', '#2D1F3D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* 魔法陣パターン（透過） */}
      {showPattern && (
        <View style={styles.patternContainer} pointerEvents="none">
          <WatermarkBackground position="center" opacity={0.08} />
        </View>
      )}

      {/* コンテンツ */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6,
  },
});


