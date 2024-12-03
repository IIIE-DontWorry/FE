import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native';
import styled from 'styled-components/native';
import ApiService from '../../utils/api';
import FloatingButton from '../../components/Report/FloatingButton';
import ReportSummary from '../../components/Report/ReportSummary';
import {useFocusEffect} from '@react-navigation/native';
const Container = styled.View`
  flex: 1;
  background-color: #f8f9fa;
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

const Report: React.FC<{navigation: any}> = ({navigation}) => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReports = async () => {
    try {
      const careGiverId = 1;
      const page = 0;
      const size = 3;
      const sort = 'postedDate,desc';

      console.log(
        `Fetching reports from: care-reports/${careGiverId}?page=${page}&size=${size}&sort=${sort}`,
      );
      const response = await ApiService.get(
        `care-reports/${careGiverId}?page=${page}&size=${size}&sort=${sort}`,
      );
      console.log('API Response:', response);

      if (response.status === 'success') {
        console.log('Reports Content:', response.data.content);
        setReports(response.data.content);
      } else {
        console.error('API did not return success status:', response);
      }
    } catch (error) {
      console.error('Fetch Reports Error:', error.message);
      Alert.alert('오류', '보고서를 가져오는 중 문제가 발생했습니다.');
    }
  };

  // 화면이 포커스될 때마다 리로드
  useFocusEffect(
    React.useCallback(() => {
      fetchReports();
    }, []),
  );

  const handleCreateReport = async () => {
    try {
      const careGiverId = 1;
      const response = await ApiService.post(
        `care-reports/${careGiverId}/init`,
      );
      if (response.status === 'success') {
        navigation.navigate('ReportCreate', {report: response.data});
      }
    } catch (error) {
      Alert.alert('오류', '보고서를 생성하는 중 문제가 발생했습니다.');
    }
  };

  return (
    <Container>
      {reports.length > 0 ? (
        <ReportList>
          {reports.map(report => (
            <ReportSummary
              key={report.id}
              report={report}
              onDetailPress={() =>
                navigation.navigate('ReportDetail', {report})
              }
            />
          ))}
        </ReportList>
      ) : (
        <EmptyMessageContainer>
          <EmptyMessageText>아직 작성된 보고서가 없습니다.</EmptyMessageText>
        </EmptyMessageContainer>
      )}
      <FloatingButton onPress={handleCreateReport} />
    </Container>
  );
};

export default Report;
