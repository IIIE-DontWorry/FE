import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabNavigator from '../components/common/BottomTabNavigator';
import Landing from '../pages/Landing';
import UserCategory from '../pages/UserCategory';
import HomeScreen from '../pages/Home';
import GalleryScreen from '../pages/Gallery';
import ReportScreen from '../pages/Report';
import MessageScreen from '../pages/Message';
import ReportCreate from '../pages/ReportCreate';
import ProtectorInfo from '../pages/ProtectorInfo';
import CaregiverInfo from '../pages/CaregiverInfo';
const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="UserCategory" component={UserCategory} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Gallery" component={GalleryScreen} />
      <Stack.Screen name="Reports" component={ReportScreen} />
      <Stack.Screen name="Messages" component={MessageScreen} />
      <Stack.Screen name="ReportCreate" component={ReportCreate} />
      <Stack.Screen name="ProtectorInfo" component={ProtectorInfo} />
      <Stack.Screen name="CaregiverInfo" component={CaregiverInfo} />
    </Stack.Navigator>
  );
};

export default MainNavigator;