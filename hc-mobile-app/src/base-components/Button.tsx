import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from 'react-native';
import {useTheme} from '@/app/providers';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
}

const sizeConfig = {
  sm: {paddingVertical: 8, paddingHorizontal: 12, fontSize: 13},
  md: {paddingVertical: 12, paddingHorizontal: 20, fontSize: 15},
  lg: {paddingVertical: 16, paddingHorizontal: 28, fontSize: 17},
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  style,
}: ButtonProps) {
  const {colors, borderRadius: br} = useTheme();
  const sizeStyles = sizeConfig[size];

  const getVariantStyles = (): {
    bg: string;
    textColor: string;
    borderColor?: string;
  } => {
    switch (variant) {
      case 'primary':
        return {bg: colors.primary, textColor: '#FFFFFF'};
      case 'secondary':
        return {bg: colors.secondary, textColor: '#FFFFFF'};
      case 'outline':
        return {
          bg: 'transparent',
          textColor: colors.primary,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {bg: 'transparent', textColor: colors.primary};
      case 'danger':
        return {bg: colors.error, textColor: '#FFFFFF'};
    }
  };

  const {bg, textColor, borderColor} = getVariantStyles();
  const radius = Platform.OS === 'ios' ? br.md : br.xl;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      style={({pressed}) => [
        styles.base,
        {
          backgroundColor: bg,
          borderRadius: radius,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
        borderColor ? {borderWidth: 1, borderColor} : undefined,
        style,
      ]}>
      {isLoading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {leftIcon}
          <Text
            style={[
              styles.label,
              {
                color: textColor,
                fontSize: sizeStyles.fontSize,
                marginLeft: leftIcon ? 8 : 0,
                marginRight: rightIcon ? 8 : 0,
              },
            ]}>
            {label}
          </Text>
          {rightIcon}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
  },
});
