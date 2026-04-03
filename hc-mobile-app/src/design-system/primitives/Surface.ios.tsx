import React from 'react';
import {StyleSheet, useColorScheme, View, type ViewProps} from 'react-native';
import {
  LiquidGlassView,
  isLiquidGlassSupported,
} from '@callstack/liquid-glass';
import {colors, borderRadius} from '@/design-system/tokens';

interface SurfaceProps extends ViewProps {
  variant?: 'default' | 'glass' | 'elevated';
  cornerRadius?: keyof typeof borderRadius;
}

export default function Surface({
  variant = 'default',
  cornerRadius = 'md',
  style,
  children,
  ...props
}: SurfaceProps) {
  const isDark = useColorScheme() === 'dark';
  const palette = isDark ? colors.dark : colors.light;
  const radius = borderRadius[cornerRadius];

  if (variant === 'glass' && isLiquidGlassSupported) {
    return (
      <LiquidGlassView
        style={[
          styles.base,
          {borderRadius: radius, backgroundColor: palette.surfaceGlass},
          style,
        ]}
        {...props}>
        {children}
      </LiquidGlassView>
    );
  }

  const backgroundColor =
    variant === 'glass' ? palette.surfaceGlass : palette.surface;

  return (
    <View
      style={[styles.base, {borderRadius: radius, backgroundColor}, style]}
      {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
