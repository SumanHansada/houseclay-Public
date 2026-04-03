import React, {createContext, useContext, useMemo} from 'react';
import {Platform, useColorScheme} from 'react-native';
import {PaperProvider, MD3DarkTheme, MD3LightTheme} from 'react-native-paper';
import {colors, typography, spacing, borderRadius} from '@/design-system/tokens';

type ColorScheme = 'light' | 'dark';

interface ThemeContextValue {
  colorScheme: ColorScheme;
  isDark: boolean;
  colors: typeof colors.light;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({children}: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const colorScheme: ColorScheme = systemScheme === 'dark' ? 'dark' : 'light';
  const isDark = colorScheme === 'dark';
  const palette = isDark ? colors.dark : colors.light;

  const value = useMemo<ThemeContextValue>(
    () => ({
      colorScheme,
      isDark,
      colors: palette,
      typography,
      spacing,
      borderRadius,
    }),
    [colorScheme, isDark, palette],
  );

  const content = (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );

  if (Platform.OS === 'android') {
    const paperTheme = isDark ? MD3DarkTheme : MD3LightTheme;
    return <PaperProvider theme={paperTheme}>{content}</PaperProvider>;
  }

  return content;
}
