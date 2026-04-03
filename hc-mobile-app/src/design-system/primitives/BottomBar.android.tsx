import React from 'react';
import {StyleSheet, useColorScheme, View} from 'react-native';
import {colors, elevation} from '@/design-system/tokens';

interface BottomBarProps {
  children: React.ReactNode;
}

export default function BottomBar({children}: BottomBarProps) {
  const isDark = useColorScheme() === 'dark';
  const palette = isDark ? colors.dark : colors.light;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.surfaceContainerHigh,
          elevation: elevation.level2,
        },
      ]}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    paddingVertical: 12,
  },
});
