import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
  type ViewProps,
} from 'react-native';
import {colors, borderRadius, shadows, spacing} from '@/design-system/tokens';

interface CardProps extends ViewProps {
  onPress?: () => void;
  variant?: 'default' | 'glass' | 'elevated' | 'filled' | 'outlined';
}

export default function Card({
  onPress,
  style,
  children,
  ...props
}: CardProps) {
  const isDark = useColorScheme() === 'dark';
  const palette = isDark ? colors.dark : colors.light;

  const cardContent = (
    <View
      style={[
        styles.base,
        shadows.md,
        {backgroundColor: palette.surface},
        style,
      ]}
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
