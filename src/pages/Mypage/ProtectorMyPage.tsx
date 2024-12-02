import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import {Clipboard, TouchableOpacity} from 'react-native';
import TopNavigationBar from '../../components/common/TopNavigationBar';
import {useUser} from '../../store/UserContext';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/MainNavigator';
import ApiService from '../../utils/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

//상단에 미니 프로필을 위한 api 연결
interface ApiResponse {
  status: string;
  message: string;
  data: {
    guardianInfo: {
      name: string;
      phone: string;
      address: string;
    };
    patientInfo: {
      name: string;
      age: number;
      diseaseName: string;
      hospitalName: string;
      medicationInfos: any[];
    };
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

const CodeSection = styled.View`
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
  margin: 16px;
`;

const CodeTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
`;

const CodeText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #00d6a3;
  margin-bottom: 15px;
  letter-spacing: 2px;
`;

const CopyButton = styled.TouchableOpacity`
  background-color: #00d6a3;
  padding: 10px 20px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
`;

const CopyButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
`;


const ProtectorMypage = () => {
  const navigation = useNavigation<NavigationProp>();
  const {protectorData} = useUser();//유저컨텍스트
  const copyToClipboard = async (code: string) => {
    try {
      await Clipboard.setString(code);
      // 복사 완료 알림
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const [profileData, setProfileData] = useState<ApiResponse['data'] | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await ApiService.get('/guardian/myPage/1');
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);


  return (
    <Container>
      <TopNavigationBar title="보호자 프로필" />
      <ScrollContainer>
        <ProfileSection>
          <ProfileImage />
          <ProfileInfo>
            <ProfileName>
              {profileData?.guardianInfo?.name || '이름 없음'}
            </ProfileName>
            <ProfileContact>
              {profileData ? 
                `${profileData.patientInfo.name}(${profileData.patientInfo.age})님의 보호자\n${profileData.guardianInfo.phone}` 
                : '정보 없음'}
            </ProfileContact>
          </ProfileInfo>
        </ProfileSection>

        <CodeSection>
          <CodeTitle>보호자 매칭 코드</CodeTitle>
          <CodeText>F3Rr102A</CodeText>
          <CopyButton onPress={() => copyToClipboard('F3Rr102A')}>
            <CopyButtonText>복사하기</CopyButtonText>
          </CopyButton>
        </CodeSection>

        <MenuSection>
          <MenuTitle>보호자와 환자 관리</MenuTitle>
          <MenuItem onPress={() => navigation.navigate('ViewProtectorProfile')}>
            <MenuText>보호자와 환자 프로필 조회</MenuText>
          </MenuItem>
          <MenuItem onPress={() => navigation.navigate('EditProtectorProfile')}>
            <MenuText>보호자와 환자 프로필 수정</MenuText>
          </MenuItem>
        </MenuSection>

        <MenuSection>
          <MenuTitle>간병인 관리</MenuTitle>
          <MenuItem
            onPress={() =>
              navigation.navigate('ViewCaregiverProfile')
            }>
            <MenuText>간병인 프로필 조회</MenuText>
          </MenuItem>
          {/*
          <MenuItem>
           기능 구현 질문 없으면 지우고 
            <MenuText>간병인 평가</MenuText>
          </MenuItem>
          */}
        </MenuSection>

        {/* <MenuSection>
          <MenuTitle>갤러리</MenuTitle>
          <MenuItem>
            <MenuText>사진 전체 다운로드</MenuText>
          </MenuItem>
          <MenuItem>
            <MenuText>최근 삭제한 사진</MenuText>
          </MenuItem>
        </MenuSection> */}

        <MenuSection>
          <MenuTitle>설정</MenuTitle>
          <MenuItem>
            <MenuText>글씨체</MenuText>
          </MenuItem>
          <MenuItem onPress={() => navigation.navigate('DeleteProtectorAccount')}>
            <MenuText>계정 탈퇴</MenuText>
          </MenuItem>
        </MenuSection>

              

      </ScrollContainer>
    </Container>
  );
};

export default ProtectorMypage;
