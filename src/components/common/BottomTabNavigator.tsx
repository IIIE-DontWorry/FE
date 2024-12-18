// src/components/common/BottomTabNavigator.tsx
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import Home from '../../pages/Home/Home';
import Report from '../../pages/Report/Report';
import Gallery from '../../pages/Gallery/Gallery';
import Message from '../../pages/Message/Message';
import TopNavigationBar from './TopNavigationBar';

// SVG 아이콘 컴포넌트
import HomeIcon from '../../assets/bottomnavigation/home.svg';
import ReportIcon from '../../assets/bottomnavigation/report.svg';
import GalleryIcon from '../../assets/bottomnavigation/gallery.svg';
import MessageIcon from '../../assets/bottomnavigation/message.svg';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let IconComponent;
          if (route.name === 'Home') IconComponent = HomeIcon;
          else if (route.name === 'Report') IconComponent = ReportIcon;
          else if (route.name === 'Gallery') IconComponent = GalleryIcon;
          else if (route.name === 'Message') IconComponent = MessageIcon;

          return IconComponent ? (
            <IconComponent width={24} height={24} />
          ) : null;
        },
        tabBarLabel: ({focused}) => {
          let label;
          if (route.name === 'Home') label = '홈';
          else if (route.name === 'Report') label = '간병 보고서';
          else if (route.name === 'Gallery') label = '갤러리';
          else if (route.name === 'Message') label = '쪽지';

          return (
            <Text style={{color: focused ? '#000' : '#888'}}>{label}</Text>
          );
        },
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 70, // 높이 조정
          paddingBottom: 10, // 하단 패딩 추가
        },
        header: () => {
          let title = '';
          if (route.name === 'Report') title = '간병 보고서';
          else if (route.name === 'Gallery') title = '갤러리';
          else if (route.name === 'Message') title = '쪽지';

          return <TopNavigationBar title={title} />;
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Report" component={Report} />
      <Tab.Screen name="Gallery" component={Gallery} />
      <Tab.Screen name="Message" component={Message} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
