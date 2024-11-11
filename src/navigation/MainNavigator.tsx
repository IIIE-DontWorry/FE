import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../pages/HomeScreen';
import ReportScreen from '../pages/ReportScreen';
import GalleryScreen from '../pages/GalleryScreen';
import MessageScreen from '../pages/MessageScreen';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Reports" component={ReportScreen} />
      <Stack.Screen name="Gallery" component={GalleryScreen} />
      <Stack.Screen name="Messages" component={MessageScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
