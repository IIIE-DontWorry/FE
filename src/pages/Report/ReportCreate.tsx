import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import BtnAdd from '../../assets/report/btn_add.svg';
import {format} from 'date-fns';
import TimeEntryModal from '../../components/Report/TimeEntryModal';
import CheckBox from 'react-native-check-box';
import ApiService from '../../utils/api';
import BackIcon from '../../assets/common/back-icon.svg';
const Container = styled.ScrollView`
  flex: 1;
  background-color: #ffffff;
`;
const Header = styled.View`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const BackButton = styled(TouchableOpacity)`
  padding: 8px;
  flex: 1;
  justify-content: flex-start;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  flex: 3;
  text-align: center;
  margin-right: 80px;
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
  margin-bottom: 10px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 30px;
  margin-bottom: 6px; /* 간격 줄이기 */
`;

const AddButton = styled.TouchableOpacity`
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  width: 200px;
  align-items: center;
  margin-bottom: 20px;
  background: #6adec0;
`;

const AddButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
`;

const ButtonSection = styled.View`
  align-items: center;
  margin-top: 8px;
`;

const ReportCreate = ({route, navigation}) => {
  const [reportData, setReportData] = useState({
    id: null,
    date: format(new Date(), 'yyyy-MM-dd'),
    mealExcretionResponse: {
      mealMorningTakenStatus: false,
      mealAfternoonTakenStatus: false,
      mealEveningTakenStatus: false,
      excretionMorningTakenStatus: false,
      excretionAfternoonTakenStatus: false,
      excretionEveningTakenStatus: false,
    },
    medications: [],
    notes: '',
    guardianRequests: [],
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [timeEntries, setTimeEntries] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (route.params?.report) {
      const report = route.params.report;
      setReportData({
        id: report.id,
        date: report.postedDate,
        mealExcretionResponse: report.mealExcretionResponse || {
          mealMorningTakenStatus: false,
          mealAfternoonTakenStatus: false,
          mealEveningTakenStatus: false,
          excretionMorningTakenStatus: false,
          excretionAfternoonTakenStatus: false,
          excretionEveningTakenStatus: false,
        },
        medications: report.medicationCheckResponse || [],
        notes: report.specialNote || '',
        guardianRequests: report.guardianResponses || [],
      });
    }
  }, [route.params]);

  const toggleMealExcretion = (category, time) => {
    setReportData(prev => ({
      ...prev,
      mealExcretionResponse: {
        ...prev.mealExcretionResponse,
        [`${category}${time}TakenStatus`]:
          !prev.mealExcretionResponse[`${category}${time}TakenStatus`],
      },
    }));
  };

  const toggleGuardianRequest = id => {
    setReportData(prev => {
      const updatedRequests = [...prev.guardianRequests];
      const requestIndex = updatedRequests.findIndex(r => r.id === id);

      if (requestIndex !== -1) {
        updatedRequests[requestIndex].isCheck =
          !updatedRequests[requestIndex].isCheck;
      }
      return {...prev, guardianRequests: updatedRequests};
    });
  };

  const addTimeEntry = async entry => {
    try {
      console.log('Time Entry:', entry); // 디버깅용 로그
      if (
        !entry.activityAt ||
        entry.activityAt.hour === undefined ||
        entry.activityAt.minute === undefined
      ) {
        throw new Error('activityAt 데이터가 유효하지 않습니다.');
      }

      const response = await ApiService.post(
        `care-schedules/${reportData.id}`,
        {
          description: entry.description,
          hour: entry.activityAt.hour,
          minute: entry.activityAt.minute,
        },
      );

      if (response.status === 'success') {
        const {id, description, activityAt} = response.data;
        const [hour, minute] = activityAt.split(':').map(Number);
        setTimeEntries(prev => [
          ...prev,
          {
            id,
            description,
            hour,
            minute,
          },
        ]);
      } else {
        Alert.alert('오류', '시간에 따른 일지 추가 중 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('Time Entry Error:', error.message);
      Alert.alert(
        '오류',
        '시간에 따른 일지를 추가하는 중 문제가 발생했습니다.',
      );
    }
  };
  const handleComplete = async () => {
    try {
      const {
        id, // 간병 보고서 ID
        date,
        medications,
        mealExcretionResponse,
        notes,
        guardianRequests,
      } = reportData;

      // ID 검증: ID가 null 또는 잘못된 값일 경우 요청 중단
      if (!id || id <= 0) {
        Alert.alert(
          '오류',
          '유효하지 않은 보고서 ID입니다. 다시 시도해주세요.',
        );
        return;
      }

      const payload = {
        patchCareScheduleRequests: timeEntries.map(entry => ({
          id: entry.id || 0, // 기존 ID 또는 새 항목은 0으로 설정
          description: entry.description,
          hour: entry.hour,
          minute: entry.minute,
        })),
        medicationCheckRequests: medications.map(med => ({
          id: med.id,
          name: med.name,
          morningTakenStatus: med.morningTakenStatus,
          afternoonTakenStatus: med.afternoonTakenStatus,
          eveningTakenStatus: med.eveningTakenStatus,
        })),
        mealExcretionRequest: mealExcretionResponse,
        specialNote: notes,
        guardianRequests: guardianRequests.map(req => ({
          id: req.id,
          request: req.request,
          isCheck: req.isCheck,
        })),
        postedDate: date, // 수정된 날짜
      };

      console.log('Payload:', JSON.stringify(payload, null, 2)); // 디버깅용 로그

      const response = await ApiService.patch(`care-reports/${id}`, payload);
      if (response.status === 'success') {
        Alert.alert('성공', '보고서가 성공적으로 저장되었습니다.');
        navigation.navigate('Main', {shouldReload: true}); // 리로드 트리거 전달
      } else {
        throw new Error('서버에서 에러가 발생했습니다.');
      }
    } catch (error) {
      console.error('Response Error:', error.message);
      Alert.alert('오류', '보고서를 저장하는 중 문제가 발생했습니다.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setReportData(prev => ({
        ...prev,
        date: format(selectedDate, 'yyyy-MM-dd'),
      }));
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackIcon width={24} height={24} />
        </BackButton>
        <HeaderTitle>간병 보고서 작성</HeaderTitle>
      </Header>

      <Section>
        <SectionTitle>날짜</SectionTitle>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text>{reportData.date}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={new Date(reportData.date)}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </Section>

      <Section>
        <SectionTitle>시간에 따른 일지</SectionTitle>
        {timeEntries.map((entry, index) => (
          <Text key={index}>
            {`${entry.hour}시 ${entry.minute}분 - ${entry.description}`}
          </Text>
        ))}
        <View style={{alignItems: 'center', marginTop: 8}}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <BtnAdd width={24} height={24} />
          </TouchableOpacity>
        </View>
        <TimeEntryModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAddEntry={addTimeEntry}
        />
      </Section>

      <Section>
        <SectionTitle>식사 및 배변활동</SectionTitle>
        <Text style={{color: '#888', fontSize: 12, marginBottom: 8}}>
          ※ 아침, 점심, 저녁 순서대로 확인해주세요
        </Text>
        {['meal', 'excretion'].map(category => (
          <View key={category}>
            <Text>{category === 'meal' ? '식사 여부' : '배변 활동'}</Text>
            <Row>
              {['Morning', 'Afternoon', 'Evening'].map(time => (
                <View
                  key={`${category}${time}`}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <CheckBox
                    isChecked={
                      reportData.mealExcretionResponse[
                        `${category}${time}TakenStatus`
                      ] || false
                    }
                    onClick={() => toggleMealExcretion(category, time)}
                  />
                  <Text>
                    {time === 'Morning'
                      ? '아침'
                      : time === 'Afternoon'
                      ? '점심'
                      : '저녁'}
                  </Text>
                </View>
              ))}
            </Row>
          </View>
        ))}
      </Section>
      <Section>
        <SectionTitle>투약 여부</SectionTitle>
        <Text style={{color: '#888', fontSize: 12, marginBottom: 8}}>
          ※ 아침, 점심, 저녁 순서대로 확인해주세요
        </Text>
        {reportData.medications.map(med => (
          <View key={med.id}>
            <Text>{med.name}</Text>
            <Row>
              {['morning', 'afternoon', 'evening'].map(time => (
                <View
                  key={`${med.id}-${time}`}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <CheckBox
                    isChecked={med[`${time}TakenStatus`]}
                    onClick={() =>
                      setReportData(prev => {
                        const updatedMedications = [...prev.medications];
                        const medIndex = updatedMedications.findIndex(
                          m => m.id === med.id,
                        );
                        updatedMedications[medIndex][`${time}TakenStatus`] =
                          !updatedMedications[medIndex][`${time}TakenStatus`];
                        return {...prev, medications: updatedMedications};
                      })
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
            </Row>
          </View>
        ))}
      </Section>

      <Section>
        <SectionTitle>특이사항</SectionTitle>
        <TextInput
          value={reportData.notes}
          onChangeText={text => setReportData(prev => ({...prev, notes: text}))}
          multiline
          placeholder="특이사항을 입력하세요."
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
            padding: 8,
            height: 80,
          }}
        />
      </Section>

      <Section>
        <SectionTitle>보호자 특별 요청 사항</SectionTitle>
        {reportData.guardianRequests.length > 0 ? (
          reportData.guardianRequests.map(request => (
            <View
              key={request.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}>
              <CheckBox
                isChecked={request.isCheck}
                onClick={() => toggleGuardianRequest(request.id)}
              />
              <Text style={{marginLeft: 8}}>{request.request}</Text>
            </View>
          ))
        ) : (
          <Text style={{color: '#888'}}>특별 요청사항 없음</Text>
        )}
      </Section>

      <ButtonSection>
        <AddButton onPress={handleComplete}>
          <AddButtonText>작성하기</AddButtonText>
        </AddButton>
      </ButtonSection>
    </Container>
  );
};

export default ReportCreate;
