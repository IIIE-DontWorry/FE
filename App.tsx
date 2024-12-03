import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import styled from 'styled-components/native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ReportProvider} from './src/store/ReportContext'; // Context 추가
import {MessageProvider} from './src/store/MessageContext';
import {UserProvider} from './src/store/UserContext';
import {FontSizeProvider} from './src/store/FontSizeContext';
import {UserTypeProvider} from './src/store/UserTypeContext';
const AppContainer = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const App = () => {
  useEffect(() => {
    // stickyImmersive 모드로 설정
    SystemNavigationBar.stickyImmersive();
  }, []);

  return (
    <SafeAreaProvider>
      <AppContainer>
        <FontSizeProvider>
          <UserProvider>
            <UserTypeProvider>
              <ReportProvider>
                <MessageProvider>
                  <NavigationContainer>
                    <MainNavigator />
                  </NavigationContainer>
                </MessageProvider>
              </ReportProvider>
            </UserTypeProvider>
          </UserProvider>
        </FontSizeProvider>
      </AppContainer>
    </SafeAreaProvider>
  );
};

export default App;
