import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator, Alert } from 'react-native';
import TopNavigationBar from '../../components/common/TopNavigationBar';
import ApiService from '../../utils/api';

// 인터페이스 정의
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

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const ScrollContainer = styled.ScrollView`
  padding: 16px;
`;

const Section = styled.View`
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const InputGroup = styled.View`
  margin-bottom: 15px;
`;

const Label = styled.Text`
  margin-bottom: 5px;
  color: #666;
`;

const InfoText = styled.Text`
  border-width: 1px;
  border-color: #dddddd;
  border-radius: 8px;
  padding: 10px;
  background-color: #f5f5f5;
  font-size: 16px;
  color: #333;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const MedicationList = styled.View`
  margin-top: 5px;
`;

const MedicationItem = styled.Text`
  color: #333;
  font-size: 14px;
  margin-vertical: 2px;
`;

const ViewProtectorProfile = () => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ApiResponse['data'] | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await ApiService.get<ApiResponse>('/care-givers/myPage/guardianProfile/1'); // caregiverId를 실제 값으로 대체 필요
        if (response.status === 'success') {
          setProfileData(response.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('오류 발생', '보호자 프로필 정보를 가져오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#00d6a3" />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <TopNavigationBar title="보호자 프로필 조회" />
      <ScrollContainer>
        <Section>
          <SectionTitle>보호자 정보</SectionTitle>
          <InputGroup>
            <Label>이름</Label>
            <InfoText>{profileData?.guardianInfo.name || '정보 없음'}</InfoText>
          </InputGroup>
          <InputGroup>
            <Label>연락처</Label>
            <InfoText>{profileData?.guardianInfo.phone || '정보 없음'}</InfoText>
          </InputGroup>
          <InputGroup>
            <Label>주소</Label>
            <InfoText>{profileData?.guardianInfo.address || '정보 없음'}</InfoText>
          </InputGroup>
        </Section>

        <Section>
          <SectionTitle>환자 정보</SectionTitle>
          <InputGroup>
            <Label>이름</Label>
            <InfoText>{profileData?.patientInfo.name || '정보 없음'}</InfoText>
          </InputGroup>
          <InputGroup>
            <Label>나이</Label>
            <InfoText>{profileData?.patientInfo.age || '정보 없음'}</InfoText>
          </InputGroup>
          <InputGroup>
            <Label>질병명</Label>
            <InfoText>{profileData?.patientInfo.diseaseName || '정보 없음'}</InfoText>
          </InputGroup>
          <InputGroup>
            <Label>병원명</Label>
            <InfoText>{profileData?.patientInfo.hospitalName || '정보 없음'}</InfoText>
          </InputGroup>
          <InputGroup>
            <Label>복용 약물</Label>
            <MedicationList>
              {profileData?.patientInfo.medicationInfos.map((med, index) => (
                <MedicationItem key={index}>• {med.name}</MedicationItem>
              )) || <InfoText>정보 없음</InfoText>}
            </MedicationList>
          </InputGroup>
        </Section>
      </ScrollContainer>
    </Container>
  );
};

export default ViewProtectorProfile;
