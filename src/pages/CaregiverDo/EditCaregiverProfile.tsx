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

const CareerInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const CareerInput = styled.TextInput<InputProps>`
  flex: 1;
  border-width: 1px;
  border-color: ${props => (props.hasError ? '#ff0000' : '#dddddd')};
  border-radius: 8px;
  padding: 10px;
  background-color: #f5f5f5;
`;

const IconButton = styled.TouchableOpacity`
  padding: 5px 10px;
  background-color: #00d6a3;
  border-radius: 5px;
  margin-left: 5px;
`;

const IconText = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: bold;
`;

const CareerContainer = styled.View`
  margin-top: 10px;
`;

interface FormData {
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

interface Errors {
  caregiverName?: string;
  phone?: string;
  hospital?: string;
  carrierHistory?: string;
  patientName?: string;
  age?: string;
  diseaseName?: string;
  hospitalName?: string;
  address?: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data: FormData;
}

const EditCaregiverProfile = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [formData, setFormData] = useState<FormData>({
    caregiverName: '',
    phone: '',
    hospital: '',
    carrierHistory: [],
    patientName: '',
    age: 0,
    diseaseName: '',
    hospitalName: '',
    address: '',
  });

  const addCareer = () => {
    setFormData(prev => ({
      ...prev,
      carrierHistory: [...prev.carrierHistory, '']
    }));
  };

  const removeCareer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      carrierHistory: prev.carrierHistory.filter((_, i) => i !== index)
    }));
  };

  const updateCareer = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      carrierHistory: prev.carrierHistory.map((career, i) => 
        i === index ? value : career
      )
    }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await ApiService.get<ApiResponse>('/care-givers/myPage/1/1');
        if (response.status === 'success') {
          setFormData(response.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('오류 발생', '간병인 정보를 가져오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateField = (field: keyof FormData, value: string | number | string[]) => {
    let error = '';
    if (field === 'phone' && typeof value === 'string') {
      const phoneRegex = /^010-\d{4}-\d{4}$/;
      if (!phoneRegex.test(value)) {
        error = '올바른 전화번호 형식이 아닙니다.';
      }
    } else if (field === 'age' && typeof value === 'number') {
      if (value <= 0 || value > 120) {
        error = '올바른 나이를 입력해주세요.';
      }
    } else if (typeof value === 'string' && !value) {
      error = '필수 입력 항목입니다.';
    }

    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    validateField(field, value);
  };

  const handleSubmit = async () => {
    // 필수 필드 유효성 검사
    const requiredFields: (keyof FormData)[] = ['caregiverName', 'phone', 'hospital'];
    requiredFields.forEach(field => validateField(field, formData[field]));

    if (Object.values(errors).some(error => error)) {
      Alert.alert('오류 발생', '입력값을 확인해주세요.');
      return;
    }

    try {
      const response = await ApiService.patch<ApiResponse>(
        `/care-givers/myPage/update/1/1`,
        formData
      );

      if (response.status === 'success') {
        Alert.alert('성공', '간병인 정보가 성공적으로 수정되었습니다.', [
          {
            text: '확인',
            onPress: () => navigation.goBack(),
          },
        ]);
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
              value={formData.caregiverName}
              onChangeText={text => handleChange('caregiverName', text)}
              placeholder="이름을 입력하세요"
              hasError={!!errors.caregiverName}
            />
            {errors.caregiverName && <ErrorText>{errors.caregiverName}</ErrorText>}
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

          <CareerContainer>
            <Label>경력</Label>
            {formData.carrierHistory.map((career, index) => (
              <CareerInputContainer key={index}>
                <CareerInput
                  value={career}
                  onChangeText={(text) => updateCareer(index, text)}
                  placeholder="경력을 입력하세요"
                  hasError={false}
                />
                {index === formData.carrierHistory.length - 1 ? (
                  <IconButton onPress={addCareer}>
                    <IconText>+</IconText>
                  </IconButton>
                ) : (
                  <IconButton onPress={() => removeCareer(index)}>
                    <IconText>-</IconText>
                  </IconButton>
                )}
              </CareerInputContainer>
            ))}
            {formData.carrierHistory.length === 0 && (
              <IconButton onPress={addCareer}>
                <IconText>+</IconText>
              </IconButton>
            )}
          </CareerContainer>

        </Section>

        <Section>
          <SectionTitle>환자 정보</SectionTitle>
          <InputGroup>
            <Label>환자 이름</Label>
            <Input
              value={formData.patientName}
              onChangeText={text => handleChange('patientName', text)}
              placeholder="환자 이름을 입력하세요"
              hasError={!!errors.patientName}
            />
            {errors.patientName && <ErrorText>{errors.patientName}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Label>나이</Label>
            <Input
              value={String(formData.age)}
              onChangeText={text => handleChange('age', parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="나이를 입력하세요"
              hasError={!!errors.age}
            />
            {errors.age && <ErrorText>{errors.age}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Label>질병명</Label>
            <Input
              value={formData.diseaseName}
              onChangeText={text => handleChange('diseaseName', text)}
              placeholder="질병명을 입력하세요"
              hasError={!!errors.diseaseName}
            />
            {errors.diseaseName && <ErrorText>{errors.diseaseName}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Label>병원 이름</Label>
            <Input
              value={formData.hospitalName}
              onChangeText={text => handleChange('hospitalName', text)}
              placeholder="병원 이름을 입력하세요"
              hasError={!!errors.hospitalName}
            />
            {errors.hospitalName && <ErrorText>{errors.hospitalName}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Label>주소</Label>
            <Input
              value={formData.address}
              onChangeText={text => handleChange('address', text)}
              placeholder="주소를 입력하세요"
              hasError={!!errors.address}
            />
            {errors.address && <ErrorText>{errors.address}</ErrorText>}
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