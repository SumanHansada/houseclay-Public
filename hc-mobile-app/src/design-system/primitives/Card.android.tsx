import React from 'react';
import {StyleSheet, useColorScheme, type ViewProps} from 'react-native';
import {Card as PaperCard} from 'react-native-paper';
import {colors, borderRadius, spacing} from '@/design-system/tokens';

interface CardProps extends ViewProps {
  onPress?: () => void;
  variant?: 'elevated' | 'filled' | 'outlined';
}

export default function Card({
  onPress,
  variant = 'elevated',
  style,
  children,
}: CardProps) {
  const isDark = useColorScheme() === 'dark';
  const palette = isDark ? colors.dark : colors.light;

  const mode =
    variant === 'outlined'
      ? 'outlined'
      : variant === 'filled'
        ? 'contained'
        : 'elevated';

  return (
    <PaperCard
      mode={mode}
      onPress={onPress}
      style={[
        styles.base,
        {backgroundColor: palette.surfaceContainerLow},
        style,
      ]}>
      <PaperCard.Content>{children}</PaperCard.Content>
    </PaperCard>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    marginVertical: spacing.xs,
  },
});
