// src/pages/ProtectorInfo.tsx
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, Modal, Clipboard,TouchableOpacity,Text, View  } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type RootStackParamList = {
  Landing: undefined;
  Main: undefined;
  UserCategory: undefined;
};

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
  border-color: #DDDDDD;
  border-radius: 8px;
  padding: 10px;
  background-color: #F5F5F5;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #00D6A3;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  margin: 20px 0;
`;

const SubmitText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: bold;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  align-items: center;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  margin-bottom: 15px;
`;

const ModalContainer = styled.View`
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  align-items: center;
`;

const CloseButtonWrapper = styled.View`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
`;

const MatchingCode = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ModalButton = styled.TouchableOpacity`
  background-color: #00D6A3;
  padding: 10px 30px;
  border-radius: 8px;
`;

const ModalButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
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
  background-color: #00D6A3;
  border-radius: 5px;
  margin-left: 5px;
`;

const IconText = styled.Text`
  color: white;
  font-size: 20px;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
`;

const CloseButtonContainer = styled.View`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
`;

const CloseButtonText = styled.Text`
  font-size: 24px;
  color: #666;
  text-align: center;
`;

const PickerContainer = styled.View`
  border-width: 1px;
  border-color: #DDDDDD;
  border-radius: 8px;
  background-color: #F5F5F5;
  margin-top: 5px;
`;

const ProtectorInfo = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
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

  const copyToClipboard = async (code: string) => {
    try {
      await Clipboard.setString(code);
      // 성공 메시지 표시
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
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
            <Label>이름 <Required>*</Required></Label>
            <Input 
              placeholder="예) 홍길동"
              value={formData.protectorName}
              onChangeText={(text) => setFormData({...formData, protectorPhone: text})}
            />
          </InputGroup>
          <InputGroup>
            <Label>연락처 <Required>*</Required></Label>
            <Input 
              placeholder="예) 010-1234-5678"
              value={formData.protectorName}
              onChangeText={(text) => setFormData({...formData, protectorName: text})}
            />
          </InputGroup>
          <InputGroup>
            <Label>주소</Label>
            <Input 
              placeholder="예) 경상북도 울릉군 울릉읍 독도이사부길 55"
              value={formData.protectorName}
              onChangeText={(text) => setFormData({...formData, protectorAddress: text})}
            />
          </InputGroup>
          <InputGroup>
            <Label>환자와의 관계 <Required>*</Required></Label>
            <PickerContainer>
              <Picker
                selectedValue={formData.relationship}
                onValueChange={(value: string) => 
                  setFormData({...formData, relationship: value})
                }
              >
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
            <Label>이름 <Required>*</Required></Label>
            <Input 
              placeholder="예) 홍상직"
              value={formData.protectorName}
              onChangeText={(text) => setFormData({...formData, patientName: text})}
            />
          </InputGroup>
          <InputGroup>
            <Label>나이 <Required>*</Required></Label>
            <Input 
              placeholder="예) 88" 
              value={formData.protectorName}
              onChangeText={(text) => setFormData({...formData, patientAge: text})}
            />
          </InputGroup>
          <InputGroup>
            <Label>병명</Label>
            <Input 
              placeholder="예) 알츠하이머, 척추손상"
              value={formData.protectorName}
              onChangeText={(text) => setFormData({...formData, disease: text})}
            />
          </InputGroup>
          <InputGroup>
            <Label>병원 <Required>*</Required></Label>
            <Input 
              placeholder="예) 치매: OO병원 신경과 / 척추: XO병원 물리치료과"
              value={formData.protectorName}
              onChangeText={(text) => setFormData({...formData, hospital : text})}
            />
          </InputGroup>
          <InputGroup>
            <Label>주소 </Label>
            <Input 
              placeholder="예) 서울특별시 중구 필동로1길 30 "
              value={formData.protectorName}
              onChangeText={(text) => setFormData({...formData, patientAddress : text})}
            />
          </InputGroup>
          <InputGroup>
            <Label>투약 정보 <Required>*</Required></Label>
            {medicines.map((medicine, index) => (
              <MedicineContainer key={index}>
                <MedicineInput
                  placeholder="예) 도네페질"
                  value={medicine}
                  onChangeText={(text) => handleMedicineChange(text, index)}
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

        <SubmitButton onPress={() => setModalVisible(true)/**이코드는 매칭 코드를 띄우는 버튼 */}>
          <SubmitText>요양사 매칭 코드 </SubmitText>
        </SubmitButton>
        <SubmitButton onPress={handleSubmit/**이코드는 작성을 완료해서 DB에 보내고 main으로 가는 버튼 */}>
          <SubmitText>작성 완료</SubmitText>
        </SubmitButton>
      </ScrollContainer>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalOverlay>
          <TouchableOpacity 
            style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}
            onPress={() => setModalVisible(false)}
          >
            <ModalContainer>
              <CloseButtonWrapper>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <CloseButtonText>×</CloseButtonText>
                </TouchableOpacity>
              </CloseButtonWrapper>
              <ModalTitle>보호자 매칭 코드</ModalTitle>
              <MatchingCode>F3Rr102A</MatchingCode>
              <ModalButton onPress={() => {
                copyToClipboard('F3Rr102A');
                setModalVisible(false);
              }}>
                <ModalButtonText>클립보드에 복사</ModalButtonText>
              </ModalButton>
            </ModalContainer>
          </TouchableOpacity>
        </ModalOverlay>
      </Modal>
    </Container>
  );
};

export default ProtectorInfo;