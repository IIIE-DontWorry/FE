import React, {useEffect, useState} from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import ApiService from '../../utils/api';
import ReportIcon from '../../assets/bottomnavigation/report.svg';
import Book from '../../assets/home/book.svg';

const Section = styled.View`
  margin: 16px;
  padding: 16px;
  background-color: #f8f8f8;
  border-radius: 10px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconContainer = styled.View`
  margin-right: 8px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const MoreButton = styled.TouchableOpacity`
  padding: 4px;
`;

const MoreText = styled.Text`
  color: #888;
`;

const ItemContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-top: 20px;
`;

const Item = styled.TouchableOpacity`
  width: 30%; /* 각 항목의 너비 */
  align-items: center;
  margin-right: 3%; /* 간격 조정 */
  margin-bottom: 20px;
`;

const BookImageContainer = styled.View`
  width: 70px;
  height: 70px;
  margin-bottom: 4px;
  align-items: center;
  justify-content: center;
`;

const ItemDate = styled.Text`
  font-size: 14px;
  color: #444;
  text-align: center;
`;

const SmallText = styled.Text`
  font-size: 10px;
  color: #444;
  margin-top: 2px;
`;

const EmptyMessageContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const EmptyMessageText = styled.Text`
  font-size: 18px;
  color: #888;
  font-weight: 600;
  text-align: center;
`;
const RecentReports = () => {
  const [reports, setReports] = useState([]);
  const navigation = useNavigation();

  const fetchReports = async () => {
    try {
      const careGiverId = 1;
      const page = 0;
      const size = 3;
      const sort = 'postedDate,desc';

      const response = await ApiService.get(
        `care-reports/${careGiverId}?page=${page}&size=${size}&sort=${sort}`,
      );

      if (response.status === 'success' && response.data.content) {
        setReports(response.data.content);
        console.log('Fetched Reports:', response.data.content); // 디버깅용
      } else {
        console.log('No reports found:', response.data);
        setReports([]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error.message);
      Alert.alert('오류', '보고서를 가져오는 중 문제가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <Section>
      <SectionHeader>
        <SectionTitleContainer>
          <IconContainer>
            <ReportIcon width={18} height={18} />
          </IconContainer>
          <SectionTitle>최근 간병 보고서</SectionTitle>
        </SectionTitleContainer>
        <MoreButton onPress={() => navigation.navigate('Report')}>
          <MoreText>더보기 &gt;</MoreText>
        </MoreButton>
      </SectionHeader>
      {reports.length === 0 ? (
        <EmptyMessageContainer>
          <EmptyMessageText>
            최근 간병보고서가 아직 작성되지 않았어요!
          </EmptyMessageText>
        </EmptyMessageContainer>
      ) : (
        <ItemContainer>
          {reports.map(report => (
            <Item
              key={report.id}
              onPress={() => {
                console.log('Navigating with reportId:', report.id); // 디버깅용
                navigation.navigate('ReportDetail', {careReportId: report.id});
              }}>
              <BookImageContainer>
                <Book width={70} height={70} />
              </BookImageContainer>
              <ItemDate>{report.postedDate}</ItemDate>
              <SmallText>간병인</SmallText>
            </Item>
          ))}
        </ItemContainer>
      )}
    </Section>
  );
};

export default RecentReports;
