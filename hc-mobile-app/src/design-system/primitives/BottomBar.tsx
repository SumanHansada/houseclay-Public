import React from 'react';
import {StyleSheet, useColorScheme, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '@/design-system/tokens';

interface BottomBarProps {
  children: React.ReactNode;
}

export default function BottomBar({children}: BottomBarProps) {
  const isDark = useColorScheme() === 'dark';
  const palette = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {backgroundColor: palette.surface}]}>
      <View style={[styles.inner, {paddingBottom: insets.bottom}]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 49,
  },
});
