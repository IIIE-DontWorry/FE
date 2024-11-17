import React, {useState} from 'react';
import styled from 'styled-components/native';
import {ScrollView, Text, View} from 'react-native';
import ReportSummary from '../../components/Report/ReportSummary';
import FloatingButton from '../../components/Report/FloatingButton';

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  padding: 16px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const HeaderText = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const ReportList = styled(ScrollView)`
  padding: 16px;
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

const Report = ({navigation}) => {
  const [reports, setReports] = useState([]); // 보고서 리스트 상태

  const handleAddReport = newReport => {
    setReports(prevReports => [...prevReports, newReport]); // 새로운 보고서 추가
  };

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
      {/* 오른쪽 하단 + 버튼 */}
      <FloatingButton
        onPress={() => navigation.navigate('ReportCreate', {handleAddReport})}
      />
    </Container>
  );
};

export default Report;
