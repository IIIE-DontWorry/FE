import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabNavigator from '../components/common/BottomTabNavigator';
import Landing from '../pages/Landing/Landing';
import UserCategory from '../pages/UserCategory/UserCategory';
import HomeScreen from '../pages/Home/Home';
import GalleryScreen from '../pages/Gallery/Gallery';
import ReportScreen from '../pages/Report/Report';
import MessageScreen from '../pages/Message/Message';
import ReportCreate from '../pages/Report/ReportCreate';
import ProtectorInfo from '../pages/Info/ProtectorInfo';
import CaregiverInfo from '../pages/Info/CaregiverInfo';
import AcquaintanceInfo from '../pages/Info/AcquaintanceInfo';

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
      <Stack.Screen name="AcquaintanceInfo" component={AcquaintanceInfo} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
