import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabNavigator from '../components/common/BottomTabNavigator';
import Landing from '../pages/Landing';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Landing"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="Landing" component={Landing} />
      {/* UserCategory 추가 예정 */}
      <Stack.Screen name="Main" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
