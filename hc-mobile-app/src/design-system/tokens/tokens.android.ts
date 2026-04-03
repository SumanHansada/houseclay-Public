export const typography = {
  fontFamily: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
  },
  fontSize: {
    xs: 11,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 22,
    xxl: 24,
    display: 36,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.43,
    relaxed: 1.6,
  },
};

export const colors = {
  light: {
    primary: '#6750A4',
    secondary: '#625B71',
    tertiary: '#7D5260',
    background: '#FFFBFE',
    surface: '#FFFBFE',
    surfaceVariant: '#E7E0EC',
    surfaceContainerLow: '#F7F2FA',
    surfaceContainerHigh: '#ECE6F0',
    text: '#1C1B1F',
    textSecondary: '#49454F',
    textTertiary: '#79747E',
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
    error: '#B3261E',
    success: '#2E7D32',
    warning: '#ED6C02',
  },
  dark: {
    primary: '#D0BCFF',
    secondary: '#CCC2DC',
    tertiary: '#EFB8C8',
    background: '#1C1B1F',
    surface: '#1C1B1F',
    surfaceVariant: '#49454F',
    surfaceContainerLow: '#211F26',
    surfaceContainerHigh: '#2B2930',
    text: '#E6E1E5',
    textSecondary: '#CAC4D0',
    textTertiary: '#938F99',
    outline: '#938F99',
    outlineVariant: '#49454F',
    error: '#F2B8B5',
    success: '#81C784',
    warning: '#FFB74D',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 28,
  pill: 999,
};

export const elevation = {
  level0: 0,
  level1: 1,
  level2: 3,
  level3: 6,
  level4: 8,
  level5: 12,
};
