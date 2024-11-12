import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from 'react-native-check-box';
import styled from 'styled-components/native';
import BtnAdd from '../assets/report/btn_add.svg';
import {format} from 'date-fns';

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
  background-color: #8ce;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`;

const CheckBoxContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const CheckBoxWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
  margin-bottom: 8px;
`;

const GuidanceText = styled.Text`
  color: #888;
  font-size: 12px;
  margin-bottom: 8px;
`;

const ReportCreate = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activities, setActivities] = useState({
    bowel: {morning: false, afternoon: false, evening: false},
    meal: {morning: false, afternoon: false, evening: false},
    medication: {morning: false, afternoon: false, evening: false},
  });
  const [notes, setNotes] = useState('');
  const [specialRequests] = useState('하루 2번 마사지를 부탁드려요');
  const [modalVisible, setModalVisible] = useState(false);
  const [entry, setEntry] = useState('');

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleAddEntry = () => {
    setEntry(entry);
    setModalVisible(false);
  };

  const toggleCheckbox = (activityKey: string, time: string) => {
    setActivities(prev => ({
      ...prev,
      [activityKey]: {
        ...prev[activityKey],
        [time]: !prev[activityKey][time],
      },
    }));
  };

  return (
    <Container>
      <Header>
        <HeaderText>간병 보고서 작성</HeaderText>
      </Header>

      <Section>
        <SectionTitle>날짜</SectionTitle>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text>{format(date, 'yyyy년 MM월 dd일')}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </Section>

      <Section>
        <SectionTitle>시간에 따른 일지 작성</SectionTitle>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{marginTop: 8}}>
          <BtnAdd width={24} height={24} />
        </TouchableOpacity>
        {entry ? <Text style={{marginTop: 8}}>{entry}</Text> : null}
      </Section>

      <Section>
        <SectionTitle>배변활동 및 식사여부</SectionTitle>
        <GuidanceText>※ 아침, 점심, 저녁 순서대로 체크해주세요</GuidanceText>
        <CheckBoxContainer>
          {['morning', 'afternoon', 'evening'].map(time => (
            <CheckBoxWrapper key={`bowel-${time}`}>
              <CheckBox
                isChecked={activities.bowel[time]}
                onClick={() => toggleCheckbox('bowel', time)}
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
        </CheckBoxContainer>

        <CheckBoxContainer>
          {['morning', 'afternoon', 'evening'].map(time => (
            <CheckBoxWrapper key={`meal-${time}`}>
              <CheckBox
                isChecked={activities.meal[time]}
                onClick={() => toggleCheckbox('meal', time)}
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
        </CheckBoxContainer>
      </Section>

      <Section>
        <SectionTitle>투약 체크 리스트</SectionTitle>
        <GuidanceText>※ 아침, 점심, 저녁 순서대로 체크해주세요</GuidanceText>
        <CheckBoxContainer>
          {['morning', 'afternoon', 'evening'].map(time => (
            <CheckBoxWrapper key={`medication-${time}`}>
              <CheckBox
                isChecked={activities.medication[time]}
                onClick={() => toggleCheckbox('medication', time)}
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
        </CheckBoxContainer>
      </Section>

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

      <Section>
        <SectionTitle>보호자 특별 요청 사항</SectionTitle>
        <Text>{specialRequests}</Text>
      </Section>

      <AddButton onPress={() => alert('보고서 작성 완료')}>
        <Text style={{color: '#fff'}}>완료</Text>
      </AddButton>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: '#fff',
              borderRadius: 10,
            }}>
            <Text>시간에 따른 일지 내용 추가</Text>
            <TextInput
              placeholder="내용을 입력하세요."
              value={entry}
              onChangeText={setEntry}
              style={{
                height: 80,
                borderColor: '#ddd',
                borderWidth: 1,
                padding: 8,
                borderRadius: 8,
                marginTop: 10,
              }}
            />
            <Button title="등록" onPress={handleAddEntry} />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{marginTop: 10}}>
              <Text style={{textAlign: 'center', color: 'red'}}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default ReportCreate;
