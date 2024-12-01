import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiService from '../../utils/api';
import TopNavigationBar from '../../components/common/TopNavigationBar';

// 스타일 컴포넌트들
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
`;

interface InputProps {
  hasError?: boolean;
}

const Input = styled.TextInput<InputProps>`
  border-width: 1px;
  border-color: ${props => (props.hasError ? '#ff0000' : '#dddddd')};
  border-radius: 8px;
  padding: 10px;
  background-color: #f5f5f5;
`;

const ErrorText = styled.Text`
  color: #ff0000;
  font-size: 12px;
  margin-top: 5px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #00d6a3;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  margin: 20px 0;
`;

const SubmitText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

// 인터페이스 정의
interface FormData {
  name: string;
  phone: string;
  hospital: string;
}

interface Errors {
  name?: string;
  phone?: string;
  hospital?: string;
}

interface ApiResponse {
  data: FormData;
  message: string;
  status: string;
}

const EditCaregiverProfile = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    hospital: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await ApiService.get<ApiResponse>(
          '/care-givers/myPage/1' // caregiverId를 실제 값으로 대체 필요
        );
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('오류 발생', '간병인 정보를 가져오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateField = (field: keyof FormData, value: string) => {
    let error = '';
    if (!value) {
      error = '필수 입력 항목입니다.';
    } else if (field === 'phone') {
      const phoneRegex = /^010-\d{4}-\d{4}$/;
      if (!phoneRegex.test(value)) {
        error = '올바른 전화번호 형식이 아닙니다.';
      }
    }

    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    validateField(field, value);
  };

  const handleSubmit = async () => {
    // 모든 필드 유효성 검사
    Object.keys(formData).forEach(key => validateField(key as keyof FormData, formData[key as keyof FormData]));

    if (Object.values(errors).some(error => error)) {
      Alert.alert('오류 발생', '입력값을 확인해주세요.');
      return;
    }

    try {
      const response = await ApiService.post<ApiResponse>(
        '/care-givers/myPage/update/1', // caregiverId를 실제 값으로 대체 필요
        formData
      );

      if (response.status === 'success') {
        Alert.alert('성공', '간병인 정보가 성공적으로 수정되었습니다.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('오류 발생', '정보 수정에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#00d6a3" />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <TopNavigationBar title="간병인 정보 수정" />
      <ScrollContainer>
        <Section>
          <SectionTitle>기본 정보</SectionTitle>

          <InputGroup>
            <Label>이름</Label>
            <Input
              value={formData.name}
              onChangeText={text => handleChange('name', text)}
              placeholder="이름을 입력하세요"
              hasError={!!errors.name}
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Label>연락처</Label>
            <Input
              value={formData.phone}
              onChangeText={text => handleChange('phone', text)}
              placeholder="010-0000-0000"
              hasError={!!errors.phone}
            />
            {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Label>소속 병원</Label>
            <Input
              value={formData.hospital}
              onChangeText={text => handleChange('hospital', text)}
              placeholder="병원명을 입력하세요"
              hasError={!!errors.hospital}
            />
            {errors.hospital && <ErrorText>{errors.hospital}</ErrorText>}
          </InputGroup>
        </Section>

        <SubmitButton onPress={handleSubmit}>
          <SubmitText>수정 완료</SubmitText>
        </SubmitButton>
      </ScrollContainer>
    </Container>
  );
};

export default EditCaregiverProfile;
