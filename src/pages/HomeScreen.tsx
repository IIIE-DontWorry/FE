import React from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';

const Container = styled.ScrollView`
  flex: 1;
  background-color: #ffffff;
`;

const Section = styled.View`
  margin: 16px;
  padding: 16px;
  background-color: #f8f8f8;
  border-radius: 10px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const HomeScreen = () => {
  return (
    <Container>
      <Section>
        <SectionTitle>간병인의 메세지</SectionTitle>
        <Text>간병인이 당신의 메세지를 확인할 수 있습니다.</Text>
      </Section>
    </Container>
  );
};

export default HomeScreen;
