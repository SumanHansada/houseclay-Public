import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ScreenWrapper} from '@/layout-components';
import {useTheme} from '@/app/providers';

export default function ListPropertyScreen() {
  const {colors, typography: typo} = useTheme();

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {color: colors.text, fontSize: typo.fontSize.xl},
          ]}>
          List Your Property
        </Text>
        <Text style={{color: colors.textSecondary, marginTop: 4}}>
          Multi-step property listing form will be built here
        </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
  },
  title: {
    fontWeight: '700',
  },
});
