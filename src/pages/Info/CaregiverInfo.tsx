import React, {useState} from 'react';
import styled from 'styled-components/native';
import {ScrollView, Alert, TouchableOpacity, Text} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/MainNavigator';
import ApiService from '../../utils/api'; // ApiService 가져오기
import {useUserType} from '../../store/UserTypeContext';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProp = {
  params: {
    kakaoAccessToken: string;
  };
};

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const ScrollContainer = styled.ScrollView`
  padding: 20px;
`;

const Section = styled.View`
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #00d6a3;
`;

const InputGroup = styled.View`
  margin-bottom: 15px;
`;

const Label = styled.Text`
  margin-bottom: 5px;
`;

const Required = styled.Text`
  color: red;
`;

const Input = styled.TextInput<{hasError?: boolean}>`
  border-width: 1px;
  border-color: ${props => (props.hasError ? '#ff0000' : '#dddddd')};
  border-radius: 8px;
  padding: 10px;
  background-color: #f5f5f5;
`;

const ExperienceContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const ExperienceInput = styled(Input)`
  flex: 1;
  margin-right: 10px;
`;

const IconButton = styled.TouchableOpacity<{remove?: boolean}>`
  padding: 5px 10px;
  background-color: ${props => (props.remove ? '#00D6A3' : '#00D6A3')};
  border-radius: 5px;
  margin-left: 5px;
`;

const IconText = styled.Text`
  color: white;
  font-size: 20px;
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

const ErrorText = styled.Text`
  color: #ff0000;
  font-size: 12px;
  margin-top: 5px;
`;

interface FormData {
  name: string;
  phone: string;
  workplace: string;
  matchingCode: string;
}

type FormField = keyof FormData;

const CaregiverInfo = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const {kakaoAccessToken} = route.params;
  const {dispatch} = useUserType();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    workplace: '',
    matchingCode: '', // 서버에서 매칭 코드 유효성을 처리함
  });
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});
  const [careerHistories, setCareerHistories] = useState<string[]>(['']); // 경력 필드

  const validations = {
    name: (value: string) => /^[가-힣]{2,5}$/.test(value),
    phone: (value: string) => /^010-\d{4}-\d{4}$/.test(value),
    workplace: (value: string) => value.trim().length >= 2,
  };

  const errorMessages = {
    name: '2~5글자의 한글로 입력해주세요',
    phone: '010-0000-0000 형식으로 입력해주세요',
    workplace: '최소 2글자 이상 입력해주세요',
    required: '필수 입력 항목입니다',
  };

  const validateField = (name: FormField, value: string): string => {
    if (!value && name !== 'matchingCode') {
      return errorMessages.required;
    }
    if (value) {
      switch (name) {
        case 'name':
          return validations.name(value) ? '' : errorMessages.name;
        case 'phone':
          return validations.phone(value) ? '' : errorMessages.phone;
        case 'workplace':
          return validations.workplace(value) ? '' : errorMessages.workplace;
        default:
          return '';
      }
    }
    return '';
  };

  const handleChange = (name: FormField, value: string) => {
    setFormData(prev => ({...prev, [name]: value}));
    const error = validateField(name, value);
    setErrors(prev => ({...prev, [name]: error}));
  };

  const addCareer = () => {
    setCareerHistories([...careerHistories, '']);
  };

  const removeCareer = (index: number) => {
    if (careerHistories.length > 1) {
      const newCareerHistories = careerHistories.filter((_, i) => i !== index);
      setCareerHistories(newCareerHistories);
    }
  };

  const handleCareerChange = (text: string, index: number) => {
    const newCareerHistories = [...careerHistories];
    newCareerHistories[index] = text;
    setCareerHistories(newCareerHistories);
  };

  const handleSubmit = async () => {
    const payload = {
      name: formData.name,
      phone: formData.phone.replace(/-/g, ''),
      hospital: formData.workplace,
      careerHistories,
      guardianUniqueCode: formData.matchingCode,
    };

    try {
      const response = await ApiService.post(
        `/caregivers/login?kakaoAccessToken=${kakaoAccessToken}`,
        payload,
      );

      if (response.status === 'success') {
        const {role, accessToken} = response.data;

        // Update UserTypeContext
        dispatch({
          type: 'SET_USER_TYPE',
          payload: {role, accessToken},
        });

        Alert.alert('회원가입 성공', '간병인 정보가 등록되었습니다.');
        navigation.navigate('Main');
      } else {
        throw new Error(response.message || '회원가입 실패');
      }
    } catch (error: any) {
      Alert.alert('에러', error.message || '회원가입 중 문제가 발생했습니다.');
    }
  };

  return (
    <Container>
      <ScrollContainer>
        <Section>
          <SectionTitle>간병인 정보</SectionTitle>
          <InputGroup>
            <Label>
              이름 <Required>*</Required>
            </Label>
            <Input
              placeholder="예) 홍길동"
              value={formData.name}
              onChangeText={text => handleChange('name', text)}
              hasError={!!errors.name}
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </InputGroup>
          <InputGroup>
            <Label>
              연락처 <Required>*</Required>
            </Label>
            <Input
              placeholder="예) 010-1234-5678"
              value={formData.phone}
              onChangeText={text => handleChange('phone', text)}
              hasError={!!errors.phone}
            />
            {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
          </InputGroup>
          <InputGroup>
            <Label>
              소속 <Required>*</Required>
            </Label>
            <Input
              placeholder="예) OO요양병원"
              value={formData.workplace}
              onChangeText={text => handleChange('workplace', text)}
              hasError={!!errors.workplace}
            />
            {errors.workplace && <ErrorText>{errors.workplace}</ErrorText>}
          </InputGroup>
        </Section>

        <Section>
          <SectionTitle>경력</SectionTitle>
          {careerHistories.map((career, index) => (
            <ExperienceContainer key={index}>
              <ExperienceInput
                placeholder="예) 2020-2023 서울아산병원"
                value={career}
                onChangeText={text => handleCareerChange(text, index)}
              />
              {index === careerHistories.length - 1 ? (
                <IconButton onPress={addCareer}>
                  <IconText>+</IconText>
                </IconButton>
              ) : (
                <IconButton remove onPress={() => removeCareer(index)}>
                  <IconText>-</IconText>
                </IconButton>
              )}
            </ExperienceContainer>
          ))}
        </Section>

        <Section>
          <SectionTitle>보호자 매칭 Code</SectionTitle>
          <InputGroup>
            <Input
              placeholder="매칭코드 입력"
              value={formData.matchingCode}
              onChangeText={text => handleChange('matchingCode', text)}
            />
          </InputGroup>
        </Section>

        <SubmitButton onPress={handleSubmit}>
          <SubmitText>작성 완료</SubmitText>
        </SubmitButton>
      </ScrollContainer>
    </Container>
  );
};

export default CaregiverInfo;
