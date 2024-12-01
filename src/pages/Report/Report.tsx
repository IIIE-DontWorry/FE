import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native';
import styled from 'styled-components/native';
import ApiService from '../../utils/api'; // ApiService 가져오기
import FloatingButton from '../../components/Report/FloatingButton';
// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: #f8f9fa;
`;

const HeaderText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
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

const ReportList = styled(ScrollView)`
  padding: 16px;
`;

const FloatingButtonText = styled.Text`
  font-size: 24px;
  color: #fff;
`;

const ReportContainer = styled.View`
  background-color: #f8f8f8;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 10px;
  border: 1px solid #ddd;
`;

const ReportHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ReportTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const ReportDetailButton = styled.TouchableOpacity`
  background-color: #8ce;
  padding: 8px 12px;
  border-radius: 8px;
`;

const ReportDetailButtonText = styled.Text`
  color: #fff;
  font-size: 14px;
`;

// Main Component
const Report = ({navigation}) => {
  const [reports, setReports] = useState([]);

  const handleCreateReport = async () => {
    try {
      const careGiverId = 1; // 간병인 ID
      const endpoint = `care-reports/${careGiverId}/init`;

      const response = await ApiService.post(endpoint);

      if (response.status === 'success') {
        Alert.alert('성공', '새 간병 보고서가 생성되었습니다.');
        navigation.navigate('ReportCreate', {report: response.data}); // 생성된 보고서를 ReportCreate로 전달
      } else {
        Alert.alert(
          '실패',
          response.message || '간병 보고서 생성에 실패했습니다.',
        );
      }
    } catch (error) {
      Alert.alert('오류', '간병 보고서 생성 중 문제가 발생했습니다.');
    }
  };
  const handleDetail = report => {
    navigation.navigate('ReportDetail', {report}); // 상세 페이지로 이동
  };

  return (
    <Container>
      {reports.length > 0 ? (
        <ReportList>
          {reports.map((report, index) => (
            <ReportContainer key={index}>
              <ReportHeader>
                <ReportTitle>{report.createdAt}</ReportTitle>
                <ReportDetailButton onPress={() => handleDetail(report)}>
                  <ReportDetailButtonText>자세히 보기</ReportDetailButtonText>
                </ReportDetailButton>
              </ReportHeader>
              <Text>{report.specialNote || '특이사항 없음'}</Text>
            </ReportContainer>
          ))}
        </ReportList>
      ) : (
        <EmptyMessageContainer>
          <EmptyMessageText>아직 작성된 간병보고서가 없어요!</EmptyMessageText>
        </EmptyMessageContainer>
      )}

      <FloatingButton onPress={handleCreateReport} />
    </Container>
  );
};

export default Report;
