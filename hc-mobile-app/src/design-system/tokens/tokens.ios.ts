import {Platform} from 'react-native';

const systemFont = Platform.select({ios: 'System'}) ?? 'System';

export const typography = {
  fontFamily: {
    regular: systemFont,
    medium: systemFont,
    bold: systemFont,
  },
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    display: 34,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

export const colors = {
  light: {
    primary: '#007AFF',
    secondary: '#5856D6',
    tertiary: '#FF9500',
    background: '#F2F2F7',
    surface: 'rgba(255, 255, 255, 0.72)',
    surfaceGlass: 'rgba(255, 255, 255, 0.45)',
    glassTint: 'rgba(120, 120, 128, 0.12)',
    text: '#000000',
    textSecondary: '#3C3C43',
    textTertiary: '#8E8E93',
    separator: 'rgba(60, 60, 67, 0.29)',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
  },
  dark: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    tertiary: '#FF9F0A',
    background: '#000000',
    surface: 'rgba(28, 28, 30, 0.72)',
    surfaceGlass: 'rgba(44, 44, 46, 0.45)',
    glassTint: 'rgba(120, 120, 128, 0.36)',
    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    textTertiary: '#8E8E93',
    separator: 'rgba(84, 84, 88, 0.65)',
    error: '#FF453A',
    success: '#30D158',
    warning: '#FF9F0A',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 44,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
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
