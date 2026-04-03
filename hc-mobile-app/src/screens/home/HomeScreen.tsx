import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ScreenWrapper} from '@/layout-components';
import {Card} from '@/design-system';
import {Button} from '@/base-components';
import {useTheme} from '@/app/providers';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '@/app/Navigation';

interface HomeScreenProps {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Home'>;
}

export default function HomeScreen({navigation}: HomeScreenProps) {
  const {colors, typography: typo, spacing} = useTheme();

  return (
    <ScreenWrapper>
      <View style={styles.hero}>
        <Text
          style={[
            styles.title,
            {color: colors.text, fontSize: typo.fontSize.display},
          ]}>
          Houseclay
        </Text>
        <Text
          style={[
            styles.subtitle,
            {color: colors.textSecondary, fontSize: typo.fontSize.lg},
          ]}>
          Find your perfect home
        </Text>
      </View>

      <Card style={{marginTop: spacing.lg}}>
        <Text style={[styles.cardTitle, {color: colors.text}]}>
          Search Properties
        </Text>
        <Text style={{color: colors.textSecondary, marginBottom: spacing.md}}>
          Browse rental and resale properties near you
        </Text>
        <Button
          label="Start Searching"
          onPress={() => navigation.navigate('PropertyDetails', {id: 'demo'})}
        />
      </Card>

      <Card style={{marginTop: spacing.md}}>
        <Text style={[styles.cardTitle, {color: colors.text}]}>
          List Your Property
        </Text>
        <Text style={{color: colors.textSecondary}}>
          Reach thousands of potential buyers and tenants
        </Text>
      </Card>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 24,
    paddingBottom: 8,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
});
