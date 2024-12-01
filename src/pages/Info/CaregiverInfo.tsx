// src/pages/CaregiverInfo.tsx
import React, {useState} from 'react';
import styled from 'styled-components/native';
import {ScrollView, Modal, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/MainNavigator';
import {useUser} from '../../store/UserContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Styled Components
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

const Input = styled.TextInput<{ hasError?: boolean }>`
  border-width: 1px;
  border-color: ${props => props.hasError ? '#ff0000' : '#dddddd'};
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
  background-color: ${props => (props.remove ? '#C9E270' : '#00D6A3')};
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
  const [experiences, setExperiences] = useState(['']);
  const {setCaregiverData} = useUser();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    workplace: '',
    matchingCode: '',
  });
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});

  const validations = {
    // 이름: 2~5글자 한글
    name: (value: string) => {
      const nameRegex = /^[가-힣]{2,5}$/;
      return nameRegex.test(value);
    },
    
    // 전화번호: 010-0000-0000 형식
    phone: (value: string) => {
      const phoneRegex = /^010-\d{4}-\d{4}$/;
      return phoneRegex.test(value);
    },

    // 근무지: 최소 2글자 이상
    workplace: (value: string) => {
      return value.trim().length >= 2;
    },
  };

  const errorMessages = {
    name: '2~5글자의 한글로 입력해주세요',
    phone: '010-0000-0000 형식으로 입력해주세요',
    workplace: '최소 2글자 이상 입력해주세요',
    required: '필수 입력 항목입니다',
  };

  const validateField = (name: FormField, value: string): string => {
    // matchingCode는 필수가 아님
    if (!value && name !== 'matchingCode') {
      return errorMessages.required;
    }

    // 값이 있는 경우에만 유효성 검사
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

  const addExperience = () => {
    setExperiences([...experiences, '']);
  };

  const removeExperience = (index: number) => {
    if (experiences.length > 1) {
      const newExperiences = experiences.filter((_, i) => i !== index);
      setExperiences(newExperiences);
    }
  };

  const handleExperienceChange = (text: string, index: number) => {
    const newExperiences = [...experiences];
    newExperiences[index] = text;
    setExperiences(newExperiences);
  };

  const handleChange = (name: FormField, value: string) => {
    setFormData(prev => ({...prev, [name]: value}));
    const error = validateField(name, value);
    setErrors(prev => ({...prev, [name]: error}));
  };

  const handleSubmit = () => {
    const newErrors: Partial<Record<FormField, string>> = {};
    
    (Object.keys(formData) as FormField[]).forEach(key => {
      // matchingCode는 유효성 검사에서 제외
      if (key !== 'matchingCode') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setCaregiverData(formData);  // Context에 데이터 저장
      navigation.navigate('Main');
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

          <InputGroup>
            <Label>경력</Label>
            {experiences.map((experience, index) => (
              <ExperienceContainer key={index}>
                <ExperienceInput
                  placeholder="예) 2020-2023 서울아산병원"
                  value={experience}
                  onChangeText={text => handleExperienceChange(text, index)}
                />
                {index === experiences.length - 1 ? (
                  <IconButton onPress={addExperience}>
                    <IconText>+</IconText>
                  </IconButton>
                ) : (
                  <IconButton
                    remove={true}
                    onPress={() => removeExperience(index)}>
                    <IconText>-</IconText>
                  </IconButton>
                )}
              </ExperienceContainer>
            ))}
          </InputGroup>
        </Section>

        <Section>
          <SectionTitle>보호자 매칭 Code</SectionTitle>
          <InputGroup>
            <Input
              placeholder="보호자 매칭 코드를 입력해주세요"
              value={formData.matchingCode}
              onChangeText={text =>
                setFormData({...formData, matchingCode: text})
              }
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
