// src/components/Message/MessageBubble.tsx
import React from 'react';
import styled from 'styled-components/native';
import {useMessages} from '../../store/MessageContext';

const MessageRow = styled.View<{isMe: boolean}>`
  flex-direction: row;
  justify-content: ${props => (props.isMe ? 'flex-end' : 'flex-start')};
  margin-bottom: 15px;
`;

const Bubble = styled.TouchableOpacity<{isMe: boolean}>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 20px;
  background-color: ${props => (props.isMe ? '#00D6A3' : '#f8f8f8')};
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

interface MessageProps {
  message: {
    id: number;
    text: string;
    isMe: boolean;
    time: string;
    date: string;
  };
  onLongPress: (message: MessageProps['message']) => void;
}

const MessageBubble: React.FC<MessageProps> = ({message, onLongPress}) => {
  return (
    <MessageRow isMe={message.isMe}>
      <Bubble isMe={message.isMe} onLongPress={() => onLongPress(message)}>
        <MessageText isMe={message.isMe}>{message.text}</MessageText>
        <TimeText>{message.time}</TimeText>
      </Bubble>
    </MessageRow>
  );
};
export default MessageBubble;