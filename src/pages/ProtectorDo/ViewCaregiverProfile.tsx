import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator, Alert } from 'react-native';
import TopNavigationBar from '../../components/common/TopNavigationBar';
import ApiService from '../../utils/api';

// 인터페이스 정의
interface CareerHistory {
  career: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data: {
    name: string;
    phone: string;
    hospital: string;
    patientName: string;
    careerHistories: CareerHistory[];
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

const CareerList = styled.View`
  margin-top: 5px;
`;

const CareerItem = styled.Text`
  color: #333;
  font-size: 14px;
  margin-vertical: 2px;
  padding-left: 10px;
`;

const ViewCaregiverProfile = () => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ApiResponse['data'] | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await ApiService.get<ApiResponse>('/guardian/myPage/caregiver/1');
        
        // API 응답 상태 확인
        if (response.status === 'success') {
          setProfileData(response.data);
        } else {
          throw new Error(response.message || '프로필 조회에 실패했습니다.');
        }
      } catch (error) {
        console.error('Error fetching caregiver profile:', error);
        Alert.alert(
          '오류 발생',
          error instanceof Error ? error.message : '간병인 프로필 정보를 가져오는데 실패했습니다.'
        );
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

  if (!profileData) {
    return (
      <Container>
        <TopNavigationBar title="간병인 프로필 조회" />
        <LoadingContainer>
          <InfoText>프로필 정보를 불러올 수 없습니다.</InfoText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <TopNavigationBar title="간병인 프로필 조회" />
      <ScrollContainer>
        <Section>
          <SectionTitle>기본 정보</SectionTitle>
          <InputGroup>
            <Label>이름</Label>
            <InfoText>{profileData.name || '정보 없음'}</InfoText>
          </InputGroup>
          <InputGroup>
            <Label>연락처</Label>
            <InfoText>{profileData.phone || '정보 없음'}</InfoText>
          </InputGroup>
          <InputGroup>
            <Label>소속 병원</Label>
            <InfoText>{profileData.hospital || '정보 없음'}</InfoText>
          </InputGroup>
          <InputGroup>
            <Label>담당 환자</Label>
            <InfoText>{profileData.patientName || '정보 없음'}</InfoText>
          </InputGroup>
        </Section>

        <Section>
          <SectionTitle>경력 사항</SectionTitle>
          <CareerList>
            {profileData.careerHistories?.length > 0 ? (
              profileData.careerHistories.map((career, index) => (
                <CareerItem key={index}>• {career.career}</CareerItem>
              ))
            ) : (
              <InfoText>경력 정보가 없습니다.</InfoText>
            )}
          </CareerList>
        </Section>
      </ScrollContainer>
    </Container>
  );
};

export default ViewCaregiverProfile;