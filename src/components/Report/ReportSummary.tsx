import React from 'react';
import styled from 'styled-components/native';
import CheckBox from 'react-native-check-box';
import Pen from '../../assets/report/pen.svg';
import Book from '../../assets/home/book.svg';
import {TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

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

const ReportSummary = ({report, onDetailPress}) => {
  const navigation = useNavigation();

  return (
    <Container>
      {/* Header */}
      <Header>
        <TitleContainer>
          <BookIcon width={20} height={20} />
          <Title>{report.date}</Title>
        </TitleContainer>
        <TouchableOpacity
          onPress={
            () => navigation.navigate('ReportUpdate', {report}) // 'ReportUpdate'로 이동
          }>
          <Pen width={20} height={20} />
        </TouchableOpacity>
      </Header>

      {/* 배변활동 */}
      <Section>
        <SectionTitle>배변활동</SectionTitle>
        <CheckBoxGroup>
          <CheckItem>
            <CheckBox isChecked={report.activities.bowel.morning} />
            <CheckText>아침</CheckText>
          </CheckItem>
          <CheckItem>
            <CheckBox isChecked={report.activities.bowel.afternoon} />
            <CheckText>점심</CheckText>
          </CheckItem>
          <CheckItem>
            <CheckBox isChecked={report.activities.bowel.evening} />
            <CheckText>저녁</CheckText>
          </CheckItem>
        </CheckBoxGroup>
      </Section>

      {/* 식사여부 */}
      <Section>
        <SectionTitle>식사여부</SectionTitle>
        <CheckBoxGroup>
          <CheckItem>
            <CheckBox isChecked={report.activities.meal.morning} />
            <CheckText>아침</CheckText>
          </CheckItem>
          <CheckItem>
            <CheckBox isChecked={report.activities.meal.afternoon} />
            <CheckText>점심</CheckText>
          </CheckItem>
          <CheckItem>
            <CheckBox isChecked={report.activities.meal.evening} />
            <CheckText>저녁</CheckText>
          </CheckItem>
        </CheckBoxGroup>
      </Section>

      {/* 투약 여부 */}
      <Section>
        <SectionTitle>투약여부</SectionTitle>
        <CheckBoxGroup>
          <CheckItem>
            <CheckBox isChecked={report.medications.protein.morning} />
            <CheckText>단백질</CheckText>
          </CheckItem>
          <CheckItem>
            <CheckBox isChecked={report.medications.arginine.morning} />
            <CheckText>아르기닌</CheckText>
          </CheckItem>
          <CheckItem>
            <CheckBox isChecked={report.medications.creatine.morning} />
            <CheckText>크레아틴</CheckText>
          </CheckItem>
          <CheckItem>
            <CheckBox isChecked={report.medications.betaAlanine.morning} />
            <CheckText>베타알라닌</CheckText>
          </CheckItem>
        </CheckBoxGroup>
      </Section>

      {/* 특이사항 */}
      <Section>
        <SectionTitle>특이사항</SectionTitle>
        <Text>{report.notes || '없음'}</Text>
      </Section>

      {/* 자세히 보기 버튼 */}
      <DetailButton onPress={onDetailPress}>
        <ButtonText>자세히 보기</ButtonText>
      </DetailButton>
    </Container>
  );
};

export default ReportSummary;
