// src/components/Message/MessageInput.tsx
import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useMessages} from '../../store/MessageContext';

const InputContainer = styled.View`
  flex-direction: row;
  padding: 10px;
  background-color: #FFFFFF;
  border-top-width: 1px;
  border-top-color: #E9ECEF;
`;

const Input = styled.TextInput`
  flex: 1;
  padding: 10px;
  background-color: #F8F9FA;
  border-radius: 20px;
  margin-right: 10px;
`;

const SendButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

const SendButtonText = styled.Text`
  color: #00D6A3;
  font-size: 16px;
`;

const MessageInput = () => {
  const [input, setInput] = useState('');
  const {addMessage} = useMessages();

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = {
        id: Date.now(),
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
      addMessage(newMessage);
      setInput('');
    }
  };

  return (
    <InputContainer>
      <Input
        value={input}
        onChangeText={setInput}
        placeholder="메시지를 입력해주세요."
        multiline
      />
      <SendButton onPress={handleSend}>
        <SendButtonText>전송</SendButtonText>
      </SendButton>
    </InputContainer>
  );
};

export default MessageInput;