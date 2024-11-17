import React, {useState} from 'react';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native';
import ReportSummary from '../../components/Report/ReportSummary'; // 요약 컴포넌트
import FloatingButton from '../../components/Report/FloatingButton'; // + 버튼

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
      <ReportList>
        {reports.map((report, index) => (
          <ReportSummary
            key={index}
            report={report}
            onDetailPress={() => handleDetail(report)}
          />
        ))}
      </ReportList>
      {/* 오른쪽 하단 + 버튼 */}
      <FloatingButton
        onPress={() => navigation.navigate('ReportCreate', {handleAddReport})}
      />
    </Container>
  );
};

export default Report;
