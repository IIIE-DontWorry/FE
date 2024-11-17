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

const Description = styled.View`
  margin-top: 8px;
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

const CheckItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

const CheckText = styled.Text`
  margin-left: 8px;
  color: #555;
`;

const ReportSummary = ({report, navigation}) => {
  const handleDetailPress = () => {
    navigation.navigate('ReportDetail', {report}); // 상세 페이지로 데이터 전달
  };

  return (
    <Container>
      <Row>
        <Title>{report.date}</Title>
        <TouchableOpacity>
          <Pen width={20} height={20} />
        </TouchableOpacity>
      </Row>
      <Row>
        <Book width={50} height={50} />
        <Description>
          <CheckItem>
            <CheckText>
              배변활동:{' '}
              {Object.keys(report.activities.bowel)
                .filter(key => report.activities.bowel[key])
                .join(', ') || '없음'}
            </CheckText>
          </CheckItem>
          <CheckItem>
            <CheckText>
              식사여부:{' '}
              {Object.keys(report.activities.meal)
                .filter(key => report.activities.meal[key])
                .join(', ') || '없음'}
            </CheckText>
          </CheckItem>
          <CheckItem>
            <CheckText>
              투약:{' '}
              {Object.keys(report.medications)
                .filter(key =>
                  Object.values(report.medications[key]).some(value => value),
                )
                .join(', ') || '없음'}
            </CheckText>
          </CheckItem>
          <CheckItem>
            <CheckText>특이사항: {report.notes || '없음'}</CheckText>
          </CheckItem>
        </Description>
      </Row>
      <DetailButton onPress={handleDetailPress}>
        <ButtonText>자세히 보기</ButtonText>
      </DetailButton>
    </Container>
  );
};

export default ReportSummary;
