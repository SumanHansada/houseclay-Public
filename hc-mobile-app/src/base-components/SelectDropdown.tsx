import React, {useState} from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import {useTheme} from '@/app/providers';

interface Option {
  label: string;
  value: string;
}

interface SelectDropdownProps {
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  error?: string;
  touched?: boolean;
  containerStyle?: ViewStyle;
}

export default function SelectDropdown({
  label,
  placeholder = 'Select...',
  options,
  value,
  onChange,
  error,
  touched,
  containerStyle,
}: SelectDropdownProps) {
  const {colors, typography: typo, spacing, borderRadius: br} = useTheme();
  const [visible, setVisible] = useState(false);
  const showError = touched && !!error;
  const selectedOption = options.find(o => o.value === value);

  const borderColor = showError
    ? colors.error
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
      <Pressable
        onPress={() => setVisible(true)}
        style={[
          styles.trigger,
          {
            borderColor,
            borderRadius: br.sm,
            paddingHorizontal: spacing.md,
            paddingVertical: Platform.OS === 'ios' ? 12 : 14,
            backgroundColor:
              Platform.OS === 'android'
                ? colors.surfaceVariant ?? colors.surface
                : 'transparent',
          },
        ]}>
        <Text
          style={{
            color: selectedOption ? colors.text : colors.textTertiary,
            fontSize: typo.fontSize.md,
          }}>
          {selectedOption?.label ?? placeholder}
        </Text>
        <Text style={{color: colors.textTertiary, fontSize: 12}}>▼</Text>
      </Pressable>

      {showError && (
        <Text style={[styles.error, {color: colors.error, fontSize: typo.fontSize.xs}]}>
          {error}
        </Text>
      )}

      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View
            style={[
              styles.dropdown,
              {
                backgroundColor: colors.surface,
                borderRadius: br.md,
              },
            ]}>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && {
                      backgroundColor: colors.primary + '15',
                    },
                  ]}
                  onPress={() => {
                    onChange(item.value);
                    setVisible(false);
                  }}>
                  <Text
                    style={{
                      color:
                        item.value === value ? colors.primary : colors.text,
                      fontSize: typo.fontSize.md,
                      fontWeight: item.value === value ? '600' : '400',
                    }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
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
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  error: {
    marginTop: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 32,
  },
  dropdown: {
    maxHeight: 320,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
});
