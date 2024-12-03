import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useUser} from '../../store/UserContext';
import HeartIcon from '../../assets/category/heart.svg';
import {RootStackParamList} from '../../navigation/MainNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type CategoryOption = '보호자' | '간병인' | '지인';
type RouteProp = {
  params: {
    kakaoAccessToken: string;
  };
};

const UserCategory = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>(); // useRoute 훅으로 kakaoAccessToken 가져오기
  const {kakaoAccessToken} = route.params; // route.params에서 kakaoAccessToken 추출
  const {setUserType} = useUser();
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryOption | null>(null);

  const handleCategorySelect = (category: CategoryOption) => {
    setUserType(category); // 선택한 카테고리를 UserContext에 설정

    const targetScreen =
      category === '보호자'
        ? 'ProtectorInfo'
        : category === '간병인'
        ? 'CaregiverInfo'
        : 'AcquaintanceInfo';

    // 선택한 카테고리와 kakaoAccessToken 전달
    navigation.navigate(targetScreen, {kakaoAccessToken});
  };

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
