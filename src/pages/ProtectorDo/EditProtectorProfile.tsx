// src/pages/ProtectorDo/EditProtectorProfile.tsx
import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {Alert, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
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
  guardianInfo: {
    address: string;
    name: string;
    phone: string;
  };
  patientInfo: {
    age: number;
    diseaseName: string;
    hospitalName: string;
    medicationInfos: any[];
    name: string;
  };
}

interface Errors {
  guardianInfo?: {
    name?: string;
    phone?: string;
    address?: string;
  };
  patientInfo?: {
    name?: string;
    age?: string;
    diseaseName?: string;
    hospitalName?: string;
  };
}

interface ApiResponse {
  data: FormData;
  message: string;
  status: string;
}

const EditProtectorProfile = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [formData, setFormData] = useState<FormData>({
    guardianInfo: {
      address: '',
      name: '',
      phone: '',
    },
    patientInfo: {
      age: 0,
      diseaseName: '',
      hospitalName: '',
      medicationInfos: [],
      name: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await ApiService.get<ApiResponse>(
          '/guardian/myPage/4',
        );
        const {guardianInfo, patientInfo} = response.data;
        setFormData({guardianInfo, patientInfo});
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('오류 발생', '프로필 정보를 가져오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateField = (
    section: 'guardianInfo' | 'patientInfo',
    field: string,
    value: string | number,
  ) => {
    let error = '';

    if (!value) {
      error = '필수 입력 항목입니다.';
    } else if (section === 'guardianInfo' && field === 'phone') {
      const phoneRegex = /^010-\d{4}-\d{4}$/;
      if (!phoneRegex.test(value as string)) {
        error = '올바른 전화번호 형식이 아닙니다.';
      }
    }

    setErrors(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: error,
      },
    }));
  };

  const handleChange = (
    section: 'guardianInfo' | 'patientInfo',
    field: string,
    value: string | number,
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    validateField(section, field, value);
  };

  const handleSubmit = async () => {
    try {
      const response = await ApiService.post<ApiResponse>(
        '/guardian/myPage/update/1',
        formData.guardianInfo,
      );

      if (response.data.status === 'success') {
        Alert.alert('성공', '프로필이 성공적으로 수정되었습니다.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('오류 발생', '프로필 수정에 실패했습니다.');
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
      <TopNavigationBar title="보호자 정보 수정" />
      <ScrollContainer>
        <Section>
          <SectionTitle>보호자 정보</SectionTitle>

          <InputGroup>
            <Label>이름</Label>
            <Input
              value={formData.guardianInfo.name}
              onChangeText={text => handleChange('guardianInfo', 'name', text)}
              placeholder="이름을 입력하세요"
              hasError={!!errors.guardianInfo?.name}
            />
            {errors.guardianInfo?.name && (
              <ErrorText>{errors.guardianInfo.name}</ErrorText>
            )}
          </InputGroup>

          <InputGroup>
            <Label>연락처</Label>
            <Input
              value={formData.guardianInfo.phone}
              onChangeText={text => handleChange('guardianInfo', 'phone', text)}
              placeholder="010-0000-0000"
              hasError={!!errors.guardianInfo?.phone}
            />
            {errors.guardianInfo?.phone && (
              <ErrorText>{errors.guardianInfo.phone}</ErrorText>
            )}
          </InputGroup>

          <InputGroup>
            <Label>주소</Label>
            <Input
              value={formData.guardianInfo.address}
              onChangeText={text =>
                handleChange('guardianInfo', 'address', text)
              }
              placeholder="주소를 입력하세요"
              hasError={!!errors.guardianInfo?.address}
            />
            {errors.guardianInfo?.address && (
              <ErrorText>{errors.guardianInfo.address}</ErrorText>
            )}
          </InputGroup>
        </Section>

        <Section>
          <SectionTitle>환자 정보</SectionTitle>

          <InputGroup>
            <Label>이름</Label>
            <Input
              value={formData.patientInfo.name}
              onChangeText={text => handleChange('patientInfo', 'name', text)}
              placeholder="환자 이름을 입력하세요"
              hasError={!!errors.patientInfo?.name}
            />
            {errors.patientInfo?.name && (
              <ErrorText>{errors.patientInfo.name}</ErrorText>
            )}
          </InputGroup>

          <InputGroup>
            <Label>나이</Label>
            <Input
              value={String(formData.patientInfo.age)}
              onChangeText={text =>
                handleChange('patientInfo', 'age', Number(text))
              }
              placeholder="나이를 입력하세요"
              keyboardType="numeric"
              hasError={!!errors.patientInfo?.age}
            />
            {errors.patientInfo?.age && (
              <ErrorText>{errors.patientInfo.age}</ErrorText>
            )}
          </InputGroup>

          <InputGroup>
            <Label>질병명</Label>
            <Input
              value={formData.patientInfo.diseaseName}
              onChangeText={text =>
                handleChange('patientInfo', 'diseaseName', text)
              }
              placeholder="질병명을 입력하세요"
              hasError={!!errors.patientInfo?.diseaseName}
            />
            {errors.patientInfo?.diseaseName && (
              <ErrorText>{errors.patientInfo.diseaseName}</ErrorText>
            )}
          </InputGroup>

          <InputGroup>
            <Label>병원명</Label>
            <Input
              value={formData.patientInfo.hospitalName}
              onChangeText={text =>
                handleChange('patientInfo', 'hospitalName', text)
              }
              placeholder="병원명을 입력하세요"
              hasError={!!errors.patientInfo?.hospitalName}
            />
            {errors.patientInfo?.hospitalName && (
              <ErrorText>{errors.patientInfo.hospitalName}</ErrorText>
            )}
          </InputGroup>
        </Section>

        <SubmitButton onPress={handleSubmit}>
          <SubmitText>수정 완료</SubmitText>
        </SubmitButton>
      </ScrollContainer>
    </Container>
  );
};

export default EditProtectorProfile;
