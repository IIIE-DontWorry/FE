// src/pages/AcquaintanceInfo.tsx
import React, {useState} from 'react';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useUser} from '../../store/UserContext';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Picker} from '@react-native-picker/picker';
import {RootStackParamList} from '../../navigation/MainNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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

const PickerContainer = styled.View`
  border-width: 1px;
  border-color: #dddddd;
  border-radius: 8px;
  background-color: #f5f5f5;
  margin-top: 5px;
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

interface FormData {
  name: string;
  matchingCode: string;
  relationship: string;
}

type FormField = keyof FormData;

const AcquaintanceInfo = () => {
  const navigation = useNavigation<NavigationProp>();
  const {setAcquaintanceData} = useUser();

  const [formData, setFormData] = useState({
    name: '',
    matchingCode: '',
    relationship: '',
  });

  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});

  // 유효성 검사 규칙
 const validations = {
  // 이름: 2~5글자 한글
  name: (value: string) => {
    const nameRegex = /^[가-힣]{2,5}$/;
    return nameRegex.test(value);
  },

  // 관계: 선택했는지 확인
  relationship: (value: string) => {
    return value.trim().length > 0;
  },

  // 매칭 코드는 선택사항이므로 validation 제외
};

const errorMessages = {
  name: '2~5글자의 한글로 입력해주세요',
  relationship: '관계를 선택해주세요',
  required: '필수 입력 항목입니다',
};

const validateField = (name: FormField, value: string): string => {
  // 매칭 코드는 필수가 아님
  if (!value && name !== 'matchingCode') {
    return errorMessages.required;
  }

  // 값이 있는 경우에만 유효성 검사
  if (value) {
    switch (name) {
      case 'name':
        return validations.name(value) ? '' : errorMessages.name;
      case 'relationship':
        return validations.relationship(value) ? '' : errorMessages.relationship;
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
      setAcquaintanceData(formData);  // Context에 데이터 저장
      navigation.navigate('Main');
    }
  };

  return (
    <Container>
      <ScrollContainer>
        <Section>
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
            <Label>매칭 코드</Label>
            <Input
              placeholder="보호자 매칭 코드를 입력해주세요"
              value={formData.matchingCode}
              onChangeText={text => handleChange('matchingCode', text)}
            />
          </InputGroup>
 
          <InputGroup>
            <Label>
              환자와의 관계 <Required>*</Required>
            </Label>
            <PickerContainer hasError={!!errors.relationship}>
              <Picker
                selectedValue={formData.relationship}
                onValueChange={(value: string) =>
                  handleChange('relationship', value)
                }>
                <Picker.Item label="선택해주세요" value="" />
                <Picker.Item label="자녀" value="child" />
                <Picker.Item label="손주" value="grandchild" />
                <Picker.Item label="형제/자매" value="sibling" />
                <Picker.Item label="친척" value="relative" />
                <Picker.Item label="지인" value="acquaintance" />
              </Picker>
            </PickerContainer>
            {errors.relationship && (
              <ErrorText>{errors.relationship}</ErrorText>
            )}
          </InputGroup>
        </Section>
 
        <SubmitButton onPress={handleSubmit}>
          <SubmitText>작성 완료</SubmitText>
        </SubmitButton>
      </ScrollContainer>
    </Container>
  );
};

export default AcquaintanceInfo;
