import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabNavigator from '../components/common/BottomTabNavigator';
import Landing from '../pages/Landing';
import UserCategory from '../pages/UserCategory';
import ProtectorInfo from '../pages/ProtectorInfo';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Landing"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="UserCategory" component={UserCategory} />
      <Stack.Screen name="ProtectorInfo" component={ProtectorInfo} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
