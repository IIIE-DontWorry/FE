import React, {useEffect} from 'react';
import {ActivityIndicator, Alert, StyleSheet, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/MainNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Callback = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const {accessToken, isNew} = route.params as {
    accessToken: string;
    isNew: boolean;
  };

  useEffect(() => {
    const processLogin = async () => {
      try {
        // accessToken 저장
        await AsyncStorage.setItem('accessToken', accessToken);

        // isNew 값에 따라 분기 처리
        if (isNew) {
          Alert.alert('회원가입 필요', '추가 정보를 입력해주세요.');
          navigation.replace('UserCategory'); // 회원가입 플로우로 이동
        } else {
          Alert.alert('로그인 완료', '환영합니다!');
          navigation.replace('Home'); // 기존 회원은 홈으로 이동
        }
      } catch (error) {
        console.error('Error processing login:', error);
        Alert.alert('오류 발생', '로그인에 실패했습니다.');
        navigation.replace('Landing'); // 실패 시 Landing 페이지로
      }
    };

    processLogin();
  }, [accessToken, isNew, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00d6a3" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default Callback;
