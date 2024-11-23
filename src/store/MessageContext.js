// src/store/MessageContext.js
import React, {createContext, useState, useContext} from 'react';

// Context 생성
const MessageContext = createContext();

// Provider 생성
export const MessageProvider = ({children}) => {
 const [messages, setMessages] = useState([
   {
     id: 1,
     text: '어르신이 오전에 약을 드셔야할 식사를 거의 안 하셨어요.',
     isMe: false,
     time: '오전 8:20',
     date: '2024년 10월 17일 목요일'
   },
   {
     id: 2, 
     text: '그렇군요. 그럼 저녁엔 죽으로 준비 부탁드릴게요.',
     isMe: true,
     time: '오전 9:05',
     date: '2024년 10월 17일 목요일'
   },
   {
     id: 3,
     text: '오전에 손자 분들이 왔다 가셨어요.',
     isMe: false,
     time: '오전 8:20',
     date: '2024년 10월 18일 목요일'
   },
   {
     id: 4,
     text: '네 별다른 일은 없었죠?',
     isMe: true,
     time: '오전 8:20',
     date: '2024년 10월 18일 목요일'
   },
 ]); // 메시지 데이터 상태

 // 메시지 추가 함수
 const addMessage = newMessage => {
   setMessages(prevMessages => [...prevMessages, {...newMessage, id: Date.now()}]);
 };

 // 메시지 수정 함수 
 const updateMessage = updatedMessage => {
   setMessages(prevMessages =>
     prevMessages.map(message =>
       message.id === updatedMessage.id ? updatedMessage : message,
     ),
   );
 };

 // 메시지 삭제 함수
 const deleteMessage = id => {
   setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
 };

 // 메시지 데이터 Context 값
 const value = {
   messages,
   addMessage,
   updateMessage,
   deleteMessage,
 };

 return (
   <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
 );
};

// Custom Hook for using MessageContext
export const useMessages = () => {
 const context = useContext(MessageContext);
 if (!context) {
   throw new Error('useMessages must be used within a MessageProvider');
 }
 return context;
};

export default MessageContext;