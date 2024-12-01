// src/pages/Message/Message.tsx
import React, {useState, useRef, useEffect} from 'react';
import styled from 'styled-components/native';
import {
  Modal,
  TouchableOpacity,
  Clipboard,
  ScrollView,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';

const Container = styled.View`
  flex: 1;
  background-color: #f8f9fa;
`;

const ChatContainer = styled.ScrollView`
  flex: 1;
  padding: 20px;
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

const MessageRow = styled.View<{isMe: boolean}>`
  flex-direction: row;
  justify-content: ${props => (props.isMe ? 'flex-end' : 'flex-start')};
  margin-bottom: 15px;
`;

const MessageBubble = styled.TouchableOpacity<{isMe: boolean}>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 20px;
  margin-left: 7px;
  margin-right: 7px;
  background-color: ${props => (props.isMe ? '#00D6A3' : '#FFFFFF')};
`;

const MessageText = styled.Text<{isMe: boolean}>`
  color: ${props => (props.isMe ? '#FFFFFF' : '#000000')};
  font-size: 16px;
`;

const TimeText = styled.Text`
  font-size: 12px;
  color: #666;
  margin-top: 5px;
`;

const InputContainer = styled.View`
  flex-direction: row;
  padding: 10px;
  background-color: #ffffff;
  border-top-width: 1px;
  border-top-color: #e9ecef;
`;

const Input = styled.TextInput`
  flex: 1;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 20px;
  margin-right: 10px;
`;

const SendButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

const SendButtonText = styled.Text`
  color: #00d6a3;
  font-size: 16px;
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

interface MessageType {
  id: number;
  text: string;
  isMe: boolean;
  time: string;
  date: string;
}

const Message = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 1,
      text: '어르신이 오전에 약을 드셔야할 식사를 거의 안 하셨어요.',
      isMe: false,
      time: '오전 8:20',
      date: '2024년 10월 17일 목요일',
    },
    {
      id: 2,
      text: '그렇군요. 그럼 저녁엔 죽으로 준비 부탁드릴게요.',
      isMe: true,
      time: '오전 9:05',
      date: '2024년 10월 17일 목요일',
    },
    {
      id: 3,
      text: '오전에 손자 분들이 왔다 가셨어요.',
      isMe: false,
      time: '오전 8:20',
      date: '2024년 10월 18일 목요일',
    },
    {
      id: 4,
      text: '네 별다른 일은 없었죠?',
      isMe: true,
      time: '오전 8:20',
      date: '2024년 10월 18일 목요일',
    },
  ]);

  const [isComposing, setIsComposing] = useState(false);
  const [input, setInput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const handleLongPress = (message: string) => {
    setSelectedMessage(message);
    setModalVisible(true);
  };

  const handleCopy = async () => {
    if (selectedMessage) {
      await Clipboard.setString(selectedMessage);
    }
    setModalVisible(false);
  };

  // 삭제 로직 구현
  const handleDelete = () => {
    if (selectedMessage) {
      setMessages(prev => prev.filter(msg => msg.text !== selectedMessage));
    }
    setModalVisible(false);
  };

  // 메시지 자동 스크롤
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  }, [messages]);

  // 메시지 전송 함수
  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage: MessageType = {
        id: messages.length + 1,
        text: input.trim(),
        isMe: true,
        time: new Date().toLocaleTimeString('ko-KR', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        date: new Date().toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        }),
      };

      setMessages(prev => [...prev, newMessage]);
      setInput('');
    }
  };

  // 키보드 이벤트 처리
  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (e.nativeEvent.key === 'Enter') {
      handleSendMessage();
    }
  };

  let currentDate = '';

  return (
    <Container>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({animated: true})
        }>
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
              <MessageRow isMe={message.isMe}>
                <MessageBubble
                  isMe={message.isMe}
                  onLongPress={() => handleLongPress(message.text)} // 길게 누르기 이벤트 추가
                >
                  <MessageText isMe={message.isMe}>
                    {message.text.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i !== message.text.split('\n').length - 1 && '\n'}
                      </React.Fragment>
                    ))}
                  </MessageText>
                  <TimeText>{message.time}</TimeText>
                </MessageBubble>
              </MessageRow>
            </React.Fragment>
          );
        })}
      </ScrollView>

      <InputContainer>
        <TextInput
          ref={inputRef}
          value={input}
          onChangeText={setInput}
          placeholder="메시지를 입력해주세요."
          multiline
          onKeyPress={handleKeyPress}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: '#F8F9FA',
            borderRadius: 20,
          }}
        />
        <SendButton onPress={handleSendMessage}>
          <SendButtonText>전송</SendButtonText>
        </SendButton>
      </InputContainer>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => setModalVisible(false)}>
          <ModalOverlay>
            <ModalContent>
              <ModalButton onPress={handleCopy}>
                <ModalButtonText>복사</ModalButtonText>
              </ModalButton>
              <ModalButton onPress={handleDelete}>
                <ModalButtonText>삭제</ModalButtonText>
              </ModalButton>
            </ModalContent>
          </ModalOverlay>
        </TouchableOpacity>
      </Modal>
    </Container>
  );
};

export default Message;
