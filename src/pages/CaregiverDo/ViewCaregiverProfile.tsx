import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator, Alert } from 'react-native';
import TopNavigationBar from '../../components/common/TopNavigationBar';
import ApiService from '../../utils/api';

// 인터페이스 정의
interface ProfileData {
  caregiverName: string;
  phone: string;
  hospital: string;
  carrierHistory: string[];
  patientName: string;
  age: number;
  diseaseName: string;
  hospitalName: string;
  address: string;
}

interface ErrorResponse {
  status: string;
  message: string;
  errors: Array<{
    code: string;
    message: string;
    details: string;
  }>;
}

interface ApiResponse {
  status: string;
  message: string;
  data: ProfileData;
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

const CareerList = styled.View`
  margin-top: 5px;
`;

const CareerItem = styled.Text`
  color: #333;
  font-size: 14px;
  margin-vertical: 2px;
`;

const ViewCaregiverProfile = () => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // TODO: 실제 caregiverId와 patientId를 동적으로 받아와야 함
        const response = await ApiService.get<ApiResponse>('/care-givers/myPage/1/1');
        
        if (response.status === 'success' && response.data) {
          setProfileData(response.data);
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        
        // API 에러 응답 처리
        if (err.response?.data) {
          const errorData = err.response.data as ErrorResponse;
          const errorMessage = errorData.errors?.[0]?.message || errorData.message || '알 수 없는 오류가 발생했습니다.';
          setError(errorMessage);
          Alert.alert('오류 발생', errorMessage);
        } else {
          setError('서버와의 통신 중 오류가 발생했습니다.');
          Alert.alert('오류 발생', '서버와의 통신 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.');
        }
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
  
  if (error) {
    return (
      <Container>
        <TopNavigationBar title="간병인 프로필 조회" />
        <LoadingContainer>
          <InfoText>{error}</InfoText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <TopNavigationBar title="간병인 프로필 조회" />
      <ScrollContainer>
        <Section>
          <SectionTitle>간병인 정보</SectionTitle>
          <InputGroup>
            <Label>이름</Label>
            <InfoText>{profileData?.caregiverName || '정보 없음'}</InfoText>
          </InputGroup>
          <InputGroup>
            <Label>연락처</Label>
            <InfoText>{profileData?.phone || '정보 없음'}</InfoText>
          </InputGroup>
          <InputGroup>
            <Label>소속 병원</Label>
            <InfoText>{profileData?.hospital || '정보 없음'}</InfoText>
          </InputGroup>
        </Section>

        <Section>
          <SectionTitle>환자 정보</SectionTitle>
          <InputGroup>
            <Label>환자 이름</Label>
            <InfoText>{profileData?.patientName || '정보 없음'}</InfoText>
          </InputGroup>
          <InputGroup>
            <Label>나이</Label>
            <InfoText>{profileData?.age || '정보 없음'}</InfoText>
          </InputGroup>
          <InputGroup>
            <Label>질병명</Label>
            <InfoText>{profileData?.diseaseName || '정보 없음'}</InfoText>
          </InputGroup>
          <InputGroup>
            <Label>병원명</Label>
            <InfoText>{profileData?.hospitalName || '정보 없음'}</InfoText>
          </InputGroup>
          <InputGroup>
            <Label>주소</Label>
            <InfoText>{profileData?.address || '정보 없음'}</InfoText>
          </InputGroup>
        </Section>

        <Section>
          <SectionTitle>경력</SectionTitle>
          <CareerList>
            {profileData?.carrierHistory.map((career, index) => (
              <CareerItem key={index}>• {career}</CareerItem>
            )) || <InfoText>정보 없음</InfoText>}
          </CareerList>
        </Section>
      </ScrollContainer>
    </Container>
  );
};

export default ViewCaregiverProfile;