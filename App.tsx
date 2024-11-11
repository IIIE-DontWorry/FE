// App.tsx

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import styled from 'styled-components/native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const AppContainer = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const App = () => {
  useEffect(() => {
    // stickyImmersive 모드로 설정하여 시스템 UI를 숨기고 터치 시 표시되게 함
    SystemNavigationBar.stickyImmersive();
  }, []);

  return (
    <SafeAreaProvider>
      <AppContainer>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </AppContainer>
    </SafeAreaProvider>
  );
};

export default App;
