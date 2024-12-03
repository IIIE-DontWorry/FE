import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Modal, TouchableOpacity, Alert, Clipboard} from 'react-native';
import ApiService from '../../utils/api';
import {useUserType} from '../../store/UserTypeContext';
const MessageRow = styled.View<{isMe: boolean}>`
  flex-direction: column;
  align-items: ${props => (props.isMe ? 'flex-end' : 'flex-start')};
  margin-bottom: 15px;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
`;

const AuthorContainer = styled.View`
  width: 100%;
`;

const AuthorText = styled.Text<{isMe: boolean}>`
  font-size: 14px;
  font-weight: bold;
  color: #555;
  margin-bottom: 8px;
  text-align: ${props => (props.isMe ? 'right' : 'left')};
`;

const BubbleContainer = styled.View`
  max-width: 70%;
  align-self: ${props => (props.isMe ? 'flex-end' : 'flex-start')};
`;

const Bubble = styled.TouchableOpacity<{isMe: boolean}>`
  padding: 12px 16px;
  border-radius: 20px;
  background-color: ${props => (props.isMe ? '#00D6A3' : '#E0E0E0')};
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
  align-items: center;
`;

const ModalButton = styled.TouchableOpacity`
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #e9ecef;
  width: 100%;
`;

const ModalButtonText = styled.Text`
  text-align: center;
  font-size: 16px;
  color: #333;
`;

interface MessageProps {
  message: {
    id: number;
    text: string;
    isMe: boolean;
    time: string;
    date: string;
    author: string;
  };
  onDeleteComplete: () => void; // 삭제 완료 후 호출될 함수
}

const MessageBubble: React.FC<MessageProps> = ({message, onDeleteComplete}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {state} = useUserType(); // 사용자 상태 가져오기 (role과 accessToken)

  const handleCopy = () => {
    Clipboard.setString(message.text);
    Alert.alert('복사 완료', '메시지가 복사되었습니다.');
    setModalVisible(false);
  };

  const handleDelete = async () => {
    try {
      const response = await ApiService.deleteWithBody('notes/delete', {
        id: message.id,
      });

      if (response.status === 'success') {
        Alert.alert('삭제 완료', '메시지가 삭제되었습니다.');
        setModalVisible(false);
        onDeleteComplete(); // 삭제 후 부모 컴포넌트에서 목록 갱신
      } else {
        Alert.alert(
          '삭제 실패',
          response.message || '메시지 삭제에 실패했습니다.',
        );
      }
    } catch (error) {
      console.error('삭제 오류:', error.response || error);
      Alert.alert('오류', '메시지 삭제 중 문제가 발생했습니다.');
    }
  };

  return (
    <>
      <MessageRow isMe={message.isMe}>
        <AuthorContainer>
          <AuthorText isMe={message.isMe}>{message.author}</AuthorText>
        </AuthorContainer>
        <BubbleContainer isMe={message.isMe}>
          <Bubble isMe={message.isMe} onLongPress={() => setModalVisible(true)}>
            <MessageText isMe={message.isMe}>{message.text}</MessageText>
            <TimeText>{message.time}</TimeText>
          </Bubble>
        </BubbleContainer>
      </MessageRow>

      {/* 모달 */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
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
      </Modal>
    </>
  );
};

export default MessageBubble;
