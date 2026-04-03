import React from 'react';
import {StyleSheet, useColorScheme, type ViewProps} from 'react-native';
import {Surface as PaperSurface} from 'react-native-paper';
import {colors, borderRadius, elevation} from '@/design-system/tokens';

interface SurfaceProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
  cornerRadius?: keyof typeof borderRadius;
  elevationLevel?: keyof typeof elevation;
}

export default function Surface({
  variant = 'default',
  cornerRadius = 'md',
  elevationLevel = 'level1',
  style,
  children,
  ...props
}: SurfaceProps) {
  const isDark = useColorScheme() === 'dark';
  const palette = isDark ? colors.dark : colors.light;
  const radius = borderRadius[cornerRadius];
  const elev = elevation[elevationLevel];

  return (
    <PaperSurface
      elevation={elev as 0 | 1 | 2 | 3 | 4 | 5}
      style={[
        styles.base,
        {
          borderRadius: radius,
          backgroundColor: palette.surface,
        },
        variant === 'outlined' && {
          borderWidth: 1,
          borderColor: palette.outlineVariant,
        },
        style,
      ]}
      {...props}>
      {children}
    </PaperSurface>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
