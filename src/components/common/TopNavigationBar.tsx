// src/components/common/TopNavigationBar.tsx
import React from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DontWorryLogo from '../../assets/topnavigation/logo.svg';
import BellIcon from '../../assets/topnavigation/bell.svg';
import ProfileIcon from '../../assets/topnavigation/profile.svg';

type TopNavigationProps = {
  title?: string;
};

function TopNavigationBar({title}: TopNavigationProps) {
  const navigation = useNavigation();

  return (
    <Container>
      <LeftSection>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <DontWorryLogo width={50} height={50} />
        </TouchableOpacity>
      </LeftSection>
      <CenterSection>{title ? <Title>{title}</Title> : null}</CenterSection>
      <RightSection>
        <TouchableOpacity
          onPress={
            () =>
              navigation.navigate(
                'Landing',
              ) /**알림 페이지를 구성하기 전 임시 네비게이트*/
          }>
          <BellIcon width={30} height={30} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={
            () =>
              navigation.navigate(
                'Landing',
              ) /**마이 페이지를 구성하기 전 임시 네비게이트*/
          }>
          <ProfileIcon width={30} height={30} />
        </TouchableOpacity>
      </RightSection>
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #fff;
  height: 60px; /* 높이 고정 */
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
  color: black;
`;

export default TopNavigationBar;
