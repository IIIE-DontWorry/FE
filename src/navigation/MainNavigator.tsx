import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabNavigator from '../components/common/BottomTabNavigator';
import Landing from '../pages/Landing/Landing';
import UserCategory from '../pages/UserCategory/UserCategory';
import Home from '../pages/Home/Home';
import Gallery from '../pages/Gallery/Gallery';
import Report from '../pages/Report/Report';
import Message from '../pages/Message/Message';
import ProtectorInfo from '../pages/Info/ProtectorInfo';
import CaregiverInfo from '../pages/Info/CaregiverInfo';
import AcquaintanceInfo from '../pages/Info/AcquaintanceInfo';
import ReportDetail from '../pages/Report/ReportDetail';
import ReportCreate from '../pages/Report/ReportCreate';
import ReportUpdate from '../pages/Report/ReportUpdate';
import Callback from '../pages/Auth/Callback';
import ProtectorMypage from '../pages/Mypage/ProtectorMyPage';
import CaregiverMypage from '../pages/Mypage/CaregiverMypage';
import AcquaintanceMypage from '../pages/Mypage/AcquaintanceMypage';

// RootStackParamList 타입 정의
export type RootStackParamList = {
  Landing: undefined;
  Main: undefined;
  UserCategory: undefined;
  ProtectorInfo: {
    scrollTo?: 'patientInfo' | 'medicineInfo';
  } | undefined;
  CaregiverInfo: {
    readOnly?: boolean;
  } | undefined;
  AcquaintanceInfo: undefined;
  ReportCreate: undefined;
  ReportDetail: undefined;
  ReportUpdate: undefined;
  Gallery: undefined;
  Home: undefined;
  Report: undefined;
  Message: undefined;
  Callback: {code: string} | undefined; // Callback 추가
  ProtectorMypage: undefined;
  CaregiverMypage: undefined;
  AcquaintanceMypage: undefined;
};

// Stack Navigator 생성
const Stack = createStackNavigator<RootStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="UserCategory" component={UserCategory} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Gallery" component={Gallery} />
      <Stack.Screen name="Report" component={Report} />
      <Stack.Screen name="Message" component={Message} />
      <Stack.Screen name="ReportCreate" component={ReportCreate} />
      <Stack.Screen name="ReportDetail" component={ReportDetail} />
      <Stack.Screen name="ReportUpdate" component={ReportUpdate} />
      <Stack.Screen name="ProtectorInfo" component={ProtectorInfo} />
      <Stack.Screen name="CaregiverInfo" component={CaregiverInfo} />
      <Stack.Screen name="AcquaintanceInfo" component={AcquaintanceInfo} />
      <Stack.Screen name="Callback" component={Callback} />
      <Stack.Screen name="ProtectorMypage" component={ProtectorMypage} />
      <Stack.Screen name="CaregiverMypage" component={CaregiverMypage} />
      <Stack.Screen name="AcquaintanceMypage" component={AcquaintanceMypage} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
