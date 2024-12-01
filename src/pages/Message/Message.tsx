// src/pages/Message/Message.tsx
import React, {useState} from 'react';
import styled from 'styled-components/native';
import {ScrollView, Modal, TouchableOpacity} from 'react-native';
import {useMessages} from '../../store/MessageContext';
import MessageBubbleComponent from '../../components/Message/MessageBubble';
import MessageInput from '../../components/Message/MessageInput';
import ApiService from '../../utils/api';

const fetchUserData = async () => {
  try {
    const userData = await ApiService.get('/notes/latest');
    console.log('User Data:', userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

const submitForm = async (formData: object) => {
  try {
    const response = await ApiService.post('/notes', formData);
    console.log('Form Submission Response:', response);
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};
const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const MessageList = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const EmptyMessageContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const EmptyMessageText = styled.Text`
  font-size: 16px;
  color: #888;
`;

const DateSeparator = styled.View`
  align-items: center;
  margin-vertical: 20px;
`;

const DateText = styled.Text`
  color: #666;
  background-color: #e9ecef;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 12px;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  background-color: white;
  border-radius: 10px;
  width: 200px;
`;

const ModalButton = styled.TouchableOpacity`
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #e9ecef;
`;

const ModalButtonText = styled.Text`
  text-align: center;
  font-size: 16px;
  color: #333;
`;

// src/pages/Message/Message.tsx
const Message = () => {
  const {messages, deleteMessage} = useMessages(); // deleteMessage 추가
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<{
    id: number;
    text: string;
    isMe: boolean;
    time: string;
    date: string;
  } | null>(null); // 타입 정의 추가

  const handleLongPress = message => {
    setSelectedMessage(message);
    setModalVisible(true);
  };

  return (
    <Container>
      {messages.length > 0 ? (
        <>
          <ScrollView>
            {messages.map((message, index) => {
              const showDate =
                index === 0 || messages[index - 1].date !== message.date;

              return (
                <React.Fragment key={message.id}>
                  {showDate && (
                    <DateSeparator>
                      <DateText>{message.date}</DateText>
                    </DateSeparator>
                  )}
                  <MessageBubbleComponent
                    message={message}
                    onLongPress={() => handleLongPress(message)}
                  />
                </React.Fragment>
              );
            })}
          </ScrollView>
          <MessageInput />

          <Modal
            visible={modalVisible}
            transparent={true}
            onRequestClose={() => setModalVisible(false)}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => setModalVisible(false)}>
              <ModalOverlay>
                <ModalContent>
                  <ModalButton
                    onPress={() => {
                      if (selectedMessage) {
                        deleteMessage(selectedMessage.id);
                      }
                      setModalVisible(false);
                    }}>
                    <ModalButtonText>삭제</ModalButtonText>
                  </ModalButton>
                  <ModalButton onPress={() => setModalVisible(false)}>
                    <ModalButtonText>취소</ModalButtonText>
                  </ModalButton>
                </ModalContent>
              </ModalOverlay>
            </TouchableOpacity>
          </Modal>
        </>
      ) : (
        <EmptyMessageContainer>
          <EmptyMessageText>아직 작성된 메시지가 없어요!</EmptyMessageText>
        </EmptyMessageContainer>
      )}
    </Container>
  );
};

export default Message;
