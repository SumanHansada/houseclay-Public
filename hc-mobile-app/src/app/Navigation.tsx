import React from 'react';
import {Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@/app/providers';

import HomeScreen from '@/screens/home/HomeScreen';
import PropertySearchScreen from '@/screens/property-search/PropertySearchScreen';
import PropertyDetailsScreen from '@/screens/property-details/PropertyDetailsScreen';
import ListPropertyScreen from '@/screens/list-property/ListPropertyScreen';
import ManageAccountScreen from '@/screens/manage-account/ManageAccountScreen';
import LoginScreen from '@/screens/auth/LoginScreen';

export type HomeStackParamList = {
  Home: undefined;
  PropertyDetails: {id: string};
};

export type AuthStackParamList = {
  Login: undefined;
};

type RootTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  ListTab: undefined;
  AccountTab: undefined;
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen
        name="PropertyDetails"
        component={PropertyDetailsScreen}
      />
    </HomeStack.Navigator>
  );
}

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

function TabIcon({label, focused, color}: {label: string; focused: boolean; color: string}) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Search: '🔍',
    List: '📝',
    Account: '👤',
  };
  return (
    <>{/* Replace with vector icons in production */}</>
  );
}

export default function Navigation() {
  const {colors, isDark} = useTheme();
  const insets = useSafeAreaInsets();

  const isIOS = Platform.OS === 'ios';

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: isIOS
            ? colors.separator ?? 'rgba(0,0,0,0.1)'
            : colors.outlineVariant ?? 'rgba(0,0,0,0.1)',
          notification: colors.error,
        },
        fonts: {
          regular: {fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto', fontWeight: '400'},
          medium: {fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium', fontWeight: '500'},
          bold: {fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Bold', fontWeight: '700'},
          heavy: {fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto-Bold', fontWeight: '900'},
        },
      }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarStyle: {
            backgroundColor: isIOS ? colors.surface : colors.surfaceContainerHigh ?? colors.surface,
            borderTopColor: isIOS
              ? colors.separator ?? 'rgba(0,0,0,0.1)'
              : 'transparent',
            ...(Platform.OS === 'android' && {elevation: 8}),
          },
          tabBarLabelStyle: {
            fontSize: isIOS ? 10 : 12,
            fontWeight: '500',
          },
        }}>
        <Tab.Screen
          name="HomeTab"
          component={HomeStackNavigator}
          options={{tabBarLabel: 'Home'}}
        />
        <Tab.Screen
          name="SearchTab"
          component={PropertySearchScreen}
          options={{tabBarLabel: 'Search'}}
        />
        <Tab.Screen
          name="ListTab"
          component={ListPropertyScreen}
          options={{tabBarLabel: 'List'}}
        />
        <Tab.Screen
          name="AccountTab"
          component={ManageAccountScreen}
          options={{tabBarLabel: 'Account'}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
