import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Alert, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TopNavigationBar from '../../components/common/TopNavigationBar';
import ApiService from '../../utils/api';

interface ApiResponse {
  status: string;
  message: string;
  data: string;
}

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const ContentContainer = styled.View`
  padding: 20px;
`;

const WarningSection = styled.View`
  background-color: #fff4f4;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #ff4444;
  margin-bottom: 15px;
`;

const WarningText = styled.Text`
  font-size: 16px;
  color: #666;
  line-height: 24px;
  margin-bottom: 10px;
`;

const CheckboxContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
`;

const CheckBox = styled.TouchableOpacity<{ isChecked: boolean }>`
  width: 20px;
  height: 20px;
  border-width: 1px;
  border-color: #666;
  border-radius: 4px;
  margin-right: 10px;
  justify-content: center;
  align-items: center;
  background-color: ${props => (props.isChecked ? '#ff4444' : '#ffffff')};
`;

const CheckText = styled.Text`
  font-size: 14px;
  color: #333;
  flex: 1;
`;

const DeleteButton = styled.TouchableOpacity<{ isDisabled: boolean }>`
  background-color: ${props => (props.isDisabled ? '#cccccc' : '#ff4444')};
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  margin-top: 30px;
`;

const DeleteButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

const DeleteCaregiverAccount = () => {
  const navigation = useNavigation();
  const [isChecked, setIsChecked] = useState(false);

  const handleDelete = async () => {
    Alert.alert(
      '회원 탈퇴',
      '정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await ApiService.post<ApiResponse>(
                '/care-givers/myPage/delete/1' // caregiverId를 실제 값으로 대체 필요
              );
              if (response.status === 'success') {
                Alert.alert('탈퇴 완료', '회원 탈퇴가 완료되었습니다.', [
                  {
                    text: '확인',
                    onPress: () => navigation.navigate('Landing'),
                  },
                ]);
              }
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('오류 발생', '회원 탈퇴 처리 중 문제가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  return (
    <Container>
      <TopNavigationBar title="회원 탈퇴" />
      <ContentContainer>
        <WarningSection>
          <Title>회원 탈퇴 전 꼭 확인해주세요</Title>
          <WarningText>• 모든 개인정보가 영구적으로 삭제됩니다.</WarningText>
          <WarningText>• 삭제된 데이터는 복구할 수 없습니다.</WarningText>
          <WarningText>• 보호자와의 연결이 모두 해제됩니다.</WarningText>
          <WarningText>• 기존 간병 기록도 모두 삭제됩니다.</WarningText>
        </WarningSection>

        <CheckboxContainer>
          <CheckBox
            onPress={() => setIsChecked(!isChecked)}
            isChecked={isChecked}
          >
            {isChecked && <Text style={{ color: '#ffffff' }}>✓</Text>}
          </CheckBox>
          <CheckText>위 내용을 모두 확인했으며, 이에 동의합니다.</CheckText>
        </CheckboxContainer>

        <DeleteButton
          isDisabled={!isChecked}
          onPress={handleDelete}
          disabled={!isChecked}
        >
          <DeleteButtonText>회원 탈퇴</DeleteButtonText>
        </DeleteButton>
      </ContentContainer>
    </Container>
  );
};

export default DeleteCaregiverAccount;
