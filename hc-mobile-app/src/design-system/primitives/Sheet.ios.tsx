import React from 'react';
import {StyleSheet, useColorScheme, View} from 'react-native';
import {
  LiquidGlassView,
  isLiquidGlassSupported,
} from '@callstack/liquid-glass';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, borderRadius, spacing} from '@/design-system/tokens';

interface SheetProps {
  children: React.ReactNode;
}

export default function Sheet({children}: SheetProps) {
  const isDark = useColorScheme() === 'dark';
  const palette = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  const content = (
    <View style={[styles.inner, {paddingBottom: insets.bottom || spacing.md}]}>
      <View style={styles.handle} />
      {children}
    </View>
  );

  if (isLiquidGlassSupported) {
    return (
      <LiquidGlassView
        style={[styles.container, {backgroundColor: palette.surfaceGlass}]}>
        {content}
      </LiquidGlassView>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: palette.surface}]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  inner: {
    padding: spacing.md,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
});
