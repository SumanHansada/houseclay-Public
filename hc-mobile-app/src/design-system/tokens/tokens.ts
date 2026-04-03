import {Platform} from 'react-native';

const isIOS = Platform.OS === 'ios';

export const typography = {
  fontFamily: {
    regular: isIOS ? 'System' : 'Roboto',
    medium: isIOS ? 'System' : 'Roboto-Medium',
    bold: isIOS ? 'System' : 'Roboto-Bold',
  },
  fontSize: {
    xs: 11,
    sm: isIOS ? 13 : 12,
    md: isIOS ? 15 : 14,
    lg: isIOS ? 17 : 16,
    xl: isIOS ? 20 : 22,
    xxl: 24,
    display: isIOS ? 34 : 36,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: isIOS ? 1.4 : 1.43,
    relaxed: 1.6,
  },
};

export const colors = {
  light: {
    primary: isIOS ? '#007AFF' : '#6750A4',
    secondary: isIOS ? '#5856D6' : '#625B71',
    tertiary: isIOS ? '#FF9500' : '#7D5260',
    background: isIOS ? '#F2F2F7' : '#FFFBFE',
    surface: isIOS ? 'rgba(255, 255, 255, 0.72)' : '#FFFBFE',
    surfaceGlass: 'rgba(255, 255, 255, 0.45)',
    surfaceVariant: '#E7E0EC',
    surfaceContainerLow: '#F7F2FA',
    surfaceContainerHigh: '#ECE6F0',
    glassTint: 'rgba(120, 120, 128, 0.12)',
    text: isIOS ? '#000000' : '#1C1B1F',
    textSecondary: isIOS ? '#3C3C43' : '#49454F',
    textTertiary: isIOS ? '#8E8E93' : '#79747E',
    separator: 'rgba(60, 60, 67, 0.29)',
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
    error: isIOS ? '#FF3B30' : '#B3261E',
    success: isIOS ? '#34C759' : '#2E7D32',
    warning: isIOS ? '#FF9500' : '#ED6C02',
  },
  dark: {
    primary: isIOS ? '#0A84FF' : '#D0BCFF',
    secondary: isIOS ? '#5E5CE6' : '#CCC2DC',
    tertiary: isIOS ? '#FF9F0A' : '#EFB8C8',
    background: isIOS ? '#000000' : '#1C1B1F',
    surface: isIOS ? 'rgba(28, 28, 30, 0.72)' : '#1C1B1F',
    surfaceGlass: 'rgba(44, 44, 46, 0.45)',
    surfaceVariant: '#49454F',
    surfaceContainerLow: '#211F26',
    surfaceContainerHigh: '#2B2930',
    glassTint: 'rgba(120, 120, 128, 0.36)',
    text: isIOS ? '#FFFFFF' : '#E6E1E5',
    textSecondary: isIOS ? '#EBEBF5' : '#CAC4D0',
    textTertiary: '#8E8E93',
    separator: 'rgba(84, 84, 88, 0.65)',
    outline: '#938F99',
    outlineVariant: '#49454F',
    error: isIOS ? '#FF453A' : '#F2B8B5',
    success: isIOS ? '#30D158' : '#81C784',
    warning: isIOS ? '#FF9F0A' : '#FFB74D',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: isIOS ? 20 : 24,
  xl: isIOS ? 24 : 32,
  xxl: isIOS ? 32 : 40,
  xxxl: isIOS ? 44 : 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: isIOS ? 20 : 28,
  pill: 999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
};

export const elevation = {
  level0: 0,
  level1: 1,
  level2: 3,
  level3: 6,
  level4: 8,
  level5: 12,
};
