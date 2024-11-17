import React from 'react';
import {ScrollView, Text, View, TextInput} from 'react-native';
import styled from 'styled-components/native';
import CheckBox from 'react-native-check-box';

const Container = styled.ScrollView`
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

const ReadOnlyTextInput = styled(TextInput)`
  height: 80px;
  border-color: #ddd;
  border-width: 1px;
  padding: 8px;
  border-radius: 8px;
  background-color: #f3f3f3; /* 수정 불가 영역의 배경 색 */
  color: #555; /* 텍스트 색상 */
`;

const TimeEntry = styled.View`
  margin-bottom: 8px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f3f3f3;
`;

const TimeText = styled.Text`
  color: #333;
`;

const CheckBoxWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
  margin-bottom: 8px;
`;

const ReportDetail = ({route}) => {
  const {report} = route.params;

  return (
    <Container>
      <Header>
        <HeaderText>{report.date} 보고서</HeaderText>
      </Header>

      {/* 날짜 섹션 */}
      <Section>
        <SectionTitle>날짜</SectionTitle>
        <Text>{report.date}</Text>
      </Section>

      {/* 시간에 따른 일지 섹션 */}
      <Section>
        <SectionTitle>시간에 따른 일지</SectionTitle>
        {report.timeEntries && report.timeEntries.length > 0 ? (
          report.timeEntries.map((entry, index) => (
            <TimeEntry key={index}>
              <TimeText>{entry}</TimeText>
            </TimeEntry>
          ))
        ) : (
          <Text>작성된 일지가 없습니다.</Text>
        )}
      </Section>

      {/* 배변활동 및 식사여부 */}
      <Section>
        <SectionTitle>배변활동 및 식사여부</SectionTitle>
        <Text style={{color: '#888', fontSize: 12, marginBottom: 8}}>
          ※ 아침, 점심, 저녁 순서대로 확인해주세요
        </Text>
        {['배변활동', '식사여부'].map((type, idx) => (
          <View key={idx}>
            <Text style={{fontWeight: 'bold', marginBottom: 4}}>{type}</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 8,
              }}>
              {['morning', 'afternoon', 'evening'].map(time => (
                <CheckBoxWrapper key={`${type}-${time}`}>
                  <CheckBox
                    isChecked={
                      report.activities[type === '배변활동' ? 'bowel' : 'meal'][
                        time
                      ]
                    }
                    disabled={true} // 체크박스 수정 불가
                  />
                  <Text>
                    {time === 'morning'
                      ? '아침'
                      : time === 'afternoon'
                      ? '점심'
                      : '저녁'}
                  </Text>
                </CheckBoxWrapper>
              ))}
            </View>
          </View>
        ))}
      </Section>

      {/* 투약 체크 리스트 */}
      <Section>
        <SectionTitle>투약 체크 리스트</SectionTitle>
        <Text style={{color: '#888', fontSize: 12, marginBottom: 8}}>
          ※ 아침, 점심, 저녁 순서대로 확인해주세요
        </Text>
        {Object.entries(report.medications).map(([key, value]) => (
          <View key={key}>
            <Text style={{fontWeight: 'bold', marginBottom: 4}}>
              {key === 'protein'
                ? '단백질'
                : key === 'arginine'
                ? '아르기닌'
                : key === 'creatine'
                ? '크레아틴'
                : '베타알라닌'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 8,
              }}>
              {['morning', 'afternoon', 'evening'].map(time => (
                <CheckBoxWrapper key={`${key}-${time}`}>
                  <CheckBox
                    isChecked={value[time]}
                    disabled={true} // 체크박스 수정 불가
                  />
                  <Text>
                    {time === 'morning'
                      ? '아침'
                      : time === 'afternoon'
                      ? '점심'
                      : '저녁'}
                  </Text>
                </CheckBoxWrapper>
              ))}
            </View>
          </View>
        ))}
      </Section>

      {/* 특이사항 */}
      <Section>
        <SectionTitle>특이사항</SectionTitle>
        <ReadOnlyTextInput
          value={report.notes || '없음'}
          editable={false} // 텍스트 수정 불가
          multiline={true}
        />
      </Section>

      {/* 보호자 특별 요청 사항 */}
      <Section>
        <SectionTitle>보호자 특별 요청 사항</SectionTitle>
        {Object.entries(report.specialRequests).map(([key, value]) => (
          <CheckBoxWrapper key={key}>
            <CheckBox isChecked={value} disabled={true} />
            <Text>
              {key === 'massage'
                ? '마사지 추가'
                : key === 'additionalCare'
                ? '추가 케어 요청'
                : '영양제 추가'}
            </Text>
          </CheckBoxWrapper>
        ))}
      </Section>
    </Container>
  );
};

export default ReportDetail;
