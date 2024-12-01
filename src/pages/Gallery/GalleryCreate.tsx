import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import styled from 'styled-components/native';
import {launchImageLibrary} from 'react-native-image-picker';
import BackIcon from '../../assets/common/back-icon.svg'; // 뒤로가기 아이콘
import CloseIcon from '../../assets/common/close-icon.svg'; // 닫기 아이콘

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const HeaderText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #222;
  flex: 1;
  text-align: center;
`;

const ImageWrapper = styled.View<{isSelected: boolean}>`
  width: 22%;
  margin: 6px;
  border-width: 2px;
  border-color: ${props => (props.isSelected ? '#D0FE35' : 'transparent')};
  position: relative;
  border-radius: 8px;
  aspect-ratio: 1; /* 정사각형 유지 */
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  padding: 2px;
`;

const LargeImageContainer = styled.View`
  align-items: center;
  margin: 16px 0;
`;

const DescriptionContainer = styled.View`
  padding: 12px;
  border-top-width: 1px;
  border-top-color: #ddd;
`;

const DescriptionTitle = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const PenIcon = styled.Text`
  font-size: 16px;
  color: #80d0ff;
  margin-right: 8px;
`;

const DescriptionInput = styled.TextInput`
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  height: 100px;
`;

const BottomBar = styled.View`
  position: absolute;
  bottom: 16px; /* 위로 약간 띄워서 둥근 효과 */
  left: 20px;
  right: 20px;
  padding: 16px;
  background-color: #6adec0;
  border-radius: 12px; /* 둥근 모서리 */
  align-items: center;
  elevation: 5; /* 그림자 효과 */
`;

const BottomBarText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
`;

const GalleryCreate = () => {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 0, // No limit for images
      },
      response => {
        if (response.assets) {
          const images = response.assets.map(asset => asset.uri || '');
          setGalleryImages(images);
          setSelectedImages(images); // 모든 이미지를 기본 선택 상태로 설정
          setSelectedImage(images[0] || null); // 첫 번째 이미지를 큰 이미지로 디폴트 설정
        }
      },
    );
  };

  const removeImage = (image: string) => {
    if (selectedImages.length === 1) {
      Alert.alert('경고', '최소 1개 이상의 사진을 선택해야합니다.');
      return;
    }
    const updatedImages = selectedImages.filter(item => item !== image);
    setSelectedImages(updatedImages);
    if (selectedImage === image && updatedImages.length > 0) {
      setSelectedImage(updatedImages[0]); // 삭제 후 첫 번째 이미지 선택
    } else if (updatedImages.length === 0) {
      setSelectedImage(null); // 이미지가 없으면 선택된 이미지 제거
    }
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <TouchableOpacity onPress={() => console.log('뒤로가기')}>
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <HeaderText>사진 첨부</HeaderText>
      </Header>

      {/* Image Grid and Large Image */}
      <FlatList
        data={selectedImages}
        keyExtractor={(item, index) => index.toString()}
        numColumns={4}
        contentContainerStyle={{marginHorizontal: 8, paddingBottom: 180}}
        renderItem={({item}) => (
          <ImageWrapper isSelected={selectedImages.includes(item)}>
            <CloseButton onPress={() => removeImage(item)}>
              <CloseIcon width={16} height={16} fill="#fff" />
            </CloseButton>
            <TouchableOpacity onPress={() => setSelectedImage(item)}>
              <Image
                source={{uri: item}}
                style={{width: '100%', height: '100%', borderRadius: 8}}
              />
            </TouchableOpacity>
          </ImageWrapper>
        )}
        ListHeaderComponent={
          selectedImage && (
            <LargeImageContainer>
              <Image
                source={{uri: selectedImage}}
                style={{width: '80%', height: 300, borderRadius: 8}}
              />
            </LargeImageContainer>
          )
        }
        ListFooterComponent={
          <DescriptionContainer>
            <DescriptionTitle>
              <PenIcon>🖊</PenIcon>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: '#333'}}>
                사진 설명 작성
              </Text>
            </DescriptionTitle>
            <DescriptionInput
              placeholder="사진에 대한 설명을 입력해주세요."
              value={description}
              onChangeText={setDescription}
              maxLength={100}
              multiline
            />
            <Text style={{marginTop: 8, textAlign: 'right', color: '#888'}}>
              {description.length}/100
            </Text>
          </DescriptionContainer>
        }
      />

      {/* Bottom Bar */}
      <BottomBar>
        <BottomBarText>
          {selectedImages.length}장의 사진을 업로드합니다.
        </BottomBarText>
      </BottomBar>
    </Container>
  );
};

export default GalleryCreate;
