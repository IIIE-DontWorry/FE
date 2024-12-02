import React, {useEffect, useState} from 'react';
import {ScrollView, Text, Alert, View, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import CheckBox from 'react-native-check-box';
import ApiService from '../../utils/api';
import BackIcon from '../../assets/common/back-icon.svg'; // Back-icon 추가

const Container = styled.ScrollView`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between; /* 좌우 배치 */
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const BackButton = styled.TouchableOpacity`
  flex: 1;
  justify-content: flex-start; /* 왼쪽 정렬 */
`;

const HeaderTitleContainer = styled.View`
  flex: 2;
  margin-right: 70px;
`;

const HeaderText = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const Section = styled.View`
  margin: 16px;
  padding: 16px;
  background-color: #f8f8f8;
  border-radius: 10px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const TimeEntry = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
  padding: 8px 0;
`;

const TimeText = styled.Text`
  color: #333;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const CheckBoxGroup = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

const CheckItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 25px;
`;

const CheckText = styled.Text`
  margin-left: 8px;
  color: #555;
`;

const ReadOnlyText = styled.Text`
  color: #555;
  margin-bottom: 8px;
`;

const ReportDetail = ({route, navigation}) => {
  const {careReportId} = route.params;
  const [report, setReport] = useState(null);

  useEffect(() => {
    console.log('Received reportId:', careReportId); // 디버깅
    const fetchReportDetails = async () => {
      try {
        const response = await ApiService.get(
          `care-reports/details/${careReportId}`,
        );
        if (response.status === 'success') {
          setReport(response.data);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error('Error fetching report details:', error);
        Alert.alert('오류', '보고서를 가져오는 중 문제가 발생했습니다.');
        navigation.goBack();
      }
    };

    fetchReportDetails();
  }, [careReportId]);

  if (!report) {
    return (
      <Container>
        <Header>
          <BackButton onPress={() => navigation.goBack()}>
            <BackIcon width={24} height={24} />
          </BackButton>
          <HeaderTitleContainer>
            <HeaderText>로딩 중...</HeaderText>
          </HeaderTitleContainer>
        </Header>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackIcon width={24} height={24} />
        </BackButton>
        <HeaderTitleContainer>
          <HeaderText>{report.createdAt} 간병 보고서</HeaderText>
        </HeaderTitleContainer>
      </Header>

      {/* 날짜 섹션 */}
      <Section>
        <SectionTitle>날짜</SectionTitle>
        <ReadOnlyText>{report.createdAt}</ReadOnlyText>
      </Section>

      {/* 시간에 따른 일지 */}
      <Section>
        <SectionTitle>시간에 따른 일지</SectionTitle>
        {report.careScheduleResponses.map(entry => (
          <TimeEntry key={entry.id}>
            <TimeText>
              {entry.activityAt} - {entry.description}
            </TimeText>
          </TimeEntry>
        ))}
      </Section>

      {/* 식사 및 배변 여부 */}
      <Section>
        <SectionTitle>식사 및 배변 여부</SectionTitle>
        {['meal', 'excretion'].map(category => (
          <View key={category}>
            <Text style={{fontWeight: 'bold', marginBottom: 4}}>
              {category === 'meal' ? '식사 여부' : '배변 활동'}
            </Text>
            <CheckBoxGroup>
              {['Morning', 'Afternoon', 'Evening'].map(time => (
                <CheckItem key={`${category}${time}`}>
                  <CheckBox
                    isChecked={
                      report.mealExcretionResponse[
                        `${category}${time}TakenStatus`
                      ] || false
                    }
                    disabled={true}
                  />
                  <CheckText>
                    {time === 'Morning'
                      ? '아침'
                      : time === 'Afternoon'
                      ? '점심'
                      : '저녁'}
                  </CheckText>
                </CheckItem>
              ))}
            </CheckBoxGroup>
          </View>
        ))}
      </Section>

      {/* 투약 정보 */}
      <Section>
        <SectionTitle>투약 정보</SectionTitle>
        {report.medicationCheckResponse.map(med => (
          <View key={med.id}>
            <Text style={{fontWeight: 'bold', marginBottom: 4}}>
              {med.name}
            </Text>
            <CheckBoxGroup>
              {['morning', 'afternoon', 'evening'].map(time => (
                <CheckItem key={`${med.id}-${time}`}>
                  <CheckBox
                    isChecked={med[`${time}TakenStatus`]}
                    disabled={true}
                  />
                  <CheckText>
                    {time === 'morning'
                      ? '아침'
                      : time === 'afternoon'
                      ? '점심'
                      : '저녁'}
                  </CheckText>
                </CheckItem>
              ))}
            </CheckBoxGroup>
          </View>
        ))}
      </Section>

      {/* 특이사항 */}
      <Section>
        <SectionTitle>특이사항</SectionTitle>
        <ReadOnlyText>{report.specialNote || '없음'}</ReadOnlyText>
      </Section>

      {/* 보호자 요청사항 */}
      <Section>
        <SectionTitle>보호자 특별 요청사항</SectionTitle>
        {report.guardianResponses.length > 0 ? (
          report.guardianResponses.map(req => (
            <CheckItem key={req.id}>
              <CheckBox isChecked={req.isCheck} disabled={true} />
              <CheckText>{req.request}</CheckText>
            </CheckItem>
          ))
        ) : (
          <ReadOnlyText>특별 요청사항 없음</ReadOnlyText>
        )}
      </Section>
    </Container>
  );
};

export default ReportDetail;
