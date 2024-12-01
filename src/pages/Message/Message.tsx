import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {ScrollView, Alert} from 'react-native';
import MessageBubbleComponent from '../../components/Message/MessageBubble';
import MessageInput from '../../components/Message/MessageInput';
import ApiService from '../../utils/api';

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: #f8f9fa;
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

const Message = () => {
  const [messages, setMessages] = useState([]);

  const careGiverId = 1;
  const guardianId = 1;

  const fetchMessages = async () => {
    try {
      const response = await ApiService.post('notes', {
        careGiverId,
        guardianId,
      });

      if (response.status === 'success') {
        const formattedMessages = response.data.map(message => ({
          id: message.id,
          text: message.noteContent,
          isMe: message.createdBy === 'caregiver', // 내가 보낸 메시지 여부
          time: new Date(message.createdAt).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          date: new Date(message.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }),
          author: message.createdBy === 'caregiver' ? '간병인' : '보호자',
        }));

        setMessages(formattedMessages);
      } else {
        Alert.alert(
          '오류',
          response.message || '쪽지 목록을 가져오지 못했습니다.',
        );
      }
    } catch (error) {
      console.error('쪽지 조회 오류:', error);
      Alert.alert('오류', '쪽지 목록을 가져오는 중 문제가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <Container>
      {messages.length > 0 ? (
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
                  onDeleteComplete={fetchMessages}
                />
              </React.Fragment>
            );
          })}
        </ScrollView>
      ) : (
        <EmptyMessageContainer>
          <EmptyMessageText>아직 작성된 메시지가 없어요!</EmptyMessageText>
        </EmptyMessageContainer>
      )}
      <MessageInput onMessageSent={fetchMessages} />
    </Container>
  );
};

export default Message;
