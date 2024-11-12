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

const ReportScreen = () => {
  return (
    <Container>
      <Text>최근 간병 보고서</Text>
    </Container>
  );
};

export default ReportScreen;
