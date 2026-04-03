import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ScreenWrapper} from '@/layout-components';
import {TextField} from '@/base-components';
import {useTheme} from '@/app/providers';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {setSearchQuery} from '@/store';

export default function PropertySearchScreen() {
  const {colors, typography: typo} = useTheme();
  const dispatch = useAppDispatch();
  const query = useAppSelector(state => state.propertySearch.query);

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {color: colors.text, fontSize: typo.fontSize.xl},
          ]}>
          Search Properties
        </Text>
      </View>
      <TextField
        label="Location or keyword"
        placeholder="e.g. Koramangala, 2BHK..."
        value={query}
        onChangeText={(text: string) => dispatch(setSearchQuery(text))}
      />
      <View style={styles.placeholder}>
        <Text style={{color: colors.textTertiary}}>
          Property listings will appear here
        </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontWeight: '700',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
});
