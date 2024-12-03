import React, {useState} from 'react';
import styled from 'styled-components/native';
import {ScrollView, Alert, TouchableOpacity, Text, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/MainNavigator';
import ApiService from '../../utils/api';
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

const PickerContainer = styled.View<{hasError?: boolean}>`
  border-width: 1px;
  border-color: ${props => (props.hasError ? '#ff0000' : '#dddddd')};
  border-radius: 8px;
  background-color: #f5f5f5;
  margin-top: 5px;
`;

const MedicineContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const MedicineInput = styled(Input)`
  flex: 1;
  margin-right: 10px;
`;

const IconButton = styled.TouchableOpacity`
  padding: 5px 10px;
  background-color: #00d6a3;
  border-radius: 5px;
  margin-left: 5px;
`;

const IconText = styled.Text`
  color: white;
  font-size: 16px;
`;

const ErrorText = styled.Text`
  color: #ff0000;
  font-size: 12px;
  margin-top: 5px;
`;

// Validation logic
const validations = {
  phone: (value: string) => /^010-\d{4}-\d{4}$/.test(value),
  name: (value: string) => /^[가-힣]{2,5}$/.test(value),
  age: (value: string) => {
    const age = Number(value);
    return !isNaN(age) && age > 0 && age <= 150;
  },
  address: (value: string) => value.trim().length >= 10,
  hospital: (value: string) => value.trim().length >= 2,
};

const errorMessages = {
  phone: '010-0000-0000 형식으로 입력해주세요',
  name: '2~5글자의 한글로 입력해주세요',
  age: '1~150 사이의 숫자를 입력해주세요',
  address: '최소 10글자 이상 입력해주세요',
  hospital: '최소 2글자 이상 입력해주세요',
  required: '필수 입력 항목입니다',
};

const ProtectorInfo = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const {kakaoAccessToken} = route.params;
  const {dispatch} = useUserType();

  const [formData, setFormData] = useState({
    protectorName: '',
    protectorPhone: '',
    protectorAddress: '',
    relationship: '',
    patientName: '',
    patientAge: '',
    disease: '',
    hospital: '',
    medications: [''],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    const error = validateField(field, value);
    setErrors(prev => ({...prev, [field]: error}));
  };

  const validateField = (name: string, value: string): string => {
    if (!value && name !== 'protectorAddress' && name !== 'disease') {
      return errorMessages.required;
    }

    switch (name) {
      case 'protectorPhone':
        return validations.phone(value) ? '' : errorMessages.phone;
      case 'protectorName':
      case 'patientName':
        return validations.name(value) ? '' : errorMessages.name;
      case 'patientAge':
        return validations.age(value) ? '' : errorMessages.age;
      case 'protectorAddress':
        return value
          ? validations.address(value)
            ? ''
            : errorMessages.address
          : '';
      case 'hospital':
        return validations.hospital(value) ? '' : errorMessages.hospital;
      default:
        return '';
    }
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, ''],
    }));
  };

  const updateMedication = (index: number, value: string) => {
    const newMedications = [...formData.medications];
    newMedications[index] = value;
    setFormData(prev => ({...prev, medications: newMedications}));
  };

  const removeMedication = (index: number) => {
    const newMedications = formData.medications.filter((_, i) => i !== index);
    setFormData(prev => ({...prev, medications: newMedications}));
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(
        field,
        formData[field as keyof typeof formData],
      );
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const payload = {
        creationGuardian: {
          name: formData.protectorName,
          phone: formData.protectorPhone,
          address: formData.protectorAddress,
        },
        creationPatient: {
          name: formData.patientName,
          age: parseInt(formData.patientAge, 10),
          diseaseName: formData.disease || '없음',
          hospitalName: formData.hospital,
          medicationInfos: formData.medications
            .filter(med => med.trim() !== '')
            .map(name => ({name})),
        },
      };

      try {
        const response = await ApiService.post(
          `guardians/login?kakaoAccessToken=${kakaoAccessToken}`,
          payload,
        );

        if (response.status === 'success') {
          const {role, accessToken} = response.data;

          // UserTypeContext에 role과 accessToken 저장
          dispatch({type: 'SET_USER_TYPE', payload: {role, accessToken}});

          Alert.alert('회원가입 성공', '보호자 정보가 등록되었습니다.');
          navigation.navigate('Main');
        } else {
          throw new Error(response.message || '회원가입 실패');
        }
      } catch (error: any) {
        Alert.alert(
          '에러',
          error.message || '회원가입 중 문제가 발생했습니다.',
        );
      }
    }
  };

  return (
    <Container>
      <ScrollContainer>
        <Section>
          <SectionTitle>보호자 정보</SectionTitle>
          <InputGroup>
            <Label>
              이름 <Required>*</Required>
            </Label>
            <Input
              placeholder="예) 홍길동"
              value={formData.protectorName}
              onChangeText={text => handleChange('protectorName', text)}
              hasError={!!errors.protectorName}
            />
            {errors.protectorName && (
              <ErrorText>{errors.protectorName}</ErrorText>
            )}
          </InputGroup>
          <InputGroup>
            <Label>
              연락처 <Required>*</Required>
            </Label>
            <Input
              placeholder="예) 010-1234-5678"
              value={formData.protectorPhone}
              onChangeText={text => handleChange('protectorPhone', text)}
              hasError={!!errors.protectorPhone}
            />
            {errors.protectorPhone && (
              <ErrorText>{errors.protectorPhone}</ErrorText>
            )}
          </InputGroup>
          <InputGroup>
            <Label>주소</Label>
            <Input
              placeholder="예) 경상북도 울릉군 울릉읍 독도이사부길 55"
              value={formData.protectorAddress}
              onChangeText={text => handleChange('protectorAddress', text)}
              hasError={!!errors.protectorAddress}
            />
            {errors.protectorAddress && (
              <ErrorText>{errors.protectorAddress}</ErrorText>
            )}
          </InputGroup>
          <InputGroup>
            <Label>
              환자와의 관계<Required>*</Required>
            </Label>
            <PickerContainer hasError={!!errors.relationship}>
              <Picker
                selectedValue={formData.relationship}
                onValueChange={value => handleChange('relationship', value)}>
                <Picker.Item label="선택해주세요" value="" />
                <Picker.Item label="부" value="father" />
                <Picker.Item label="모" value="mother" />
                <Picker.Item label="자녀" value="child" />
                <Picker.Item label="형제/자매" value="sibling" />
                <Picker.Item label="기타" value="other" />
              </Picker>
            </PickerContainer>
            {errors.relationship && (
              <ErrorText>{errors.relationship}</ErrorText>
            )}
          </InputGroup>
        </Section>
        <Section>
          <SectionTitle>환자 정보</SectionTitle>
          <InputGroup>
            <Label>
              이름 <Required>*</Required>
            </Label>
            <Input
              placeholder="예) 홍상직"
              value={formData.patientName}
              onChangeText={text => handleChange('patientName', text)}
              hasError={!!errors.patientName}
            />
            {errors.patientName && <ErrorText>{errors.patientName}</ErrorText>}
          </InputGroup>
          <InputGroup>
            <Label>
              나이 <Required>*</Required>
            </Label>
            <Input
              placeholder="예) 88"
              value={formData.patientAge}
              onChangeText={text => handleChange('patientAge', text)}
              hasError={!!errors.patientAge}
            />
            {errors.patientAge && <ErrorText>{errors.patientAge}</ErrorText>}
          </InputGroup>
          <InputGroup>
            <Label>
              병명<Required>*</Required>
            </Label>
            <Input
              placeholder="예) 알츠하이머"
              value={formData.disease}
              onChangeText={text => handleChange('disease', text)}
              hasError={!!errors.disease}
            />
            {errors.disease && <ErrorText>{errors.disease}</ErrorText>}
          </InputGroup>
          <InputGroup>
            <Label>병원</Label>
            <Input
              placeholder="예) 세브란스"
              value={formData.hospital}
              onChangeText={text => handleChange('hospital', text)}
              hasError={!!errors.hospital}
            />
            {errors.hospital && <ErrorText>{errors.hospital}</ErrorText>}
          </InputGroup>
          <InputGroup>
            <Label>
              투약 정보<Required>*</Required>
            </Label>
            {formData.medications.map((med, index) => (
              <MedicineContainer key={index}>
                <MedicineInput
                  placeholder="예) 도네페질"
                  value={med}
                  onChangeText={text => updateMedication(index, text)}
                />
                <IconButton onPress={addMedication}>
                  <IconText>+</IconText>
                </IconButton>
                {index > 0 && (
                  <IconButton onPress={() => removeMedication(index)}>
                    <IconText>-</IconText>
                  </IconButton>
                )}
              </MedicineContainer>
            ))}
          </InputGroup>
        </Section>
        <SubmitButton onPress={handleSubmit}>
          <SubmitText>회원가입</SubmitText>
        </SubmitButton>
      </ScrollContainer>
    </Container>
  );
};

export default ProtectorInfo;
