import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from 'react-native-check-box';
import BtnAdd from '../../assets/report/btn_add.svg';
import {format, parseISO, isValid} from 'date-fns';
import TimeEntryModal from '../../components/Report/TimeEntryModal';
import {useReports} from '../../store/ReportContext';

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

const ButtonSection = styled.View`
  align-items: center;
  margin-top: 16px;
  margin-bottom: 10px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 16px;
  width: 80%;
`;

const StyledButton = styled.TouchableOpacity`
  flex: 1;
  margin: 0 8px;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  background: ${props => (props.bgColor ? props.bgColor : '#6adec0')};
`;

const StyledButtonText = styled.Text`
  color: #fff;
  font-size: 14px;
  font-weight: bold;
`;

const ReportUpdate = ({route, navigation}) => {
  const {report} = route.params;
  const {updateReport, deleteReport} = useReports();

  // 안전한 날짜 처리
  const initialDate = isValid(parseISO(report.date))
    ? parseISO(report.date)
    : new Date();

  const [date, setDate] = useState(initialDate);
  const [timeEntries, setTimeEntries] = useState(report.timeEntries || []);
  const [activities, setActivities] = useState(report.activities);
  const [medications, setMedications] = useState(report.medications);
  const [notes, setNotes] = useState(report.notes || '');
  const [specialRequests, setSpecialRequests] = useState(
    report.specialRequests || {},
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const addTimeEntry = entry => {
    setTimeEntries(prev => [...prev, entry]);
  };

  const toggleCheckbox = (category, itemKey, time) => {
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

  const toggleSpecialRequest = key => {
    setSpecialRequests(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleUpdate = () => {
    const updatedReport = {
      ...report,
      date: format(date, 'yyyy-MM-dd'),
      timeEntries,
      activities,
      medications,
      notes,
      specialRequests,
    };

    updateReport(updatedReport);
    Alert.alert('수정 완료', '보고서가 성공적으로 수정되었습니다.', [
      {text: '확인', onPress: () => navigation.goBack()},
    ]);
  };

  const handleDelete = () => {
    Alert.alert(
      '보고서 삭제',
      '이 보고서를 정말 삭제하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            deleteReport(report.id);
            Alert.alert('삭제 완료', '보고서가 성공적으로 삭제되었습니다.', [
              {text: '확인', onPress: () => navigation.goBack()},
            ]);
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <Container>
      <Header>
        <HeaderText>간병 보고서 수정</HeaderText>
      </Header>

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
            onChange={onDateChange}
          />
        )}
      </Section>

      <Section>
        <SectionTitle>시간에 따른 일지</SectionTitle>
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

      <Section>
        <SectionTitle>배변활동 및 식사여부</SectionTitle>
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

      <Section>
        <SectionTitle>투약 체크 리스트</SectionTitle>
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

      <Section>
        <SectionTitle>특이사항</SectionTitle>
        <TextInput
          multiline
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

      <ButtonSection>
        <ButtonRow>
          <StyledButton onPress={handleUpdate}>
            <StyledButtonText>수정</StyledButtonText>
          </StyledButton>
          <StyledButton bgColor="#FF4D4D" onPress={handleDelete}>
            <StyledButtonText>삭제</StyledButtonText>
          </StyledButton>
        </ButtonRow>
      </ButtonSection>
      <TimeEntryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddEntry={addTimeEntry}
      />
    </Container>
  );
};

export default ReportUpdate;
