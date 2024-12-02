import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styled from 'styled-components/native';

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  width: 300px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ModalTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 5px;
`;

const CloseText = styled.Text`
  font-size: 16px;
  color: #ff0000;
`;

const TimeEntryModal = ({visible, onClose, onAddEntry}) => {
  const [time, setTime] = useState(new Date());
  const [description, setDescription] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleAdd = () => {
    if (!description || !time) {
      Alert.alert('오류', '시간과 내용을 입력해주세요.');
      return;
    }

    const timeEntry = {
      description,
      activityAt: {
        hour: time.getHours(),
        minute: time.getMinutes(),
      },
    };

    onAddEntry(timeEntry); // 부모 컴포넌트로 전달
    setDescription('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <ModalContainer>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>시간에 따른 일지 추가</ModalTitle>
            <CloseButton onPress={onClose}>
              <CloseText>×</CloseText>
            </CloseButton>
          </ModalHeader>

          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <Text>
              시간 설정: {time.getHours()}시 {time.getMinutes()}분
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <TextInput
            placeholder="내용을 입력하세요."
            value={description}
            onChangeText={setDescription}
            style={{
              height: 80,
              borderColor: '#ddd',
              borderWidth: 1,
              padding: 8,
              borderRadius: 8,
              marginTop: 10,
            }}
            multiline
          />
          <Button title="등록" onPress={handleAdd} />
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default TimeEntryModal;
