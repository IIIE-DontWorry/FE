import React from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DontWorryLogo from '../../assets/navigation/logo.svg'; // 로고 이미지 경로
import BellIcon from '../../assets/navigation/bell.svg';
import ProfileIcon from '../../assets/navigation/profile.svg';

type TopNavigationProps = {
  title?: string;
};

function TopNavigation({title}: TopNavigationProps) {
  const navigation = useNavigation();

  return (
    <Container>
      <LeftSection>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <DontWorryLogo width={40} height={40} />
        </TouchableOpacity>
      </LeftSection>
      <CenterSection>{title ? <Title>{title}</Title> : null}</CenterSection>
      <RightSection>
        <TouchableOpacity>
          <BellIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <ProfileIcon width={24} height={24} />
        </TouchableOpacity>
      </RightSection>
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #fff;
`;

const LeftSection = styled.View`
  flex: 1;
`;

const CenterSection = styled.View`
  flex: 2;
  align-items: center;
`;

const RightSection = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  gap: 10px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

export default TopNavigation;
