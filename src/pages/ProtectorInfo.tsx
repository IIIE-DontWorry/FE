// src/pages/ProtectorInfo.tsx
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, Modal } from 'react-native';

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

const ProtectorInfo = () => {
  const [modalVisible, setModalVisible] = useState(false);
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
    details: '',
  });

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
              onChangeText={(text) => setFormData({...formData, protectorName: text})}
            />
          </InputGroup>
          {/* 다른 입력 필드들도 같은 형식으로 구현 */}
        </Section>

        <SubmitButton onPress={() => setModalVisible(true)}>
          <SubmitText>작성 완료</SubmitText>
        </SubmitButton>
      </ScrollContainer>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>보호자 매칭 코드</ModalTitle>
            <MatchingCode>F3Rr102A</MatchingCode>
            <ModalButton onPress={() => setModalVisible(false)}>
              <ModalButtonText>저장</ModalButtonText>
            </ModalButton>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
};

export default ProtectorInfo;