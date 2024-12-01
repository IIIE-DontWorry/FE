import React, {useState} from 'react';
import styled from 'styled-components/native';
import ApiService from '../../utils/api'; // ApiService 임포트

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

const MessageInput = ({onMessageSent}: {onMessageSent: () => void}) => {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    setIsSending(true);

    try {
      // JSON 문자열로 요청 데이터 생성
      const payload = JSON.stringify({
        guardianId: 1, // 수신자 ID
        caregiverId: null, // 작성자 ID
        noteContent: input.trim(), // 메시지 내용
      });

      console.log('전송할 데이터:', payload);

      const response = await ApiService.post('notes/add', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('응답:', response);

      if (response.status === 'success') {
        console.log('쪽지 추가 성공:', response.data);
        setInput(''); // 입력 필드 초기화
        onMessageSent(); // 메시지 전송 후 메시지 갱신 함수 호출
      } else {
        console.error('쪽지 추가 실패:', response.message);
        alert(`쪽지 추가 실패: ${response.message}`);
      }
    } catch (error) {
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
