import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';
import TopNavigationBar from '../../components/common/TopNavigationBar';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/MainNavigator';
import ApiService from '../../utils/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ApiResponse {
  status: string;
  message: string;
  data: {
    name: string;
    phone: string;
    hospital: string;
    patientName: string;
    careerHistories: { career: string }[];
  };
}

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const ScrollContainer = styled.ScrollView`
  flex: 1;
`;

const ProfileSection = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  margin-bottom: 10px;
`;

const ProfileImage = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #f0f0f0;
  margin-right: 15px;
`;

const ProfileInfo = styled.View`
  flex: 1;
`;

const ProfileName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const ProfileContact = styled.Text`
  color: #666;
  font-size: 14px;
`;

const MenuSection = styled.View`
  background-color: #fff;
  margin-bottom: 10px;
  padding: 15px 0;
`;

const MenuTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  padding: 0 20px 10px 20px;
`;

const MenuItem = styled.TouchableOpacity`
  padding: 15px 20px;
`;

const MenuText = styled.Text`
  font-size: 16px;
  color: #333;
`;

const CaregiverMyPage = () => {
  const navigation = useNavigation<NavigationProp>();
  const [profileData, setProfileData] = useState<ApiResponse['data'] | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await ApiService.get('/care-givers/myPage/1'); // caregiverId는 실제 값으로 대체 필요
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);
  
  return (
    <Container>
      <TopNavigationBar title="간병인 프로필" />
      <ScrollContainer>
        <ProfileSection>
          <ProfileImage />
          <ProfileInfo>
            <ProfileName>
              {profileData?.name || '이름 없음'}
            </ProfileName>
            <ProfileContact>
              {profileData? `${profileData.patientName}님의 간병인\n${profileData.phone}`: '정보 없음'}
            </ProfileContact>
          </ProfileInfo>
        </ProfileSection>

        <MenuSection>
          <MenuTitle>간병인 관리</MenuTitle>
          <MenuItem onPress={() => navigation.navigate('Caregiver_ViewCaregiverProfile')}>
            <MenuText>간병인 프로필 조회</MenuText>
          </MenuItem>
          <MenuItem onPress={() => navigation.navigate('EditCaregiverProfile')}>
            <MenuText>간병인 프로필 수정</MenuText>
          </MenuItem>
        </MenuSection>

        <MenuSection>
          <MenuTitle>보호자와 환자 관리</MenuTitle>
          <MenuItem onPress={() => navigation.navigate('Caregiver_ViewProtectorProfile')}>
            <MenuText>보호자와 환자 프로필 조회</MenuText>
          </MenuItem>
        </MenuSection>

        <MenuSection>
          <MenuTitle>갤러리</MenuTitle>
          <MenuItem>
            <MenuText>사진 전체 다운로드</MenuText>
          </MenuItem>
          <MenuItem>
            <MenuText>최근 삭제한 사진</MenuText>
          </MenuItem>
        </MenuSection>

        <MenuSection>
          <MenuTitle>설정</MenuTitle>
          <MenuItem>
            <MenuText>글씨 크기 변경</MenuText>
          </MenuItem>
          <MenuItem onPress={() => navigation.navigate('DeleteCaregiverAccount')}>
            <MenuText>계정 탈퇴</MenuText>
          </MenuItem>
        </MenuSection>
      </ScrollContainer>
    </Container>
  );
};

export default CaregiverMyPage;
