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
import HeartIcon from '../../assets/category/heart.svg';

type RootStackParamList = {
  Landing: undefined;
  Main: undefined;
  UserCategory: undefined;
  ProtectorInfo: undefined;
  CaregiverInfo: undefined;
  AcquaintanceInfo: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type CategoryOption = '보호자' | '간병인' | '지인';

const UserCategory = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryOption | null>(null);

  const handleCategorySelect = (category: CategoryOption) => {
    setSelectedCategory(category);
    // 카테고리에 따라 다른 화면으로 이동
    if (category === '보호자') {
      navigation.navigate('ProtectorInfo');
    } else if (category === '간병인') {
      navigation.navigate('CaregiverInfo');
    } else {
      navigation.navigate('AcquaintanceInfo');
    }
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
