import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from 'react-native-check-box';
import {format} from 'date-fns';
import ApiService from '../../utils/api';

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

const AddButton = styled.TouchableOpacity`
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  width: 200px;
  flex-shrink: 0;
  align-items: center;
  margin-bottom: 20px;
  background: #6adec0;
`;

const ButtonSection = styled.View`
  align-items: center;
  margin-top: 8px;
`;

const ReportCreate = ({route, navigation}) => {
  const {report} = route.params; // 생성된 보고서 데이터
  const [date, setDate] = useState(new Date(report?.postedDate || new Date()));
  const [showDatePicker, setShowDatePicker] = useState(false); // DatePicker 상태 추가
  const [activities, setActivities] = useState(report?.activities || {});
  const [medications, setMedications] = useState(
    report?.medicationCheckResponse || [],
  );
  const [notes, setNotes] = useState(report?.specialNote || '');

  const handleComplete = async () => {
    const payload = {
      medicationCheckRequests: medications.map(med => ({
        id: med.id,
        name: med.name,
        morningTakenStatus: med.morningTakenStatus,
        afternoonTakenStatus: med.afternoonTakenStatus,
        eveningTakenStatus: med.eveningTakenStatus,
      })),
      specialNote: notes,
      postedDate: format(date, 'yyyy-MM-dd'),
    };

    try {
      const endpoint = `care-reports/${report.id}`;
      const response = await ApiService.patch(endpoint, payload);

      if (response.status === 'success') {
        Alert.alert('성공', '간병 보고서가 업데이트되었습니다.');
        navigation.goBack(); // 이전 화면으로 돌아가기
      } else {
        Alert.alert(
          '실패',
          response.message || '간병 보고서 업데이트에 실패했습니다.',
        );
      }
    } catch (error) {
      Alert.alert('오류', '간병 보고서 업데이트 중 문제가 발생했습니다.');
    }
  };

  const toggleCheckbox = (category, key, time) => {
    setMedications(prev =>
      prev.map(med =>
        med.name === key
          ? {
              ...med,
              [`${time}TakenStatus`]: !med[`${time}TakenStatus`],
            }
          : med,
      ),
    );
  };

  return (
    <Container>
      <Header>
        <HeaderText>간병 보고서 수정</HeaderText>
      </Header>

      {/* 날짜 선택 섹션 */}
      <Section>
        <SectionTitle>날짜</SectionTitle>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text>{format(date, 'yyyy-MM-dd')}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}
      </Section>

      {/* 투약 체크 리스트 */}
      <Section>
        <SectionTitle>투약 체크 리스트</SectionTitle>
        {medications.map(med => (
          <View key={med.id}>
            <Text style={{fontWeight: 'bold', marginBottom: 4}}>
              {med.name}
            </Text>
            <View
              style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 8}}>
              {['morning', 'afternoon', 'evening'].map(time => (
                <View
                  key={`${med.id}-${time}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 16,
                    marginBottom: 8,
                  }}>
                  <CheckBox
                    isChecked={med[`${time}TakenStatus`]}
                    onClick={() =>
                      toggleCheckbox('medications', med.name, time)
                    }
                  />
                  <Text>
                    {time === 'morning'
                      ? '아침'
                      : time === 'afternoon'
                      ? '점심'
                      : '저녁'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </Section>

      {/* 특이사항 */}
      <Section>
        <SectionTitle>특이사항</SectionTitle>
        <TextInput
          multiline
          placeholder="특이사항을 입력하세요."
          value={notes}
          onChangeText={setNotes}
          style={{
            height: 80,
            borderColor: '#ddd',
            borderWidth: 1,
            padding: 8,
            borderRadius: 8,
          }}
        />
      </Section>

      {/* 완료 버튼 */}
      <ButtonSection>
        <AddButton onPress={handleComplete}>
          <Text style={{color: '#fff'}}>수정 완료</Text>
        </AddButton>
      </ButtonSection>
    </Container>
  );
};

export default ReportCreate;
