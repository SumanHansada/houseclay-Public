import React from 'react';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {useTheme} from '@/app/providers';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label?: string;
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
  error?: string;
  touched?: boolean;
}

export default function RadioGroup({
  label,
  options,
  value,
  onChange,
  error,
  touched,
}: RadioGroupProps) {
  const {colors, typography: typo} = useTheme();
  const showError = touched && !!error;

  if (Platform.OS === 'android') {
    return (
      <View style={styles.container}>
        {label && (
          <Text style={[styles.groupLabel, {color: colors.textSecondary}]}>
            {label}
          </Text>
        )}
        <RadioButton.Group
          onValueChange={onChange}
          value={value ?? ''}>
          {options.map(opt => (
            <RadioButton.Item
              key={opt.value}
              label={opt.label}
              value={opt.value}
              labelStyle={{color: colors.text, fontSize: typo.fontSize.md}}
            />
          ))}
        </RadioButton.Group>
        {showError && (
          <Text style={[styles.error, {color: colors.error}]}>{error}</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.groupLabel, {color: colors.textSecondary}]}>
          {label}
        </Text>
      )}
      {options.map(opt => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            style={styles.iosRow}
            onPress={() => onChange(opt.value)}>
            <View
              style={[
                styles.iosRadio,
                {borderColor: selected ? colors.primary : colors.textTertiary},
              ]}>
              {selected && (
                <View
                  style={[styles.iosDot, {backgroundColor: colors.primary}]}
                />
              )}
            </View>
            <Text style={[styles.optionLabel, {color: colors.text, fontSize: typo.fontSize.md}]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
      {showError && (
        <Text style={[styles.error, {color: colors.error}]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  groupLabel: {
    marginBottom: 8,
    fontWeight: '500',
    fontSize: 13,
  },
  iosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iosRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iosDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionLabel: {
    marginLeft: 10,
  },
  error: {
    marginTop: 4,
    fontSize: 11,
  },
});
