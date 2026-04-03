import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StoreProvider, QueryProvider, ThemeProvider} from '@/app/providers';
import Navigation from '@/app/Navigation';

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StoreProvider>
          <QueryProvider>
            <ThemeProvider>
              <Navigation />
            </ThemeProvider>
          </QueryProvider>
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
