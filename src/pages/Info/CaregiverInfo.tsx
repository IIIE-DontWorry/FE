    // src/pages/Info/CaregiverInfo.tsx
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, Modal, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Landing: undefined;
  Main: undefined;
  UserCategory: undefined;
};

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
  color: #00D6A3
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

const ExperienceContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const ExperienceInput = styled(Input)`
  flex: 1;
  margin-right: 10px;
`;

const IconButton = styled.TouchableOpacity<{ remove?: boolean }>`
  padding: 5px 10px;
  background-color: ${props => props.remove ? '#C9E270' : '#00D6A3'};
  border-radius: 5px;
  margin-left: 5px;
`;


const IconText = styled.Text`
  color: white;
  font-size: 20px;
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


const CaregiverInfo = () => {
  const navigation = useNavigation<NavigationProp>();
  const [experiences, setExperiences] = useState(['']);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    workplace: '',
    matchingCode: '',
  });

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

  const handleSubmit = () => {
    // TODO: 유효성 검사 및 데이터 처리
    navigation.navigate('Main');
  };

  return (
    <Container>
      <ScrollContainer>
        <Section>
          <SectionTitle>간병인 정보</SectionTitle>
          <InputGroup>
            <Label>이름 <Required>*</Required></Label>
            <Input 
              placeholder="예) 홍길동"
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
            />
          </InputGroup>
          <InputGroup>
            <Label>연락처 <Required>*</Required></Label>
            <Input 
              placeholder="예) 010-1234-5678"
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
            />
          </InputGroup>
          <InputGroup>
            <Label>소속 <Required>*</Required></Label>
            <Input 
              placeholder="예) 서울아산병원"
              value={formData.workplace}
              onChangeText={(text) => setFormData({...formData, workplace: text})}
            />
          </InputGroup>
          
          <InputGroup>
            <Label>경력</Label>
            {experiences.map((experience, index) => (
              <ExperienceContainer key={index}>
                <ExperienceInput
                  placeholder="예) 2020-2023 서울아산병원"
                  value={experience}
                  onChangeText={(text) => handleExperienceChange(text, index)}
                />
                {index === experiences.length - 1 ? (
                <IconButton onPress={addExperience}>
                    <IconText>+</IconText>
                </IconButton>
                ) : (
                <IconButton remove={true} onPress={() => removeExperience(index)}>
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
              placeholder="보호자 Code 입력"
              value={formData.matchingCode}
              onChangeText={(text) => setFormData({...formData, matchingCode: text})}
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