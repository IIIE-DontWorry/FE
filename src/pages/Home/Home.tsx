import React, {useState, useEffect} from 'react';
import {Text, View, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {useReports} from '../../store/ReportContext'; // useReports 가져오기
import GalleryIcon from '../../assets/bottomnavigation/gallery.svg';
import ReportIcon from '../../assets/bottomnavigation/report.svg';
import MockupImage from '../../assets/home/img_mockup.svg';
import Heart from '../../assets/home/heart.svg';
import Book from '../../assets/home/book.svg';
import {useMessages} from '../../store/MessageContext';
import RecentMessages from '../../components/Home/RecentMessages';
import RecentReports from '../../components/Home/RecentReports';
import RecentGallery from '../../components/Home/RecentGallery';
import {useUser} from '../../store/UserContext'; // useUser 추가
import ApiService from '../../utils/api'; // API 서비스 추가

// 매너 온도 API 응답 타입 정의
interface ScoreResponse {
  status: string;
  message: string;
  data: {
    score: number;
  };
}

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
const ItemInfo = styled.View`
  flex-direction: row;
  align-self: flex-end;
  margin-top: 4px;
`;

const ItemAuthor = styled.Text`
  font-size: 12px;
  color: #444;
  align-self: flex-end;
  margin-top: 4px;
`;

const ItemImage = styled(MockupImage)`
  width: 70px;
  height: 70px;
  margin-bottom: 4px;
`;
const BookImageContainer = styled.View`
  width: 70px;
  height: 70px;
  margin-bottom: 4px;
  align-items: center;
  justify-content: center;
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
const ItemDate = styled.Text`
  font-size: 14px;
  color: #444;
`;

const SmallText = styled.Text`
  font-size: 10px;
  color: #444;
  margin-top: 2px;
`;

const ScoreIndicator = ({score}: {score: number}) => {
  const progressPosition = (score / 100) * 100;

  return (
    <View style={[
      styles.scoreIndicator, 
      {
        left: `${progressPosition}%`,
        transform: [{translateX: -20}]
      }
    ]}>
      <Text style={styles.scoreText}>{score.toFixed(1)}도</Text>
      <Triangle />
    </View>
  );
};

const styles = StyleSheet.create({
  scoreIndicator: {
    position: 'absolute',
    alignItems: 'center',
    top: -25,
  },
  scoreText: {
    fontSize: 12,
    color: '#444',
    fontWeight: 'bold',
  },
});

const Home = () => {
  const navigation = useNavigation();
  const {reports} = useReports(); // 전역 상태에서 보고서 가져오기
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [temperature, setTemperature] = useState(30);
  const {messages} = useMessages();
  const {userType} = useUser();
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMannerScore = async () => {
      try {
        let response: ScoreResponse;
        
        // userType에 따라 하드코딩된 ID로 API 호출
        if (userType === '보호자') {
          response = await ApiService.get<ScoreResponse>('/notes/score/guardian/1');
        } else if (userType === '간병인') {
          response = await ApiService.get<ScoreResponse>('/notes/score/caregiver/2');
        } else {
          setScore(0);
          return;
        }

        if (response.status === 'success') {
          setScore(response.data.score);
        }
      } catch (error) {
        console.error('Error fetching manner score:', error);
        setScore(0);
      } finally {
        setLoading(false);
      }
    };

    fetchMannerScore();
  }, [userType]);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const progressWidth = `${(score / 100) * 100}%`;

  return (
    <Container>
      <MannerSection>
        <SectionHeader>
          <SectionTitleContainer>
            <SectionTitle>매너 온도</SectionTitle>
          </SectionTitleContainer>
        </SectionHeader>
        <Text>
          {userType === '보호자' 
            ? '간병인이 당신의 매너 온도를 다음과 같이 판단했어요.'
            : '보호자가 당신의 매너 온도를 다음과 같이 판단했어요.'}
        </Text>
        <ProgressContainer>
          <ProgressBar width={progressWidth} />
          <ScoreIndicator score={score} />
        </ProgressContainer>
      </MannerSection>

      {/* <Section>
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
      </Section> */}
      <RecentGallery />
      {/* 최근 간병 보고서 섹션 */}
      {/* <Section>
        <SectionHeader>
          <SectionTitleContainer>
            <IconContainer>
              <ReportIcon width={18} height={18} />
            </IconContainer>
            <SectionTitle>최근 간병 보고서</SectionTitle>
          </SectionTitleContainer>
          <MoreButton onPress={() => navigation.navigate('Report')}>
            <MoreText>더보기 &gt;</MoreText>
          </MoreButton>
        </SectionHeader>
        {reports.length === 0 ? (
          <EmptyMessageContainer>
            <EmptyMessageText>
              최근 간병보고서가 아직 작성되지 않았어요!
            </EmptyMessageText>
          </EmptyMessageContainer>
        ) : (
          <ItemContainer>
            {reports
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .slice(0, 3)
              .map((report, index) => (
                <Item
                  key={index}
                  onPress={() => navigation.navigate('ReportDetail', {report})}>
                  <BookImageContainer>
                    <Book width={70} height={70} />
                  </BookImageContainer>
                  <ItemDate>{report.date}</ItemDate>
                  <SmallText>간병인</SmallText>
                </Item>
              ))}
          </ItemContainer>
        )}
      </Section> */}
      <RecentReports />

      {/* 최근 쪽지 섹션 */}
      <RecentMessages />

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
