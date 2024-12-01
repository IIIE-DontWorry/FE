import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ApiService from '../../utils/api';
import MessageIcon from '../../assets/bottomnavigation/message.svg';

const MessageSection = styled.View`
  margin: 16px;
  padding: 16px;
  background-color: #f8f8f8;
  border-radius: 10px;
  height: 330px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconContainer = styled.View`
  margin-right: 8px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const MoreButton = styled.TouchableOpacity`
  padding: 4px;
`;

const MoreText = styled.Text`
  color: #888;
`;

const EmptyMessageContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyMessageText = styled.Text`
  font-size: 18px;
  color: #888;
  font-weight: 600;
  text-align: center;
`;

const RecentMessageContainer = styled.View`
  margin-top: 12px;
  padding-bottom: 12px;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
`;

const MessageAuthor = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #000;
`;

const MessageText = styled.Text`
  font-size: 14px;
  color: #444;
  margin-top: 4px;
`;

const MessageTime = styled.Text`
  font-size: 12px;
  color: #888;
  margin-top: 2px;
`;

const RecentMessages = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const guardianId = 1;
  const caregiverId = 1;

  const fetchRecentMessages = async () => {
    try {
      const payload = {guardianId, caregiverId};
      const response = await ApiService.post('notes/latest', payload);

      if (response.status === 'success') {
        const formattedMessages = response.data.map(message => ({
          id: message.id,
          text: message.noteContent,
          author: message.createdBy === 'guardian' ? '보호자' : '간병인',
          time: new Date(message.createdAt).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          date: new Date(message.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }),
        }));
        setMessages(formattedMessages);
      } else {
        console.error('최근 쪽지 조회 실패:', response.message);
      }
    } catch (error) {
      console.error('API 호출 오류:', error);
    }
  };

  useEffect(() => {
    fetchRecentMessages();
  }, []);

  return (
    <MessageSection>
      <SectionHeader>
        <SectionTitleContainer>
          <IconContainer>
            <MessageIcon width={18} height={18} />
          </IconContainer>
          <SectionTitle>최근 쪽지</SectionTitle>
        </SectionTitleContainer>
        <MoreButton onPress={() => navigation.navigate('Message')}>
          <MoreText>더보기 &gt;</MoreText>
        </MoreButton>
      </SectionHeader>
      {messages.length === 0 ? (
        <EmptyMessageContainer>
          <EmptyMessageText>최근 쪽지가 아직 없어요!</EmptyMessageText>
        </EmptyMessageContainer>
      ) : (
        messages.map(message => (
          <RecentMessageContainer key={message.id}>
            <MessageAuthor>{message.author}</MessageAuthor>
            <MessageText>{message.text}</MessageText>
            <MessageTime>{message.time}</MessageTime>
          </RecentMessageContainer>
        ))
      )}
    </MessageSection>
  );
};

export default RecentMessages;
