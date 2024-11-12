import React from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import Pen from '../../assets/report/pen.svg';
import Book from '../../assets/home/book.svg';

const Container = styled.View`
  background-color: #f8f8f8;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 10px;
  border: 1px solid #ddd;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const Description = styled.Text`
  margin-top: 8px;
  color: #555;
`;

const DetailButton = styled(TouchableOpacity)`
  margin-top: 12px;
  background-color: #8ce;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 14px;
`;

const ReportSummary = ({navigation}) => {
  const handleDetailPress = () => {
    navigation.navigate('ReportDetail'); // 간병 보고서 상세 페이지로 이동
  };

  return (
    <Container>
      <Row>
        <Title>2024년 10월 16일</Title>
        <TouchableOpacity>
          <Pen width={20} height={20} />
        </TouchableOpacity>
      </Row>
      <Row>
        <Book width={50} height={50} />
        <Description>배변활동, 식사여부 등 간병 보고서 간략 정보</Description>
      </Row>
      <DetailButton onPress={handleDetailPress}>
        <ButtonText>자세히 보기</ButtonText>
      </DetailButton>
    </Container>
  );
};

export default ReportSummary;
