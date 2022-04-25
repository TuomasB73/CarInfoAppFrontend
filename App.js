import React from 'react';
import {MainProvider} from './contexts/MainContext';
import Navigator from './navigators/Navigator';
import 'react-native-gesture-handler';

const App = () => {
  return (
    <MainProvider>
      <Navigator />
    </MainProvider>
  );
};

export default App;
