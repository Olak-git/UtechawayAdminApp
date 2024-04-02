/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { LogBox, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import persistStore from 'redux-persist/es/persistStore';
import store from './app/store';
import { ignoreLogs } from './functions/functions';
import GenerateView from './route/GenerateView';
import Orientation from 'react-native-orientation-locker';

// ignoreLogs();
LogBox.ignoreAllLogs();

Orientation.lockToPortrait();

let persistor = persistStore(store)

interface AppProps {
}

const App: React.FC<AppProps> = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GenerateView />
      </PersistGate>
    </Provider>
  );
};

export default App;
