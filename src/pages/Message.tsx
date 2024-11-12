import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const Text = styled.Text`
  font-size: 18px;
`;

const MessageScreen = () => {
  return (
    <Container>
      <Text>최근 쪽지</Text>
    </Container>
  );
};

export default MessageScreen;
