import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../pages/HomeScreen';
import ReportScreen from '../pages/ReportScreen';
import GalleryScreen from '../pages/GalleryScreen';
import MessageScreen from '../pages/MessageScreen';
import TopNavigation from '../components/common/TopNavigationBar';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({route}) => {
          let title;
          if (route.name === 'Gallery') title = '갤러리';
          else if (route.name === 'Reports') title = '간병보고서';
          else if (route.name === 'Messages') title = '쪽지';
          return <TopNavigation title={title} />;
        },
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{header: () => <TopNavigation />}}
      />
      <Stack.Screen name="Reports" component={ReportScreen} />
      <Stack.Screen name="Gallery" component={GalleryScreen} />
      <Stack.Screen name="Messages" component={MessageScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
