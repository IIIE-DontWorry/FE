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
import TimeEntryModal from '../../components/Report/TimeEntryModal';
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

const ButtonSection = styled.View`
  align-items: center;
  margin-top: 8px;
`;

const ReportCreate = ({route, navigation}) => {
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

  const {handleAddReport} = route.params || {}; // 안전하게 params에서 가져옴

  const handleComplete = () => {
    if (typeof handleAddReport === 'function') {
      const newReport = {
        date: format(date, 'yyyy년 MM월 dd일'),
        activities,
        medications,
        notes,
        specialRequests,
      };

      handleAddReport(newReport); // 새로운 보고서를 추가
      navigation.goBack(); // 이전 화면으로 돌아감
    } else {
      console.error('handleAddReport is not defined');
    }
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

      {/* 시간에 따른 일지 작성 */}
      <Section>
        <SectionTitle>시간에 따른 일지 작성</SectionTitle>
        {timeEntries.map((entry, index) => (
          <Text key={index} style={{marginTop: 8}}>
            {entry}
          </Text>
        ))}
        <View style={{alignItems: 'center', marginTop: 8}}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <BtnAdd width={24} height={24} />
          </TouchableOpacity>
        </View>
      </Section>

      {/* 배변활동 및 식사여부 */}
      <Section>
        <SectionTitle>배변활동 및 식사여부</SectionTitle>
        <Text style={{color: '#888', fontSize: 12, marginBottom: 8}}>
          ※ 아침, 점심, 저녁 순서대로 체크해주세요
        </Text>
        {['배변활동', '식사여부'].map((type, idx) => (
          <View key={idx}>
            <Text style={{fontWeight: 'bold', marginBottom: 4}}>{type}</Text>
            <View
              style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 8}}>
              {['morning', 'afternoon', 'evening'].map(time => (
                <View
                  key={`${type}-${time}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 16,
                    marginBottom: 8,
                  }}>
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
                </View>
              ))}
            </View>
          </View>
        ))}
      </Section>

      {/* 투약 체크 리스트 */}
      <Section>
        <SectionTitle>투약 체크 리스트</SectionTitle>
        <Text style={{color: '#888', fontSize: 12, marginBottom: 8}}>
          ※ 아침, 점심, 저녁 순서대로 체크해주세요
        </Text>
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
            <View
              style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 8}}>
              {['morning', 'afternoon', 'evening'].map(time => (
                <View
                  key={`${key}-${time}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 16,
                    marginBottom: 8,
                  }}>
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

      {/* 보호자 특별 요청 사항 */}
      <Section>
        <SectionTitle>보호자 특별 요청 사항</SectionTitle>
        {Object.entries(specialRequests).map(([key, value]) => (
          <View
            key={key}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}>
            <CheckBox
              isChecked={value}
              onClick={() => toggleSpecialRequest(key)}
            />
            <Text style={{marginLeft: 8}}>
              {key === 'massage'
                ? '마사지 추가'
                : key === 'additionalCare'
                ? '추가 케어 요청'
                : '영양제 추가'}
            </Text>
          </View>
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
