// src/pages/AcquaintanceInfo.tsx
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';

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

const PickerContainer = styled.View`
  border-width: 1px;
  border-color: #DDDDDD;
  border-radius: 8px;
  background-color: #F5F5F5;
  margin-top: 5px;
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

const AcquaintanceInfo = () => {
  const navigation = useNavigation<NavigationProp>();
  const [formData, setFormData] = useState({
    name: '',
    matchingCode: '',
    relationship: '',
  });

  const handleSubmit = () => {
    // TODO: 유효성 검사 및 데이터 처리
    navigation.navigate('Main');
  };

  return (
    <Container>
      <ScrollContainer>
        <Section>
          <InputGroup>
            <Label>이름 <Required>*</Required></Label>
            <Input 
              placeholder="예) 홍길동"
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
            />
          </InputGroup>

          <InputGroup>
            <Label>보호자 매칭 코드 <Required>*</Required></Label>
            <Input 
              placeholder="보호자에게 받은 매칭 코드를 입력해주세요"
              value={formData.matchingCode}
              onChangeText={(text) => setFormData({...formData, matchingCode: text})}
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
                <Picker.Item label="가족" value="family" />
                <Picker.Item label="친구" value="friend" />
                <Picker.Item label="이웃" value="neighbor" />
                <Picker.Item label="직장동료" value="coworker" />
                <Picker.Item label="기타" value="other" />
              </Picker>
            </PickerContainer>
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