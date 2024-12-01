// src/pages/UserCategory.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeartIcon from '../../assets/category/heart.svg';

import {RootStackParamList} from '../../navigation/MainNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type CategoryOption = '보호자' | '간병인' | '지인';

const UserCategory = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryOption | null>(null);

  const handleCategorySelect = async (category: CategoryOption) => {
    try {
      await AsyncStorage.setItem('userType', category); // 사용자 타입 저장
      if (category === '보호자') {
        navigation.navigate('ProtectorInfo');
      } else if (category === '간병인') {
        navigation.navigate('CaregiverInfo');
      } else {
        navigation.navigate('AcquaintanceInfo');
      }
    } catch (error) {
      console.error('Error saving user type:', error);
    }
  };
  //카카오 로그인 로직. 해당 액세스 토큰을 해당 카테고리 페이지로 async를 통해 상태 저장
  // const handleCategorySelect = async (category: CategoryOption) => {
  //   try {
  //     await AsyncStorage.setItem('userType', category);
  //     if (category === '보호자') {
  //       navigation.navigate('ProtectorInfo', {accessToken});
  //     } else if (category === '간병인') {
  //       navigation.navigate('CaregiverInfo', {accessToken});
  //     } else {
  //       navigation.navigate('AcquaintanceInfo', {accessToken});
  //     }
  //   } catch (error) {
  //     Alert.alert('에러', '선택 저장 중 문제가 발생했습니다.');
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>어떻게 오셨나요?</Text>

        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => handleCategorySelect('보호자')}>
            <HeartIcon width={60} height={60} fill="#00E6AC" />
            <Text style={styles.categoryText}>보호자</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => handleCategorySelect('간병인')}>
            <HeartIcon width={60} height={60} fill="#D0FF36" />
            <Text style={styles.categoryText}>간병인</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => handleCategorySelect('지인')}>
            <HeartIcon width={60} height={60} fill="#14AE5C" />
            <Text style={styles.categoryText}>지인</Text>
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
    alignItems: 'center',
    paddingTop: 100,
  },
  title: {
    fontSize: 24,
    marginBottom: 60,
  },
  categoryContainer: {
    alignItems: 'center',
    gap: 40,
  },
  categoryButton: {
    alignItems: 'center',
  },
  categoryText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default UserCategory;
