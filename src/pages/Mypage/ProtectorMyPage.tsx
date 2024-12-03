import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Clipboard, TouchableOpacity, Alert } from 'react-native';
import TopNavigationBar from '../../components/common/TopNavigationBar';
import { useUser } from '../../store/UserContext';
import { useFontSize } from '../../store/FontSizeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import ApiService from '../../utils/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// API 응답 인터페이스 정확히 정의
interface MedicationInfo {
  name: string;
}

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
      medicationInfos: MedicationInfo[];
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
  const { protectorData } = useUser();
  const { fontSizes } = useFontSize();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ApiResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = async (code: string) => {
    try {
      await Clipboard.setString(code);
      Alert.alert('알림', '코드가 클립보드에 복사되었습니다.');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      Alert.alert('오류', '코드 복사에 실패했습니다.');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ApiService.get<ApiResponse>('/guardian/myPage/3');
        
        if (response.status === 'success' && response.data) {
          setProfileData(response.data);
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        const errorMessage = error.response?.data?.errors?.[0]?.message || 
                           '프로필 정보를 가져오는데 실패했습니다.';
        setError(errorMessage);
        Alert.alert('오류 발생', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return (
      <Container>
        <TopNavigationBar title="보호자 프로필" />
        <CodeSection>
          <CodeTitle fontSizes={fontSizes}>{error}</CodeTitle>
        </CodeSection>
      </Container>
    );
  }

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
                ? `${profileData.patientInfo.name}(${profileData.patientInfo.age}세)님의 보호자\n${profileData.guardianInfo.phone}`
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
          <MenuTitle fontSizes={fontSizes}>보호자 관리</MenuTitle>
          <MenuItemContainer onPress={() => navigation.navigate('ViewProtectorProfile')}>
            <MenuText fontSizes={fontSizes}>보호자 프로필 조회</MenuText>
          </MenuItemContainer>
          <MenuItemContainer onPress={() => navigation.navigate('EditProtectorProfile')}>
            <MenuText fontSizes={fontSizes}>보호자 프로필 수정</MenuText>
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