import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {ScreenWrapper} from '@/layout-components';
import {Button} from '@/base-components';
import {FormTextField} from '@/form-components';
import {useTheme} from '@/app/providers';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

export default function LoginScreen() {
  const {colors, typography: typo} = useTheme();

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {color: colors.text, fontSize: typo.fontSize.xxl},
          ]}>
          Welcome Back
        </Text>
        <Text style={{color: colors.textSecondary, marginTop: 4}}>
          Sign in to your Houseclay account
        </Text>
      </View>

      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={loginSchema}
        onSubmit={_values => {
          // Will integrate with authService
        }}>
        {({handleSubmit, isSubmitting}) => (
          <View style={styles.form}>
            <FormTextField
              name="email"
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <FormTextField
              name="password"
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
            />
            <Button
              label="Sign In"
              onPress={handleSubmit}
              isLoading={isSubmitting}
              style={{marginTop: 8}}
            />
          </View>
        )}
      </Formik>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingBottom: 32,
  },
  title: {
    fontWeight: '700',
  },
  form: {
    gap: 0,
  },
});
