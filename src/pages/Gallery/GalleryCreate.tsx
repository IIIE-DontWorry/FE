import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';
import CloseIcon from '../../assets/common/close-icon.svg'; // 닫기 아이콘
import ApiService from '../../utils/api'; // API 요청 유틸리티
import BackIcon from '../../assets/common/back-icon.svg'; // 뒤로가기 아이콘
import RNFS from 'react-native-fs'; // Import react-native-fs
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
  margin-right: 40px;
`;

const BackButton = styled(TouchableOpacity)`
  padding: 8px;
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
  bottom: 16px;
  left: 20px;
  right: 20px;
  padding: 16px;
  background-color: #6adec0;
  border-radius: 12px;
  align-items: center;
  elevation: 5;
`;

const PenIcon = styled.Text`
  font-size: 16px;
  color: #80d0ff;
  margin-right: 8px;
`;

const BottomBarText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
`;

type GalleryCreateProps = {
  route: {
    params: {
      selectedImages: {
        base64: string;
        uri: string;
        type: string;
        extension: string; // 확장자 추가
      }[];
    };
  };
  navigation: any;
};

const GalleryCreate: React.FC<GalleryCreateProps> = ({route, navigation}) => {
  const {selectedImages} = route.params;
  const [galleryImages, setGalleryImages] = useState(selectedImages);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    galleryImages[0]?.uri || null,
  );
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const removeImage = (index: number) => {
    if (galleryImages.length === 1) {
      Alert.alert('경고', '최소 한 장 이상의 이미지를 업로드 해야합니다.');
      return;
    }

    const updatedImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updatedImages);

    // 삭제된 이미지가 선택된 이미지인 경우, 새로운 이미지를 선택
    if (galleryImages[index].uri === selectedImage) {
      setSelectedImage(updatedImages[0]?.uri || null);
    }
  };

  const convertToBase64 = async (uri: string): Promise<string> => {
    try {
      console.log('Converting image to base64:', uri);
      const base64 = await RNFS.readFile(uri, 'base64'); // Read file and convert to base64
      console.log('Conversion successful');
      return base64;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  };

  const uploadImages = async () => {
    if (galleryImages.length === 0) {
      Alert.alert('오류', '업로드할 이미지를 선택하세요.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('오류', '사진에 대한 설명을 입력하세요.');
      return;
    }

    setIsUploading(true);

    try {
      const base64Images = await Promise.all(
        galleryImages.map(async img => {
          const base64 = await convertToBase64(img.uri); // Convert uri to base64
          return `data:image/${img.extension};base64,${base64}`;
        }),
      );

      const payload = {
        createdBy: '보호자',
        images: base64Images,
        title: description,
      };

      console.log('Upload Payload:', JSON.stringify(payload, null, 2)); // Debugging

      const patientId = 1; // Example patientId
      const response = await ApiService.post(
        `/gallery/upload/${patientId}`,
        payload,
      );

      if (response.status === 'success') {
        Alert.alert('성공', '사진이 성공적으로 업로드되었습니다.', [
          {
            text: '확인',
            onPress: () => {
              navigation.navigate('Main', {refresh: true});
            },
          },
        ]);
      } else {
        Alert.alert('오류', '업로드에 실패했습니다.');
        console.error('Upload Error:', response.message);
      }
    } catch (error) {
      Alert.alert('오류', '업로드 중 문제가 발생했습니다.');
      console.error('Upload Error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackIcon width={24} height={24} />
        </BackButton>
        <HeaderText>사진 첨부</HeaderText>
      </Header>

      {/* Image Grid and Large Image */}
      <FlatList
        data={galleryImages}
        keyExtractor={(_, index) => index.toString()}
        numColumns={4}
        contentContainerStyle={{marginHorizontal: 8, paddingBottom: 180}}
        renderItem={({item, index}) => (
          <ImageWrapper
            isSelected={galleryImages[index]?.uri === selectedImage}>
            <CloseButton onPress={() => removeImage(index)}>
              <CloseIcon width={16} height={16} fill="#fff" />
            </CloseButton>
            <TouchableOpacity onPress={() => setSelectedImage(item.uri)}>
              <Image
                source={{
                  uri: item.uri,
                }}
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
                사진 제목 작성
              </Text>
            </DescriptionTitle>
            <DescriptionInput
              placeholder="사진에 대한 제목을 입력해주세요."
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
        {isUploading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <TouchableOpacity onPress={uploadImages}>
            <BottomBarText>
              {galleryImages.length}장의 사진 업로드
            </BottomBarText>
          </TouchableOpacity>
        )}
      </BottomBar>
    </Container>
  );
};

export default GalleryCreate;
