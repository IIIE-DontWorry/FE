import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LogoSvg from '../../assets/landing/logo.svg';
import {RootStackParamList} from '../../navigation/MainNavigator';

const {width, height} = Dimensions.get('window');

const Landing = () => {
  const [showWebView, setShowWebView] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleKakaoLogin = () => {
    setShowWebView(true); // 웹뷰 열기
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);

      if (message.status === 'success' && message.data) {
        const kakaoAccessToken = message.data;

        setShowWebView(false);
        navigation.navigate('UserCategory', {kakaoAccessToken});
      } else {
        console.error('Failed to extract Kakao access token from WebView.');
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  if (showWebView) {
    return (
      <WebView
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?client_id=77570be15ef8457bbb27ffc965017a74&redirect_uri=http://52.78.188.251/callback&response_type=code`,
        }}
        injectedJavaScript={`
          setTimeout(() => {
            const content = document.body.innerText;
            if (content) {
              window.ReactNativeWebView.postMessage(content);
            }
          }, 500);
        `}
        onMessage={handleWebViewMessage}
        style={{flex: 1}}
      />
    );
  }

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
          <TouchableOpacity onPress={handleKakaoLogin}>
            <Image
              source={require('../../assets/landing/kakaoLogin.png')}
              style={styles.kakaoButtonImage}
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
  kakaoButtonImage: {
    width: '100%',
    height: 48,
    resizeMode: 'contain',
  },
});

export default Landing;
