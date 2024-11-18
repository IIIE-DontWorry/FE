import React, {useEffect} from 'react';
import {View, Text, ActivityIndicator, Alert, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/MainNavigator';

const Callback = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();

  const {code} = route.params || {};

  useEffect(() => {
    const fetchKakaoToken = async () => {
      if (!code) {
        Alert.alert('Error', '로그인 코드가 제공되지 않았습니다.');
        navigation.navigate('Landing');
        return;
      }

      try {
        // 서버로 로그인 코드 전송
        const response = await axios.post(
          'http://{서버 베이스 URL}/auth/kakao',
          {
            code,
          },
        );

        const {accessToken, isNew} = response.data;

        if (isNew) {
          // 신규 회원: 사용자 유형 선택 페이지로 이동
          navigation.replace('UserCategory', {accessToken});
        } else {
          // 기존 회원: 메인 페이지로 이동
          navigation.replace('Main');
        }
      } catch (error) {
        console.error('로그인 처리 중 오류 발생:', error);
        Alert.alert('Error', '로그인 처리 중 오류가 발생했습니다.');
        navigation.navigate('Landing');
      }
    };

    fetchKakaoToken();
  }, [code, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00E6AC" />
      <Text style={styles.text}>로그인 처리 중...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

export default Callback;
