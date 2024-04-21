/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Appearance,
  StatusBar,
} from 'react-native';
import MainScreen from './screens/main/MainScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import styles from './utils/styleSheet';

function App(): React.JSX.Element {
  Appearance.setColorScheme("dark");

  return (
    <SafeAreaProvider>
      <StatusBar
        animated={true}
        backgroundColor={styles.colors.lightPurple}
      />
      <MainScreen />
    </SafeAreaProvider>
  );
}

export default App;
