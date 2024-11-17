import React from 'react';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native';
import ReportSummary from '../../components/Report/ReportSummary';
import FloatingButton from '../../components/Report/FloatingButton';
import {useReports} from '../../store/ReportContext'; // Context 사용

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const HeaderText = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const EmptyMessageContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const EmptyMessageText = styled.Text`
  font-size: 16px;
  color: #888;
`;

const ReportList = styled(ScrollView)`
  padding: 16px;
`;

const Report = ({navigation}) => {
  const {reports} = useReports(); // Context에서 보고서 데이터 가져옴

  const handleDetail = report => {
    navigation.navigate('ReportDetail', {report}); // 상세 페이지로 이동하며 데이터 전달
  };

  return (
    <Container>
      {reports.length > 0 ? (
        <ReportList>
          {reports.map((report, index) => (
            <ReportSummary
              key={index}
              report={report}
              onDetailPress={() => handleDetail(report)}
            />
          ))}
        </ReportList>
      ) : (
        <EmptyMessageContainer>
          <EmptyMessageText>아직 작성된 간병보고서가 없어요!</EmptyMessageText>
        </EmptyMessageContainer>
      )}
      <FloatingButton onPress={() => navigation.navigate('ReportCreate')} />
    </Container>
  );
};

export default Report;
