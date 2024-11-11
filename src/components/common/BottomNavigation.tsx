import React from 'react';
import styled from 'styled-components/native';

function BottomNavigation({state, descriptors, navigation}: any) {
  return (
    <Container>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const label = options.tabBarLabel ?? route.name;
        const isFocused = state.index === index;

        return (
          <Tab
            key={index}
            onPress={() => navigation.navigate(route.name)}
            isFocused={isFocused}>
            <TabLabel isFocused={isFocused}>{label}</TabLabel>
          </Tab>
        );
      })}
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 16px;
  background-color: #fff;
  border-top-width: 1px;
  border-top-color: #e0e0e0;
`;

const Tab = styled.TouchableOpacity<{isFocused: boolean}>`
  padding: 8px;
  border-bottom-width: ${({isFocused}) => (isFocused ? '2px' : '0')};
  border-bottom-color: blue;
`;

const TabLabel = styled.Text<{isFocused: boolean}>`
  color: ${({isFocused}) => (isFocused ? 'blue' : 'gray')};
`;

export default BottomNavigation;
