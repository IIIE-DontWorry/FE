import React, {useState, useEffect} from 'react';
import {Text, View, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import GalleryIcon from '../assets/bottomnavigation/gallery.svg';
import ReportIcon from '../assets/bottomnavigation/report.svg';
import MessageIcon from '../assets/bottomnavigation/message.svg';
import MockupImage from '../assets/home/img_mockup.svg';
import Heart from '../assets/home/heart.svg';
import Book from '../assets/home/book.svg';

const Container = styled.ScrollView`
  flex: 1;
  background-color: #ffffff;
`;

const MannerSection = styled.View`
  margin: 16px;
  padding: 16px;
  background-color: #f8f8f8;
  border-radius: 10px;
`;

const ProgressContainer = styled.View`
  position: relative;
  margin-top: 20px;
  height: 10px;
  background-color: #cfcfcf;
  border-radius: 5px;
`;

const ProgressBar = styled.View<{width: string}>`
  width: ${props => props.width};
  height: 100%;
  background-color: #a2d5a2;
  border-radius: 5px;
`;

const Triangle = styled.View`
  width: 0;
  height: 0;
  border-left-width: 5px;
  border-right-width: 5px;
  border-top-width: 5px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: #a2d5a2;
  margin-top: 2px;
`;

const MessageSection = styled.View`
  margin: 16px;
  padding: 16px;
  background-color: #f8f8f8;
  border-radius: 10px;
  height: 330px;
`;
const Section = styled.View`
  margin: 16px;
  padding: 16px;
  background-color: #f8f8f8;
  border-radius: 10px;
  height: 230px;
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

const ItemContainer = styled.View`
  flex-direction: row;
  margin-top: 30px;
  justify-content: space-between;
`;

const Item = styled.TouchableOpacity`
  width: 90px;
  align-items: center;
`;
const ItemImage = styled(MockupImage)`
  width: 70px;
  height: 70px;
  margin-bottom: 4px;
`;
// 최근 간병 보고서에 사용될 Book 이미지를 위한 스타일 컴포넌트
const BookImageContainer = styled.View`
  width: 70px;
  height: 70px;
  margin-bottom: 4px;
  align-items: center;
  justify-content: center;
`;

const ItemInfo = styled.View`
  flex-direction: row;
  align-self: flex-end;
  margin-top: 4px;
`;

const ItemDate = styled.Text`
  font-size: 14px;
  color: #444;
  margin-left: 4px;
`;

const ItemAuthor = styled.Text`
  font-size: 12px;
  color: #444;
  align-self: flex-end;
  margin-top: 4px;
`;

const SmallText = styled.Text`
  font-size: 10px;
  color: #444;
  margin-top: 2px;
  align-self: flex-end;
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

const ScoreIndicator = ({temperature}: {temperature: number}) => {
  const progressWidth = `${(temperature / 50) * 100}%`;

  return (
    <View style={[styles.scoreIndicator, {left: progressWidth}]}>
      <Text style={styles.scoreText}>{temperature.toFixed(1)}도</Text>
      <Triangle />
    </View>
  );
};

const styles = StyleSheet.create({
  scoreIndicator: {
    position: 'absolute',
    alignItems: 'center',
    top: -25,
    transform: [{translateX: -20}],
  },
  scoreText: {
    fontSize: 12,
    color: '#444',
    fontWeight: 'bold',
  },
});

const Home = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [temperature, setTemperature] = useState(30);

  useEffect(() => {
    // 예시 API 호출 (실제 API에서 데이터를 가져오는 로직을 추가해야 함)
  }, []);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const progressWidth = `${(temperature / 50) * 100}%`;

  return (
    <Container>
      <MannerSection>
        <SectionHeader>
          <SectionTitleContainer>
            <SectionTitle>매너 점수</SectionTitle>
          </SectionTitleContainer>
        </SectionHeader>
        <Text>간병인이 당신의 매너 점수를 다음과 같이 판단할 수 있어요.</Text>
        <ProgressContainer>
          <ProgressBar width={progressWidth} />
          <ScoreIndicator temperature={temperature} />
        </ProgressContainer>
      </MannerSection>

      <Section>
        <SectionHeader>
          <SectionTitleContainer>
            <IconContainer>
              <GalleryIcon width={18} height={18} />
            </IconContainer>
            <SectionTitle>최근 갤러리</SectionTitle>
          </SectionTitleContainer>
          <MoreButton onPress={() => navigation.navigate('Gallery')}>
            <MoreText>더보기 &gt;</MoreText>
          </MoreButton>
        </SectionHeader>
        <ItemContainer>
          {[1, 2, 3].map((_, index) => (
            <Item key={index} onPress={() => openModal('Image')}>
              <ItemImage />
              <ItemInfo>
                <Heart width={20} height={20} />
                <ItemDate>2024.10.15</ItemDate>
              </ItemInfo>
              <ItemAuthor>작성자</ItemAuthor>
            </Item>
          ))}
        </ItemContainer>
      </Section>

      {/* 최근 간병 보고서 섹션 */}
      <Section>
        <SectionHeader>
          <SectionTitleContainer>
            <IconContainer>
              <ReportIcon width={18} height={18} />
            </IconContainer>
            <SectionTitle>최근 간병 보고서</SectionTitle>
          </SectionTitleContainer>
          <MoreButton onPress={() => navigation.navigate('Reports')}>
            <MoreText>더보기 &gt;</MoreText>
          </MoreButton>
        </SectionHeader>
        <ItemContainer>
          {[1, 2, 3].map((_, index) => (
            <Item>
              <BookImageContainer>
                <Book width={70} height={70} />
              </BookImageContainer>
              <ItemDate style={{fontSize: 9}}>10월 15일 간병보고서</ItemDate>
              <SmallText>간병인</SmallText>
            </Item>
          ))}
        </ItemContainer>
      </Section>

      {/* 최근 쪽지 섹션 */}
      <MessageSection>
        <SectionHeader>
          <SectionTitleContainer>
            <IconContainer>
              <MessageIcon width={18} height={18} />
            </IconContainer>
            <SectionTitle>최근 쪽지</SectionTitle>
          </SectionTitleContainer>
          <MoreButton onPress={() => navigation.navigate('Messages')}>
            <MoreText>더보기 &gt;</MoreText>
          </MoreButton>
        </SectionHeader>
        {[
          '오늘 어르신 산책 다녀왔어요.',
          '식사는 잘 하셨나요?',
          '오늘 운동 하셨어요?',
        ].map((message, index) => (
          <RecentMessageContainer key={index}>
            <MessageAuthor>작성자</MessageAuthor>
            <MessageText>{message}</MessageText>
            <MessageTime>4분 전</MessageTime>
          </RecentMessageContainer>
        ))}
      </MessageSection>

      {/* 이미지 확대 모달 */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={closeModal}>
          <Text style={{fontSize: 40, color: '#fff'}}>{selectedImage}</Text>
        </TouchableOpacity>
      </Modal>
    </Container>
  );
};

export default Home;
