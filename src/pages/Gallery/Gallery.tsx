import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import FloatingButton from '../../components/Report/FloatingButton';
import Pen from '../../assets/report/pen.svg';
import {requestGalleryPermission} from '../../utils/requestGalleryPermission'; // 권한 요청 컴포넌트 임포트

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const ScrollContainer = styled.ScrollView`
  flex: 1;
`;

const GalleryItem = styled.View`
  margin: 16px;
  padding: 16px;
  background-color: #f8f8f8;
  border-radius: 10px;
  position: relative;
`;

const ItemHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ItemTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #444;
`;

const ItemDate = styled.Text`
  font-size: 12px;
  color: #888;
  margin-top: 4px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #ddd;
  margin: 12px 0;
`;

const DescriptionText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #222;
  margin-bottom: 12px;
`;

const ImageSlider = styled.View`
  margin-top: 8px;
`;

const PenIconContainer = styled.TouchableOpacity`
  position: absolute;
  top: 16px;
  right: 16px;
`;

const FullImage = styled.Image`
  width: 90%;
  height: 60%;
  border-radius: 12px;
`;

const FloatingButtonContainer = styled.View`
  position: absolute;
  bottom: 0px;
  right: 0px;
`;

const formatDate = (date: string) => {
  const givenDate = new Date(date);
  const year = givenDate.getFullYear();
  const month = String(givenDate.getMonth() + 1).padStart(2, '0');
  const day = String(givenDate.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const timeFromNow = (date: string) => {
  const now = new Date();
  const givenDate = new Date(date);
  const diffInMs = now.getTime() - givenDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}시간 전`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  }
};

const mockupData = [
  {
    id: 1,
    author: '보호자',
    date: '2024-11-30T10:30:00',
    description: '오늘 산책 다녀오신 사진 첨부해요.',
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150/0000FF',
      'https://via.placeholder.com/150/FF0000',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150/0000FF',
      'https://via.placeholder.com/150/FF0000',
    ],
  },
  {
    id: 2,
    author: '간병인',
    date: '2024-11-29T18:00:00',
    description: '오늘 드신 아침식사 사진입니다.',
    images: [
      'https://via.placeholder.com/150/00FF00',
      'https://via.placeholder.com/150/FFFF00',
      'https://via.placeholder.com/150/FF00FF',
    ],
  },
];

const Gallery = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigation = useNavigation();

  const openModal = (image: string) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleFloatingButtonPress = async () => {
    navigation.navigate('GalleryCreate');
  };

  return (
    <Container>
      <ScrollContainer>
        {mockupData.map(item => (
          <GalleryItem key={item.id}>
            <PenIconContainer onPress={() => console.log('Edit post')}>
              <Pen width={18} height={18} />
            </PenIconContainer>
            <ItemHeader>
              <ItemTitle>{item.author}</ItemTitle>
            </ItemHeader>
            <ItemDate>
              {timeFromNow(item.date)} | {formatDate(item.date)}
            </ItemDate>
            <Divider />
            <DescriptionText>{item.description}</DescriptionText>
            <ImageSlider>
              <FlatList
                horizontal
                data={item.images}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item: image}) => (
                  <TouchableOpacity
                    onLongPress={() => openModal(image)}
                    style={{marginRight: 8}}>
                    <Image
                      source={{uri: image}}
                      style={{width: 100, height: 100, borderRadius: 8}}
                    />
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </ImageSlider>
          </GalleryItem>
        ))}
      </ScrollContainer>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalBackground} onPress={closeModal}>
          <FullImage source={{uri: selectedImage || ''}} />
        </TouchableOpacity>
      </Modal>

      {/* 플로팅 버튼 */}
      <FloatingButtonContainer>
        <FloatingButton onPress={handleFloatingButtonPress} />
      </FloatingButtonContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Gallery;
