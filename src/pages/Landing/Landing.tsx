import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LogoSvg from '../../assets/landing/logo.svg';
import {RootStackParamList} from '../../navigation/MainNavigator';

const {width, height} = Dimensions.get('window');

const Landing = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // const handleKakaoLogin = () => {
  //   const clientId = '77570be15ef8457bbb27ffc965017a74'; // 카카오 REST API 키
  //   const redirectUri = 'http://{베이스url}/callback'; // 콜백 URL
  //   const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

  //   // 카카오 로그인 URL로 리다이렉트
  //   Linking.openURL(kakaoAuthUrl).catch(err =>
  //     console.error('An error occurred during Kakao Login:', err),
  //   );
  // };
  const handleKakaoLogin = () => {
    //추후 카카오 로그인 로직 구현
    console.log('카카오 로그인 시도');
    // 일단 UserCategory 화면으로 이동
    navigation.navigate('UserCategory');
  };
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
            onPress={handleKakaoLogin}>
            <Image
              source={require('../../assets/landing/kakaoLogin.png')}
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
