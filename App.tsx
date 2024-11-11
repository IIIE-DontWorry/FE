import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import styled from 'styled-components/native';
import {enableScreens} from 'react-native-screens';

enableScreens();

const AppContainer = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const App = () => {
  return (
    <AppContainer>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </AppContainer>
  );
};

export default App;
