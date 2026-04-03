import React from 'react';
import {StyleSheet, useColorScheme, View} from 'react-native';
import {colors, borderRadius, spacing, elevation} from '@/design-system/tokens';

interface SheetProps {
  children: React.ReactNode;
}

export default function Sheet({children}: SheetProps) {
  const isDark = useColorScheme() === 'dark';
  const palette = isDark ? colors.dark : colors.light;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.surfaceContainerHigh,
          elevation: elevation.level3,
        },
      ]}>
      <View style={styles.handle} />
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    overflow: 'hidden',
    paddingTop: spacing.sm,
  },
  inner: {
    padding: spacing.md,
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
});
