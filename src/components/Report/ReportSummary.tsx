import React from 'react';
import styled from 'styled-components/native';
import CheckBox from 'react-native-check-box';
import Pen from '../../assets/report/pen.svg';
import Book from '../../assets/home/book.svg';
import {TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// Styled Components
const Container = styled.View`
  background-color: #f8f8f8;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 10px;
  border: 1px solid #ddd;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BookIcon = styled(Book)`
  margin-right: 12px;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const Section = styled.View`
  margin-bottom: 12px;
`;

const SectionTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const CheckBoxGroup = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
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

// Props Type
interface ReportSummaryProps {
  report: {
    id: number;
    createdAt: string;
    specialNote: string;
    mealExcretionResponse: {
      mealMorningTakenStatus: boolean;
      mealAfternoonTakenStatus: boolean;
      mealEveningTakenStatus: boolean;
      excretionMorningTakenStatus: boolean;
      excretionAfternoonTakenStatus: boolean;
      excretionEveningTakenStatus: boolean;
    };
    medicationCheckResponse: {
      id: number;
      name: string;
      morningTakenStatus: boolean;
      afternoonTakenStatus: boolean;
      eveningTakenStatus: boolean;
    }[];
  };
  onDetailPress: () => void;
}

// Main Component
const ReportSummary: React.FC<ReportSummaryProps> = ({
  report,
  onDetailPress,
}) => {
  const navigation = useNavigation();

  return (
    <Container>
      {/* Header */}
      <Header>
        <TitleContainer>
          <BookIcon width={20} height={20} />
          <Title>{report.createdAt}</Title>
        </TitleContainer>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ReportUpdate', {careReportId: report.id})
          }>
          <Pen width={20} height={20} />
        </TouchableOpacity>
      </Header>

      {/* Meal and Excretion */}
      <Section>
        <SectionTitle>식사 여부</SectionTitle>
        <CheckBoxGroup>
          <CheckItem>
            <CheckBox
              isChecked={report.mealExcretionResponse.mealMorningTakenStatus}
            />
            <CheckText>아침</CheckText>
          </CheckItem>
          <CheckItem>
            <CheckBox
              isChecked={report.mealExcretionResponse.mealAfternoonTakenStatus}
            />
            <CheckText>점심</CheckText>
          </CheckItem>
          <CheckItem>
            <CheckBox
              isChecked={report.mealExcretionResponse.mealEveningTakenStatus}
            />
            <CheckText>저녁</CheckText>
          </CheckItem>
        </CheckBoxGroup>
      </Section>

      <Section>
        <SectionTitle>배변 여부</SectionTitle>
        <CheckBoxGroup>
          <CheckItem>
            <CheckBox
              isChecked={
                report.mealExcretionResponse.excretionMorningTakenStatus
              }
            />
            <CheckText>아침</CheckText>
          </CheckItem>
          <CheckItem>
            <CheckBox
              isChecked={
                report.mealExcretionResponse.excretionAfternoonTakenStatus
              }
            />
            <CheckText>점심</CheckText>
          </CheckItem>
          <CheckItem>
            <CheckBox
              isChecked={
                report.mealExcretionResponse.excretionEveningTakenStatus
              }
            />
            <CheckText>저녁</CheckText>
          </CheckItem>
        </CheckBoxGroup>
      </Section>

      {/* Medication */}
      <Section>
        <SectionTitle>투약 정보</SectionTitle>
        {report.medicationCheckResponse.map(medication => (
          <Section key={medication.id}>
            <SectionTitle>{medication.name}</SectionTitle>
            <CheckBoxGroup>
              <CheckItem>
                <CheckBox isChecked={medication.morningTakenStatus} />
                <CheckText>아침</CheckText>
              </CheckItem>
              <CheckItem>
                <CheckBox isChecked={medication.afternoonTakenStatus} />
                <CheckText>점심</CheckText>
              </CheckItem>
              <CheckItem>
                <CheckBox isChecked={medication.eveningTakenStatus} />
                <CheckText>저녁</CheckText>
              </CheckItem>
            </CheckBoxGroup>
          </Section>
        ))}
      </Section>

      {/* Special Note */}
      <Section>
        <SectionTitle>특이사항</SectionTitle>
        <Text>{report.specialNote || '없음'}</Text>
      </Section>

      {/* 자세히 보기 버튼 */}
      <DetailButton
        onPress={() =>
          navigation.navigate('ReportDetail', {careReportId: report.id})
        }>
        <ButtonText>자세히 보기</ButtonText>
      </DetailButton>
    </Container>
  );
};

export default ReportSummary;
