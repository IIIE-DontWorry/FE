import React, {useState} from 'react';
import styled from 'styled-components/native';
import {
  ScrollView,
  Modal,
  Clipboard,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/MainNavigator';
import {useUser} from '../../store/UserContext';
import {useRef, useEffect} from 'react';
import {useRoute, RouteProp} from '@react-navigation/native';

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
  font-size: 20px;
`;

const PickerContainer = styled.View<{hasError?: boolean}>`
  border-width: 1px;
  border-color: ${props => (props.hasError ? '#ff0000' : '#dddddd')};
  border-radius: 8px;
  background-color: #f5f5f5;
  margin-top: 5px;
`;

// 유효성 검사를 위한 정규식과 검증 함수들
const validations = {
  // 전화번호: 010-0000-0000 형식
  phone: (value: string) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(value);
  },

  // 이름: 2~5글자 한글
  name: (value: string) => {
    const nameRegex = /^[가-힣]{2,5}$/;
    return nameRegex.test(value);
  },

  // 나이: 1~150 사이의 숫자
  age: (value: string) => {
    const age = Number(value);
    return !isNaN(age) && age > 0 && age <= 150;
  },

  // 주소: 최소 10글자 이상
  address: (value: string) => {
    return value.trim().length >= 10;
  },

  // 병원: 최소 2글자 이상
  hospital: (value: string) => {
    return value.trim().length >= 2;
  },
};

// 에러 메시지
const errorMessages = {
  phone: '010-0000-0000 형식으로 입력해주세요',
  name: '2~5글자의 한글로 입력해주세요',
  age: '1~150 사이의 숫자를 입력해주세요',
  address: '최소 10글자 이상 입력해주세요',
  hospital: '최소 2글자 이상 입력해주세요',
  required: '필수 입력 항목입니다',
};

// 입력 필드 컴포넌트에 에러 표시 추가
const InputField = styled.View`
  margin-bottom: 15px;
`;

const ErrorText = styled.Text`
  color: #ff0000;
  font-size: 12px;
  margin-top: 5px;
`;

// FormData 타입 정의
interface FormData {
  protectorName: string;
  protectorPhone: string;
  protectorAddress: string;
  relationship: string;
  patientName: string;
  patientAge: string;
  disease: string;
  hospital: string;
  patientAddress: string;
}

// 필드 이름에 대한 타입 정의
type FormField = keyof FormData;

const ProtectorInfo = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const route = useRoute<RouteProp<RootStackParamList, 'ProtectorInfo'>>();

  useEffect(() => {
    if (route.params?.scrollTo === 'patientInfo') {
      scrollViewRef.current?.scrollTo({y: 500, animated: true});
    } else if (route.params?.scrollTo === 'medicineInfo') {
      scrollViewRef.current?.scrollTo({y: 1200, animated: true});
    }
  }, [route.params?.scrollTo]);
  const navigation = useNavigation();
  const [medicines, setMedicines] = useState(['']); //약 목록을 배열로 관리
  const [formData, setFormData] = useState<FormData>({
    protectorName: '',
    protectorPhone: '',
    protectorAddress: '',
    relationship: '',
    patientName: '',
    patientAge: '',
    disease: '',
    hospital: '',
    patientAddress: '',
  });
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});
  const {setProtectorData} = useUser();

  const addMedicine = () => {
    setMedicines([...medicines, '']);
  };

  const removeMedicine = (index: number) => {
    if (medicines.length > 1) {
      const newMedicines = medicines.filter((_, i) => i !== index);
      setMedicines(newMedicines);
    }
  };

  const handleMedicineChange = (text: string, index: number) => {
    const newMedicines = [...medicines];
    newMedicines[index] = text;
    setMedicines(newMedicines);
  };

  const validateField = (name: FormField, value: string): string => {
    if (
      !value &&
      name !== 'protectorAddress' &&
      name !== 'patientAddress' &&
      name !== 'disease'
    ) {
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
      case 'patientAddress':
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

  const handleChange = (name: FormField, value: string) => {
    setFormData(prev => ({...prev, [name]: value}));
    const error = validateField(name, value);
    setErrors(prev => ({...prev, [name]: error}));
  };

  const handleSubmit = () => {
    // 전체 폼 유효성 검사
    const newErrors: Partial<Record<FormField, string>> = {};

    (Object.keys(formData) as FormField[]).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    // 에러가 없으면 제출
    if (Object.keys(newErrors).length === 0) {
      setProtectorData(formData); // Context에 데이터 저장
      navigation.navigate('Main');
    }
  };

  // 카카오 로그인 로직
  // const handleSubmit = async () => {
  //   try {
  //     const response = await axios.post(
  //       `http://{베이스url}/${userType}/login`,
  //       formData,
  //       {headers: {Authorization: `Bearer ${accessToken}`}},
  //     );
  //     Alert.alert('회원가입 성공', '로그인되었습니다.');
  //     navigation.navigate('Main');
  //   } catch (error) {
  //     Alert.alert('에러', '회원가입 중 문제가 발생했습니다.');
  //   }
  // };

  return (
    <Container>
      <ScrollView
        ref={scrollViewRef}
        style={{flex: 1}}
        contentContainerStyle={{padding: 16}}>
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
              환자와의 관계 <Required>*</Required>
            </Label>
            <PickerContainer hasError={!!errors.relationship}>
              <Picker
                selectedValue={formData.relationship}
                onValueChange={(value: string) =>
                  handleChange('relationship', value)
                }>
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
            <Label>병명</Label>
            <Input
              placeholder="예) 알츠하이머, 척추손상"
              value={formData.disease}
              onChangeText={text => handleChange('disease', text)}
              hasError={!!errors.disease}
            />
            {errors.disease && <ErrorText>{errors.disease}</ErrorText>}
          </InputGroup>
          <InputGroup>
            <Label>
              병원 <Required>*</Required>
            </Label>
            <Input
              placeholder="예) 치매: OO병원 신경과 / 척추: XO병원 물리치료과"
              value={formData.hospital}
              onChangeText={text => handleChange('hospital', text)}
              hasError={!!errors.hospital}
            />
            {errors.hospital && <ErrorText>{errors.hospital}</ErrorText>}
          </InputGroup>
          <InputGroup>
            <Label>주소 </Label>
            <Input
              placeholder="예) 서울특별시 중구 필동로1길 30 "
              value={formData.patientAddress}
              onChangeText={text => handleChange('patientAddress', text)}
              hasError={!!errors.patientAddress}
            />
            {errors.patientAddress && (
              <ErrorText>{errors.patientAddress}</ErrorText>
            )}
          </InputGroup>
          <InputGroup>
            <Label>투약 정보</Label>
            {medicines.map((medicine, index) => (
              <MedicineContainer key={index}>
                <MedicineInput
                  placeholder="예) 도네페질"
                  value={medicine}
                  onChangeText={text => handleMedicineChange(text, index)}
                />
                {index === medicines.length - 1 ? (
                  <IconButton onPress={addMedicine}>
                    <IconText>+</IconText>
                  </IconButton>
                ) : (
                  <IconButton onPress={() => removeMedicine(index)}>
                    <IconText>-</IconText>
                  </IconButton>
                )}
              </MedicineContainer>
            ))}
          </InputGroup>
        </Section>

        {/* 작성 완료 버튼 */}
        <SubmitButton onPress={handleSubmit}>
          <SubmitText>작성 완료</SubmitText>
        </SubmitButton>
      </ScrollView>
    </Container>
  );
};

export default ProtectorInfo;
