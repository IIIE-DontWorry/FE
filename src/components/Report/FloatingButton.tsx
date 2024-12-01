import React from 'react';
import {TouchableOpacity} from 'react-native'; 
import styled from 'styled-components/native';
import BtnFloating from '../../assets/report/btn_floating.svg'; 

const FloatingButtonContainer = styled(TouchableOpacity)`
  position: absolute;
  right: 16px;
  bottom: 16px;
  width: 56px;
  height: 56px;
`;

const FloatingButton = ({onPress}) => {
  return (
    <FloatingButtonContainer onPress={onPress}>
      <BtnFloating width="100%" height="100%" />
    </FloatingButtonContainer>
  );
};

export default FloatingButton;
