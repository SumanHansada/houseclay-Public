import React from 'react';
import {StyleSheet, useColorScheme, View, type ViewProps} from 'react-native';
import {colors, borderRadius} from '@/design-system/tokens';

interface SurfaceProps extends ViewProps {
  variant?: 'default' | 'glass' | 'elevated' | 'outlined';
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

  return (
    <View
      style={[
        styles.base,
        {borderRadius: radius, backgroundColor: palette.surface},
        style,
      ]}
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
