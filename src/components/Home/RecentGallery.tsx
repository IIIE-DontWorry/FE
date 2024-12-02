import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
} from 'react-native';
import styled from 'styled-components/native';
import GalleryIcon from '../../assets/bottomnavigation/gallery.svg';
import Heart from '../../assets/home/heart.svg';
import ApiService from '../../utils/api'; // API 요청 유틸리티
import {useNavigation} from '@react-navigation/native';

const Container = styled.View`
  margin: 16px;
  padding: 16px;
  background-color: #f8f8f8;
  border-radius: 10px;
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
  margin-top: 20px;
`;

const Item = styled.TouchableOpacity`
  width: 90px;
  margin-right: 20px;
  align-items: center;
`;

const ItemImage = styled.Image`
  width: 70px;
  height: 70px;
  border-radius: 8px;
  margin-bottom: 4px;
`;

const ItemFooter = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ItemAuthor = styled.Text`
  font-size: 13px;
  color: #444;
`;

const ItemDate = styled.Text`
  font-size: 14px;
  color: black;
  text-align: center;
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

const RecentGallery = () => {
  const navigation = useNavigation(); // React Navigation 훅 사용
  const [galleryData, setGalleryData] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchRecentGallery = async () => {
      try {
        const patientId = 1; // Example patientId
        const response = await ApiService.get(`/gallery/recent/${patientId}`);
        if (response.status === 'success') {
          setGalleryData(response.data);
        } else {
          console.error('Failed to fetch gallery:', response.message);
        }
      } catch (error) {
        console.error('Error fetching gallery:', error.message);
      }
    };

    fetchRecentGallery();
  }, []);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <Container>
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

      {galleryData.length === 0 ? (
        <EmptyMessageContainer>
          <EmptyMessageText>최근 갤러리가 없습니다.</EmptyMessageText>
        </EmptyMessageContainer>
      ) : (
        <ItemContainer>
          <FlatList
            horizontal
            data={galleryData}
            keyExtractor={(item, index) => `${item.galleryId}-${index}`} // galleryId와 index 조합으로 고유 키 생성
            renderItem={({item}) => (
              <Item onLongPress={() => openModal(item.images[0].imageUrl)}>
                <ItemImage source={{uri: item.images[0].imageUrl}} />
                <ItemDate>
                  {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                </ItemDate>
                <ItemFooter>
                  <Heart width={14} height={14} style={{marginRight: 4}} />
                  <ItemAuthor>{item.createdBy}</ItemAuthor>
                </ItemFooter>
              </Item>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </ItemContainer>
      )}

      {/* Modal for full image view */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={closeModal}>
          <Image
            source={{uri: selectedImage || ''}}
            style={styles.modalImage}
          />
        </TouchableOpacity>
      </Modal>
    </Container>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
});

export default RecentGallery;
