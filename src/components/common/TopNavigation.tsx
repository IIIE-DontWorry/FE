import React from 'react';
import styled from 'styled-components/native';

type TopNavigationProps = {
  title: string;
};

function TopNavigation({title}: TopNavigationProps) {
  return (
    <Container>
      <Title>{title}</Title>
    </Container>
  );
}

const Container = styled.View`
  padding: 16px;
  background-color: #fff;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

export default TopNavigation;
