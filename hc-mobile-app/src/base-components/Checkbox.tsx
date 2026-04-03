import React from 'react';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {Checkbox as PaperCheckbox} from 'react-native-paper';
import {useTheme} from '@/app/providers';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  touched?: boolean;
}

export default function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  error,
  touched,
}: CheckboxProps) {
  const {colors, typography: typo} = useTheme();
  const showError = touched && !!error;

  if (Platform.OS === 'android') {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <PaperCheckbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => onChange(!checked)}
            disabled={disabled}
          />
          <Text style={[styles.label, {color: colors.text, fontSize: typo.fontSize.md}]}>
            {label}
          </Text>
        </View>
        {showError && (
          <Text style={[styles.error, {color: colors.error}]}>{error}</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.row}
        onPress={() => !disabled && onChange(!checked)}
        disabled={disabled}>
        <View
          style={[
            styles.iosBox,
            {
              borderColor: checked ? colors.primary : colors.textTertiary,
              backgroundColor: checked ? colors.primary : 'transparent',
              opacity: disabled ? 0.5 : 1,
            },
          ]}>
          {checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.label, {color: colors.text, fontSize: typo.fontSize.md}]}>
          {label}
        </Text>
      </Pressable>
      {showError && (
        <Text style={[styles.error, {color: colors.error}]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    flex: 1,
  },
  iosBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  error: {
    marginTop: 4,
    fontSize: 11,
  },
});
