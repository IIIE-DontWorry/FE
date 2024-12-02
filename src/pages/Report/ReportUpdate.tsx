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
  flex-direction: row;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
  justify-content: space-between;
`;

const HeaderText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  flex: 1;
  margin-right: 45px;
`;

const BackButton = styled(TouchableOpacity)`
  padding: 8px;
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

const EntryContainer = styled.View`
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const EntryText = styled.Text`
  font-size: 14px;
  color: #333;
`;

const BtnRow = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.TouchableOpacity`
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  width: 200px;
  align-items: center;
  margin-bottom: 20px;
`;

const SaveButton = styled(Button)`
  background: #6adec0;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
`;
const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 30px;
  margin-bottom: 6px; /* 간격 줄이기 */
`;
const ButtonSection = styled.View`
  align-items: center;
  margin-bottom: 10px;
`;

const ReportUpdate = ({route, navigation}) => {
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
    careScheduleResponses: [],
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeEntries, setTimeEntries] = useState([]);
  const fetchReportDetails = async careReportId => {
    try {
      const response = await ApiService.get(
        `care-reports/details/${careReportId}`,
      );
      if (response.status === 'success') {
        const data = response.data;
        setReportData({
          id: data.id,
          date: data.postedDate,
          mealExcretionResponse: data.mealExcretionResponse || {},
          medications: data.medicationCheckResponse || [],
          notes: data.specialNote || '',
          guardianRequests: data.guardianResponses || [],
          careScheduleResponses: data.careScheduleResponses || [],
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      Alert.alert('오류', '보고서를 가져오는 중 문제가 발생했습니다.');
      console.error(error);
    }
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

  useEffect(() => {
    if (route.params?.careReportId) {
      fetchReportDetails(route.params.careReportId);
    }
  }, [route.params]);
  const handleBack = () => {
    navigation.goBack();
  };
  const handleSave = async () => {
    try {
      const payload = {
        patchCareScheduleRequests: reportData.careScheduleResponses.map(
          entry => ({
            id: entry.id,
            description: entry.description,
            hour: parseInt(entry.activityAt.split(':')[0], 10),
            minute: parseInt(entry.activityAt.split(':')[1], 10),
          }),
        ),
        medicationCheckRequests: reportData.medications.map(med => ({
          id: med.id,
          name: med.name,
          morningTakenStatus: med.morningTakenStatus,
          afternoonTakenStatus: med.afternoonTakenStatus,
          eveningTakenStatus: med.eveningTakenStatus,
        })),
        mealExcretionRequest: reportData.mealExcretionResponse,
        specialNote: reportData.notes,
        guardianRequests: reportData.guardianRequests.map(req => ({
          id: req.id,
          request: req.request,
          isCheck: req.isCheck,
        })),
        postedDate: reportData.date,
      };

      const response = await ApiService.patch(
        `care-reports/${reportData.id}`,
        payload,
      );
      if (response.status === 'success') {
        Alert.alert('성공', '보고서가 성공적으로 수정되었습니다.');
        navigation.navigate('Report', {shouldReload: true});
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      Alert.alert('오류', '보고서를 수정하는 중 문제가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackIcon width={24} height={24} />
        </BackButton>
        <HeaderText>간병 보고서 수정</HeaderText>
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
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setReportData(prev => ({
                  ...prev,
                  date: format(selectedDate, 'yyyy-MM-dd'),
                }));
              }
            }}
          />
        )}
      </Section>

      <Section>
        <SectionTitle>시간에 따른 일지</SectionTitle>
        {reportData.careScheduleResponses.map(entry => (
          <EntryContainer key={entry.id}>
            <EntryText>
              {entry.activityAt} - {entry.description}
            </EntryText>
          </EntryContainer>
        ))}
        <BtnRow>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <BtnAdd width={24} height={24} />
          </TouchableOpacity>
        </BtnRow>
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
            <Text style={{color: 'black', fontSize: 14, marginBottom: 8}}>
              {category === 'meal' ? '식사 여부' : '배변 활동'}
            </Text>
            <Row>
              {['Morning', 'Afternoon', 'Evening'].map(time => (
                <View key={`${category}${time}`} style={{flexDirection: 'row'}}>
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
        <SectionTitle>투약 정보</SectionTitle>
        <Text style={{color: '#888', fontSize: 12, marginBottom: 8}}>
          ※ 아침, 점심, 저녁 순서대로 확인해주세요
        </Text>
        {reportData.medications.map(med => (
          <View key={med.id}>
            <Text style={{color: 'black', fontSize: 14, marginBottom: 8}}>
              {med.name}
            </Text>
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
                        const index = updatedMedications.findIndex(
                          m => m.id === med.id,
                        );
                        updatedMedications[index][`${time}TakenStatus`] =
                          !updatedMedications[index][`${time}TakenStatus`];
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
        <SectionTitle>보호자 요청 사항</SectionTitle>
        {reportData.guardianRequests.map(request => (
          <Row key={request.id}>
            <CheckBox
              isChecked={request.isCheck}
              onClick={() =>
                setReportData(prev => {
                  const updatedRequests = [...prev.guardianRequests];
                  const index = updatedRequests.findIndex(
                    r => r.id === request.id,
                  );
                  updatedRequests[index].isCheck =
                    !updatedRequests[index].isCheck;
                  return {...prev, guardianRequests: updatedRequests};
                })
              }
            />
            <Text>{request.request}</Text>
          </Row>
        ))}
      </Section>
      <ButtonSection>
        <SaveButton onPress={handleSave}>
          <ButtonText>수정</ButtonText>
        </SaveButton>
      </ButtonSection>
    </Container>
  );
};

export default ReportUpdate;
