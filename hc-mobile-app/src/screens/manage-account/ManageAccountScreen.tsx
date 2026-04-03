import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ScreenWrapper} from '@/layout-components';
import {Button} from '@/base-components';
import {useTheme} from '@/app/providers';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {logout} from '@/store';

export default function ManageAccountScreen() {
  const {colors, typography: typo} = useTheme();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {color: colors.text, fontSize: typo.fontSize.xl},
          ]}>
          Account
        </Text>
      </View>
      {isAuthenticated ? (
        <View style={styles.section}>
          <Text style={{color: colors.textSecondary, marginBottom: 16}}>
            Manage your profile, saved properties, and preferences
          </Text>
          <Button
            label="Sign Out"
            variant="outline"
            onPress={() => dispatch(logout())}
          />
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={{color: colors.textSecondary, marginBottom: 16}}>
            Sign in to access your account
          </Text>
          <Button label="Sign In" onPress={() => {}} />
        </View>
      )}
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
  section: {
    paddingTop: 8,
  },
});
