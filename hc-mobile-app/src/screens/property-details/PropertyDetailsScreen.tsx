import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ScreenWrapper} from '@/layout-components';
import {Card, AppBar} from '@/design-system';
import {useTheme} from '@/app/providers';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import type {HomeStackParamList} from '@/app/Navigation';

interface PropertyDetailsScreenProps {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'PropertyDetails'>;
  route: RouteProp<HomeStackParamList, 'PropertyDetails'>;
}

export default function PropertyDetailsScreen({
  navigation,
  route,
}: PropertyDetailsScreenProps) {
  const {colors, typography: typo, spacing} = useTheme();
  const {id} = route.params;

  return (
    <View style={{flex: 1, backgroundColor: colors.background}}>
      <AppBar title="Property Details" onBackPress={() => navigation.goBack()} />
      <ScreenWrapper>
        <Card style={{marginTop: spacing.md}}>
          <Text
            style={[
              styles.title,
              {color: colors.text, fontSize: typo.fontSize.xl},
            ]}>
            Property #{id}
          </Text>
          <Text style={{color: colors.textSecondary, marginTop: spacing.sm}}>
            Property details, images, and pricing will be rendered here.
          </Text>
        </Card>
      </ScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
  },
});
