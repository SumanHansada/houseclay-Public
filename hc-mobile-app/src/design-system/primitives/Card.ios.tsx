import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
  type ViewProps,
} from 'react-native';
import {
  LiquidGlassView,
  isLiquidGlassSupported,
} from '@callstack/liquid-glass';
import {colors, borderRadius, shadows, spacing} from '@/design-system/tokens';

interface CardProps extends ViewProps {
  onPress?: () => void;
  variant?: 'default' | 'glass';
}

export default function Card({
  onPress,
  variant = 'default',
  style,
  children,
  ...props
}: CardProps) {
  const isDark = useColorScheme() === 'dark';
  const palette = isDark ? colors.dark : colors.light;

  const useGlass = variant === 'glass' && isLiquidGlassSupported;
  const backgroundColor = useGlass ? palette.surfaceGlass : palette.surface;

  const cardContent = useGlass ? (
    <LiquidGlassView
      style={[styles.base, shadows.md, {backgroundColor}, style]}
      {...props}>
      {children}
    </LiquidGlassView>
  ) : (
    <View
      style={[styles.base, shadows.md, {backgroundColor}, style]}
      {...props}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    overflow: 'hidden',
  },
});
