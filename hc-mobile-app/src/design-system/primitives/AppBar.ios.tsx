import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {
  LiquidGlassView,
  isLiquidGlassSupported,
} from '@callstack/liquid-glass';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, typography, spacing} from '@/design-system/tokens';

interface AppBarProps {
  title: string;
  onBackPress?: () => void;
  backLabel?: string;
  rightAction?: React.ReactNode;
}

export default function AppBar({
  title,
  onBackPress,
  backLabel = 'Back',
  rightAction,
}: AppBarProps) {
  const isDark = useColorScheme() === 'dark';
  const palette = isDark ? colors.dark : colors.light;
  const insets = useSafeAreaInsets();

  const content = (
    <View style={[styles.inner, {paddingTop: insets.top}]}>
      <View style={styles.leading}>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} hitSlop={8}>
            <Text style={[styles.backLabel, {color: palette.primary}]}>
              {backLabel}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <Text
        style={[styles.title, {color: palette.text}]}
        numberOfLines={1}
        allowFontScaling>
        {title}
      </Text>
      <View style={styles.trailing}>{rightAction}</View>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    paddingHorizontal: spacing.md,
  },
  leading: {
    flex: 1,
    alignItems: 'flex-start',
  },
  title: {
    flex: 2,
    textAlign: 'center',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  trailing: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backLabel: {
    fontSize: typography.fontSize.lg,
  },
});
