// Report.tsx
import React from 'react';
import styled from 'styled-components/native';
import {ScrollView, TouchableOpacity} from 'react-native';
import ReportSummary from '../components/Report/ReportSummary'; // 간병 보고서 요약 컴포넌트
import FloatingButton from '../components/Report/FloatingButton'; // 오른쪽 하단 + 버튼

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
  const handleAddReport = () => {
    navigation.navigate('ReportCreate'); // 간병 보고서 작성 페이지로 이동
  };

  return (
    <Container>
      <ReportList>
        {/* 간병 보고서 요약 컴포넌트 */}
        <ReportSummary />
        <ReportSummary />
        <ReportSummary />
        <ReportSummary />
        <ReportSummary />
        <ReportSummary />
        <ReportSummary />
      </ReportList>
      {/* 오른쪽 하단 + 버튼 */}
      <FloatingButton onPress={handleAddReport} />
    </Container>
  );
};

export default Report;
