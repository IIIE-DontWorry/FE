import React, {useState} from 'react';
import styled from 'styled-components/native';
import ApiService from '../../utils/api';
import {useUserType} from '../../store/UserTypeContext'; // UserTypeContext 사용

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

// Props 타입 정의
interface MessageInputProps {
  onMessageSent: () => void; // 메시지 전송 후 호출되는 콜백 함수
}

const MessageInput: React.FC<MessageInputProps> = ({onMessageSent}) => {
  const [input, setInput] = useState<string>(''); // 입력 상태
  const [isSending, setIsSending] = useState<boolean>(false); // 전송 상태
  const {state} = useUserType(); // 사용자 상태 가져오기 (role과 accessToken)

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    setIsSending(true);

    // role에 따라 메시지 전송 데이터 설정
    const payload = JSON.stringify({
      guardianId: state.role === '보호자' ? 1 : null, // 보호자일 때만 guardianId 설정
      caregiverId: state.role === '간병인' ? 1 : null, // 간병인일 때만 caregiverId 설정
      noteContent: input.trim(), // 메시지 내용
    });

    try {
      const response = await ApiService.post<{
        status: string;
        message: string;
        data?: any;
      }>('notes/add', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 'success') {
        setInput(''); // 입력 필드 초기화
        onMessageSent(); // 메시지 전송 후 메시지 갱신 함수 호출
      } else {
        console.error('쪽지 추가 실패:', response.message);
        alert(`쪽지 추가 실패: ${response.message}`);
      }
    } catch (error: any) {
      console.error('API 호출 오류:', error.response || error);

      // 서버에서 반환된 에러 메시지 표시
      alert(
        `쪽지를 전송하는 중 오류 발생: ${
          error.response?.data?.errors?.[0]?.message || error.message
        }`,
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <InputContainer>
      <Input
        value={input}
        onChangeText={setInput}
        placeholder="메시지를 입력해주세요."
        multiline
        onSubmitEditing={handleSend} // 엔터키를 눌러도 전송
      />
      <SendButton onPress={handleSend} disabled={isSending}>
        <SendButtonText>{isSending ? '전송 중...' : '전송'}</SendButtonText>
      </SendButton>
    </InputContainer>
  );
};

export default MessageInput;
