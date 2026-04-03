import React, {useState} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import {useTheme} from '@/app/providers';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  touched?: boolean;
  containerStyle?: ViewStyle;
}

export default function TextField({
  label,
  error,
  touched,
  containerStyle,
  ...inputProps
}: TextFieldProps) {
  const {colors, typography: typo, spacing, borderRadius: br} = useTheme();
  const [focused, setFocused] = useState(false);
  const showError = touched && !!error;

  const borderColor = showError
    ? colors.error
    : focused
      ? colors.primary
      : Platform.OS === 'ios'
        ? colors.separator ?? 'rgba(60,60,67,0.29)'
        : colors.outline ?? '#79747E';

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, {color: colors.textSecondary, fontSize: typo.fontSize.sm}]}>
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor={colors.textTertiary}
        style={[
          styles.input,
          {
            borderColor,
            borderRadius: Platform.OS === 'ios' ? br.sm : br.sm,
            color: colors.text,
            fontSize: typo.fontSize.md,
            backgroundColor:
              Platform.OS === 'android'
                ? colors.surfaceVariant ?? colors.surface
                : 'transparent',
            paddingHorizontal: spacing.md,
            paddingVertical: Platform.OS === 'ios' ? 12 : 14,
          },
        ]}
        onFocus={e => {
          setFocused(true);
          inputProps.onFocus?.(e);
        }}
        onBlur={e => {
          setFocused(false);
          inputProps.onBlur?.(e);
        }}
        {...inputProps}
      />
      {showError && (
        <Text style={[styles.error, {color: colors.error, fontSize: typo.fontSize.xs}]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
  },
  error: {
    marginTop: 4,
  },
});
