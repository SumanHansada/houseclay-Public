import React from 'react';
import {useColorScheme} from 'react-native';
import {Appbar} from 'react-native-paper';
import {colors} from '@/design-system/tokens';

interface AppBarProps {
  title: string;
  onBackPress?: () => void;
  backLabel?: string;
  rightAction?: React.ReactNode;
}

export default function AppBar({
  title,
  onBackPress,
  rightAction,
}: AppBarProps) {
  const isDark = useColorScheme() === 'dark';
  const palette = isDark ? colors.dark : colors.light;

  return (
    <Appbar.Header
      style={{backgroundColor: palette.surface}}
      statusBarHeight={0}>
      {onBackPress && <Appbar.BackAction onPress={onBackPress} />}
      <Appbar.Content title={title} titleStyle={{color: palette.text}} />
      {rightAction}
    </Appbar.Header>
  );
}
