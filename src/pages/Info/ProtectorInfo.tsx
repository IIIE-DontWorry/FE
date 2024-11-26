// src/pages/ProtectorInfo.tsx
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

const Input = styled.TextInput`
  border-width: 1px;
  border-color: #dddddd;
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


const PickerContainer = styled.View`
  border-width: 1px;
  border-color: #dddddd;
  border-radius: 8px;
  background-color: #f5f5f5;
  margin-top: 5px;
`;



const ProtectorInfo = () => {
  const navigation = useNavigation();
  const [medicines, setMedicines] = useState(['']); //약 목록을 배열로 관리
  const [formData, setFormData] = useState({
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

  const handleSubmit = () => {
    // DB 저장 로직
    // 일단 메인페이지로 이동
    navigation.navigate('Main');
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
              onChangeText={text =>
                setFormData({...formData, protectorName: text})
              }
            />
          </InputGroup>
          <InputGroup>
            <Label>
              연락처 <Required>*</Required>
            </Label>
            <Input
              placeholder="예) 010-1234-5678"
              value={formData.protectorPhone}
              onChangeText={text =>
                setFormData({...formData, protectorPhone: text})
              }
            />
          </InputGroup>
          <InputGroup>
            <Label>주소</Label>
            <Input
              placeholder="예) 경상북도 울릉군 울릉읍 독도이사부길 55"
              value={formData.protectorAddress}
              onChangeText={text =>
                setFormData({...formData, protectorAddress: text})
              }
            />
          </InputGroup>
          <InputGroup>
            <Label>
              환자와의 관계 <Required>*</Required>
            </Label>
            <PickerContainer>
              <Picker
                selectedValue={formData.relationship}
                onValueChange={(value: string) =>
                  setFormData({...formData, relationship: value})
                }>
                <Picker.Item label="부" value="father" />
                <Picker.Item label="모" value="mother" />
                <Picker.Item label="자녀" value="child" />
                <Picker.Item label="형제/자매" value="sibling" />
                <Picker.Item label="기타" value="other" />
              </Picker>
            </PickerContainer>
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
              onChangeText={text =>
                setFormData({...formData, patientName: text})
              }
            />
          </InputGroup>
          <InputGroup>
            <Label>
              나이 <Required>*</Required>
            </Label>
            <Input
              placeholder="예) 88"
              value={formData.patientAge}
              onChangeText={text =>
                setFormData({...formData, patientAge: text})
              }
            />
          </InputGroup>
          <InputGroup>
            <Label>병명</Label>
            <Input
              placeholder="예) 알츠하이머, 척추손상"
              value={formData.disease}
              onChangeText={text => setFormData({...formData, disease: text})}
            />
          </InputGroup>
          <InputGroup>
            <Label>
              병원 <Required>*</Required>
            </Label>
            <Input
              placeholder="예) 치매: OO병원 신경과 / 척추: XO병원 물리치료과"
              value={formData.hospital}
              onChangeText={text => setFormData({...formData, hospital: text})}
            />
          </InputGroup>
          <InputGroup>
            <Label>주소 </Label>
            <Input
              placeholder="예) 서울특별시 중구 필동로1길 30 "
              value={formData.patientAddress}
              onChangeText={text =>
                setFormData({...formData, patientAddress: text})
              }
            />
          </InputGroup>
          <InputGroup>
            <Label>
              투약 정보 <Required>*</Required>
            </Label>
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
      </ScrollContainer>

    </Container>
  );
};

export default ProtectorInfo;
