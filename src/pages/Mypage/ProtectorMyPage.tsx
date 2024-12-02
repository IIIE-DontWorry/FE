import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Clipboard, TouchableOpacity } from 'react-native';
import TopNavigationBar from '../../components/common/TopNavigationBar';
import { useUser } from '../../store/UserContext';
import { useFontSize } from '../../store/FontSizeContext'; // FontSizeContext 추가
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import ApiService from '../../utils/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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

interface FontSizeProps {
  fontSizes: number[];
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

const ProfileName = styled.Text<FontSizeProps>`
  font-size: ${({ fontSizes }) => fontSizes[3]}px; /* 기본 18px */
  font-weight: bold;
  margin-bottom: 5px;
`;

const ProfileContact = styled.Text<FontSizeProps>`
  color: #666;
  font-size: ${({ fontSizes }) => fontSizes[1]}px; /* 기본 14px */
`;

const MenuSection = styled.View`
  background-color: #fff;
  margin-bottom: 10px;
  padding: 15px 0;
`;

const MenuTitle = styled.Text<FontSizeProps>`
  font-size: ${({ fontSizes }) => fontSizes[2]}px; /* 기본 16px */
  font-weight: bold;
  padding: 0 20px 10px 20px;
`;

const MenuItemContainer = styled.TouchableOpacity`
  padding: 15px 20px;
  background-color: #fff;
`;

const MenuText = styled.Text<FontSizeProps>`
  font-size: ${({ fontSizes }) => fontSizes[2]}px; /* 기본 16px */
  color: #333;
`;

const CodeSection = styled.View`
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
  margin: 16px;
`;

const CodeTitle = styled.Text<FontSizeProps>`
  font-size: ${({ fontSizes }) => fontSizes[3]}px; /* 기본 18px */
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
`;

const CodeText = styled.Text<FontSizeProps>`
  font-size: ${({ fontSizes }) => fontSizes[5]}px; /* 기본 24px */
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

const CopyButtonText = styled.Text<FontSizeProps>`
  color: #ffffff;
  font-size: ${({ fontSizes }) => fontSizes[2]}px; /* 기본 16px */
`;

const ProtectorMypage = () => {
  const navigation = useNavigation<NavigationProp>();
  const { protectorData } = useUser(); // 유저컨텍스트
  const { fontSizes } = useFontSize(); // 폰트 크기 가져오기
  const [profileData, setProfileData] = useState<ApiResponse['data'] | null>(null);

  const copyToClipboard = async (code: string) => {
    try {
      await Clipboard.setString(code);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

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
            <ProfileName fontSizes={fontSizes}>
              {profileData?.guardianInfo?.name || '이름 없음'}
            </ProfileName>
            <ProfileContact fontSizes={fontSizes}>
              {profileData
                ? `${profileData.patientInfo.name}(${profileData.patientInfo.age})님의 보호자\n${profileData.guardianInfo.phone}`
                : '정보 없음'}
            </ProfileContact>
          </ProfileInfo>
        </ProfileSection>

        <CodeSection>
          <CodeTitle fontSizes={fontSizes}>보호자 매칭 코드</CodeTitle>
          <CodeText fontSizes={fontSizes}>F3Rr102A</CodeText>
          <CopyButton onPress={() => copyToClipboard('F3Rr102A')}>
            <CopyButtonText fontSizes={fontSizes}>복사하기</CopyButtonText>
          </CopyButton>
        </CodeSection>

        <MenuSection>
          <MenuTitle fontSizes={fontSizes}>보호자와 환자 관리</MenuTitle>
          <MenuItemContainer onPress={() => navigation.navigate('ViewProtectorProfile')}>
            <MenuText fontSizes={fontSizes}>보호자와 환자 프로필 조회</MenuText>
          </MenuItemContainer>
          <MenuItemContainer onPress={() => navigation.navigate('EditProtectorProfile')}>
            <MenuText fontSizes={fontSizes}>보호자와 환자 프로필 수정</MenuText>
          </MenuItemContainer>
        </MenuSection>

        <MenuSection>
          <MenuTitle fontSizes={fontSizes}>간병인 관리</MenuTitle>
          <MenuItemContainer onPress={() => navigation.navigate('ViewCaregiverProfile')}>
            <MenuText fontSizes={fontSizes}>간병인 프로필 조회</MenuText>
          </MenuItemContainer>
        </MenuSection>

        <MenuSection>
          <MenuTitle fontSizes={fontSizes}>설정</MenuTitle>
          <MenuItemContainer onPress={() => navigation.navigate('FontSizeChange')}>
            <MenuText fontSizes={fontSizes}>글씨 크기 변경</MenuText>
          </MenuItemContainer>
          <MenuItemContainer onPress={() => navigation.navigate('DeleteProtectorAccount')}>
            <MenuText fontSizes={fontSizes}>계정 탈퇴</MenuText>
          </MenuItemContainer>
        </MenuSection>
      </ScrollContainer>
    </Container>
  );
};

export default ProtectorMypage;
