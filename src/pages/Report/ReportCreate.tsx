import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import BtnAdd from '../../assets/report/btn_add.svg';
import {format} from 'date-fns';
import TimeEntryModal from '../../components/Report/TimeEntryModal'; // 모달 컴포넌트 분리
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
const CenteredAddButtonContainer = styled.View`
  align-items: center; /* 버튼을 가로로 가운데 정렬 */
  margin-top: 8px;
`;
const ButtonSection = styled.View`
  align-items: center; /* 버튼을 가로로 가운데 정렬 */
  margin-top: 8px;
`;
const ReportCreate = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeEntries, setTimeEntries] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activities, setActivities] = useState({
    bowel: {morning: false, afternoon: false, evening: false},
    meal: {morning: false, afternoon: false, evening: false},
  });
  const [medications, setMedications] = useState({
    protein: {morning: false, afternoon: false, evening: false},
    arginine: {morning: false, afternoon: false, evening: false},
    creatine: {morning: false, afternoon: false, evening: false},
    betaAlanine: {morning: false, afternoon: false, evening: false},
  });
  const [notes, setNotes] = useState('');
  const [specialRequests, setSpecialRequests] = useState({
    massage: false,
    additionalCare: false,
    dietarySupplement: false,
  });
  const {handleAddReport} = route.params; // Report에서 전달받은 콜백

  const handleComplete = () => {
    const newReport = {
      date: format(date, 'yyyy년 MM월 dd일'),
      activities,
      medications,
      notes,
      specialRequests,
    };

    handleAddReport(newReport); // 새 보고서 전달
    navigation.goBack(); // 이전 화면으로 돌아감
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const addTimeEntry = (entry: string) => {
    setTimeEntries(prev => [...prev, entry]);
  };

  const toggleCheckbox = (category: string, itemKey: string, time: string) => {
    if (category === 'activities') {
      setActivities(prev => ({
        ...prev,
        [itemKey]: {
          ...prev[itemKey],
          [time]: !prev[itemKey][time],
        },
      }));
    } else if (category === 'medications') {
      setMedications(prev => ({
        ...prev,
        [itemKey]: {
          ...prev[itemKey],
          [time]: !prev[itemKey][time],
        },
      }));
    }
  };

  const toggleSpecialRequest = (key: string) => {
    setSpecialRequests(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Container>
      <Header>
        <HeaderText>간병 보고서 작성</HeaderText>
      </Header>

      {/* 날짜 선택 섹션 */}
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

        {timeEntries.map((entry, index) => (
          <Text key={index} style={{marginTop: 8}}>
            {entry}
          </Text>
        ))}
        <CenteredAddButtonContainer>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{marginTop: 8}}>
            <BtnAdd width={24} height={24} />
          </TouchableOpacity>
        </CenteredAddButtonContainer>
      </Section>

      {/* 배변활동 및 식사여부 */}
      <Section>
        <SectionTitle>배변활동 및 식사여부</SectionTitle>
        <GuidanceText>※ 아침, 점심, 저녁 순서대로 체크해주세요</GuidanceText>
        {['배변활동', '식사여부'].map((type, idx) => (
          <View key={idx}>
            <Text style={{fontWeight: 'bold', marginBottom: 4}}>{type}</Text>
            <CheckBoxContainer>
              {['morning', 'afternoon', 'evening'].map(time => (
                <CheckBoxWrapper key={`${type}-${time}`}>
                  <CheckBox
                    isChecked={
                      activities[type === '배변활동' ? 'bowel' : 'meal'][time]
                    }
                    onClick={() =>
                      toggleCheckbox(
                        'activities',
                        type === '배변활동' ? 'bowel' : 'meal',
                        time,
                      )
                    }
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
          </View>
        ))}
      </Section>

      {/* 투약 체크 리스트 */}
      <Section>
        <SectionTitle>투약 체크 리스트</SectionTitle>
        <GuidanceText>※ 아침, 점심, 저녁 순서대로 체크해주세요</GuidanceText>
        {Object.entries(medications).map(([key, value]) => (
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
            <CheckBoxContainer>
              {['morning', 'afternoon', 'evening'].map(time => (
                <CheckBoxWrapper key={`${key}-${time}`}>
                  <CheckBox
                    isChecked={value[time]}
                    onClick={() => toggleCheckbox('medications', key, time)}
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

      {/* 보호자 특별 요청 사항 */}
      <Section>
        <SectionTitle>보호자 특별 요청 사항</SectionTitle>
        {Object.entries(specialRequests).map(([key, value]) => (
          <CheckBoxWrapper key={key}>
            <CheckBox
              isChecked={value}
              onClick={() => toggleSpecialRequest(key)}
            />
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

      {/* 완료 버튼 */}
      <ButtonSection>
        <AddButton onPress={handleComplete}>
          <Text style={{color: '#fff'}}>완료</Text>
        </AddButton>
      </ButtonSection>
      {/* 시간에 따른 일지 추가 모달 */}
      <TimeEntryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddEntry={addTimeEntry}
      />
    </Container>
  );
};

export default ReportCreate;
