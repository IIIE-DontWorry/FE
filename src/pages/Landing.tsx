import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LogoSvg from '../assets/landing/logo.svg';
const { width, height } = Dimensions.get('window');

// 네비게이션 타입 정의
type RootStackParamList = {
  Landing: undefined;
  Main: undefined;
  UserCategory: undefined;  // UserCategory 스크린 타입 추가
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;



const Landing = () => {
  const handleKakaoLogin = () => {
    //추후 카카오 로그인 로직 구현
    console.log('카카오 로그인 시도');
    // 일단 UserCategory 화면으로 이동
    navigation.navigate('UserCategory');
  };

  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 로고 영역 */}
        <View style={styles.logoContainer}>
          <LogoSvg width={width * 0.6} height={width * 0.6} />
        </View>
        
        {/* 텍스트 영역 */}
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>늘 당신 곁에</Text>
          <Text style={styles.brandText}>돈워리</Text>
        </View>

        {/* 로그인 버튼 영역 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.kakaoButton}
            onPress={handleKakaoLogin}
          >
            <Image
              source={require('../assets/landing/kakaoLogin.png')}
              style={styles.kakaoButtonImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.1,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: height * 0.05,
  },
  mainText: {
    fontSize: 24,
    color: '#000000',
    marginBottom: 8,
  },
  brandText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: height * 0.05,
  },
  kakaoButton: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kakaoButtonImage: {
    width: '100%',
    height: '100%',
  },
});

export default Landing;