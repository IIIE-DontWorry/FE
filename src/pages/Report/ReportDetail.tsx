import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import styled from 'styled-components/native';

const Container = styled.ScrollView`
  flex: 1;
  background-color: #ffffff;
  padding: 16px;
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

const Section = styled.View`
  margin: 16px 0;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const DetailText = styled.Text`
  color: #555;
`;

const ReportDetail = ({route}) => {
  const {report} = route.params;

  return (
    <Container>
      <Header>
        <HeaderText>{report.date} 보고서</HeaderText>
      </Header>
      <Section>
        <SectionTitle>배변활동</SectionTitle>
        <DetailText>
          {Object.keys(report.activities.bowel)
            .map(key => `${key}: ${report.activities.bowel[key] ? 'O' : 'X'}`)
            .join(', ')}
        </DetailText>
      </Section>
      <Section>
        <SectionTitle>식사여부</SectionTitle>
        <DetailText>
          {Object.keys(report.activities.meal)
            .map(key => `${key}: ${report.activities.meal[key] ? 'O' : 'X'}`)
            .join(', ')}
        </DetailText>
      </Section>
      <Section>
        <SectionTitle>투약 정보</SectionTitle>
        {Object.entries(report.medications).map(([key, value]) => (
          <DetailText key={key}>
            {key}:{' '}
            {Object.keys(value)
              .map(time => `${time}: ${value[time] ? 'O' : 'X'}`)
              .join(', ')}
          </DetailText>
        ))}
      </Section>
      <Section>
        <SectionTitle>특이사항</SectionTitle>
        <DetailText>{report.notes || '없음'}</DetailText>
      </Section>
    </Container>
  );
};

export default ReportDetail;
