import React, {useState, useEffect} from 'react';
import {FlatList, Alert, TouchableOpacity} from 'react-native'; // TouchableOpacity 추가
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import FloatingButton from '../../components/Report/FloatingButton';
import ApiService from '../../utils/api';
import GalleryItem from '../../components/Gallery/GalleryItem';
import ModalComponent from '../../components/Gallery/ModalComponent';
import {launchImageLibrary, Asset} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer'; // ImageResizer 추가
import {useIsFocused} from '@react-navigation/native';
type ImageType = {
  imageId: number;
  imageUrl: string;
};

type GalleryDataType = {
  galleryId: number;
  createdBy: string;
  createdAt: string;
  title: string;
  images: ImageType[];
};

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const EmptyMessageContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyMessageText = styled.Text`
  font-size: 18px;
  color: #888;
`;

const FloatingButtonContainer = styled.View`
  position: absolute;
  bottom: 16px;
  right: 16px;
`;

const Gallery: React.FC = () => {
  console.log('ImageResizer:', ImageResizer);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [galleryData, setGalleryData] = useState<GalleryDataType[]>([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // 화면 포커스 상태 확인

  const handleImageResizing = async (imageUri: string) => {
    console.log('Starting image resizing process...');
    console.log('Provided URI:', imageUri);

    if (!imageUri) {
      console.error('Invalid image URI for resizing:', imageUri);
      return imageUri; // 원본 URI 반환
    }

    try {
      const resizedImage = await ImageResizer.createResizedImage(
        imageUri, // 필수: 이미지 경로
        300, // 필수: 너비
        300, // 필수: 높이
        'JPEG', // 필수: 포맷
        80, // 필수: 품질 (0~100)
        0, // 선택: 회전 각도 (기본값 0)
        undefined, // 선택: 출력 경로 (기본값 사용)
        false, // 선택: 메타데이터 유지 여부
        {mode: 'contain'}, // 선택: 크기 조정 모드
      );

      console.log('Image resizing successful:', resizedImage);
      return resizedImage.uri; // 리사이즈된 이미지 URI 반환
    } catch (error) {
      console.error('Error occurred during image resizing:', error);
      return imageUri; // 크기 조정 실패 시 원본 이미지 반환
    }
  };

  const handleFloatingButtonPress = () => {
    console.log('Launching image picker...');
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 0,
        includeBase64: true,
      },
      async response => {
        console.log('Image picker response:', response);

        if (response.didCancel) {
          console.log('User cancelled image selection');
          return;
        }

        if (response.errorCode) {
          console.error(
            'Image picker error:',
            response.errorMessage || 'Unknown error',
          );
          Alert.alert(
            '오류',
            response.errorMessage || '이미지 선택 중 오류 발생',
          );
          return;
        }

        if (!response.assets || response.assets.length === 0) {
          console.error('No assets found in response');
          return;
        }

        console.log('Selected assets:', response.assets);

        const resizedImages = await Promise.all(
          response.assets.map(async asset => {
            console.log('Processing asset:', asset);

            try {
              if (!asset.uri) {
                throw new Error('Missing URI in selected asset');
              }

              const resizedUri = await handleImageResizing(asset.uri);
              return {
                base64: asset.base64 || '',
                uri: resizedUri,
                type: asset.type || 'image/jpeg',
                extension: asset.fileName?.split('.').pop() || 'jpeg',
              };
            } catch (error) {
              console.error('Error resizing asset:', asset, error);
              return {
                base64: asset.base64 || '',
                uri: asset.uri || '',
                type: asset.type || 'image/jpeg',
                extension: asset.fileName?.split('.').pop() || 'jpeg',
              };
            }
          }),
        );

        console.log('Resized images:', resizedImages);

        navigation.navigate('GalleryCreate', {
          selectedImages: resizedImages,
        });
      },
    );
  };

  const fetchGalleryData = async () => {
    try {
      const patientId = 1; // Example patientId
      console.log(`Fetching gallery data for patientId: ${patientId}`);
      const response = await ApiService.get(`/gallery/${patientId}`);
      console.log('API Response:', response);
      if (response.status === 'success') {
        setGalleryData(response.data);
      } else {
        console.error('Failed to fetch gallery:', response.message);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error.message);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchGalleryData(); // 화면 포커스 시 데이터 새로고침
    }
  }, [isFocused]);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleGalleryItemPress = (item: GalleryDataType) => {
    navigation.navigate('GalleryDetail', {galleryItem: item});
  };

  // const handleFloatingButtonPress = () => {
  //   launchImageLibrary(
  //     {
  //       mediaType: 'photo',
  //       selectionLimit: 0,
  //       includeBase64: true,
  //     },
  //     async response => {
  //       if (response.didCancel) {
  //         console.log('User cancelled image selection');
  //         return;
  //       }
  //       if (response.errorCode) {
  //         Alert.alert(
  //           '오류',
  //           response.errorMessage || '이미지 선택 중 오류 발생',
  //         );
  //         return;
  //       }
  //       if (!response.assets) {
  //         console.error('No assets found in response');
  //         return;
  //       }

  //       const resizedImages = await Promise.all(
  //         response.assets.map(async asset => {
  //           try {
  //             const uploadFileName = `resized-${Date.now()}.jpg`; // 고유 파일 이름 생성
  //             const resizedImage = await ImageResizer.createResizedImage(
  //               uri, // 필수: 이미지 경로
  //               300, // 필수: 너비
  //               300, // 필수: 높이
  //               'JPEG', // 필수: 포맷
  //               80, // 필수: 품질 (0~100)
  //               0, // 선택: 회전 각도 (0으로 기본값 설정)
  //               undefined, // 선택: 출력 경로 (기본값 사용)
  //               false, // 선택: 메타데이터 유지 여부
  //               {mode: 'contain'}, // 선택: 이미지 크기 조정 모드
  //             );
  //             console.log('Resized Image:', resizedImage);

  //             return {
  //               base64: asset.base64 || '',
  //               uri: resizedImage.uri, // 리사이즈된 이미지 경로
  //               type: asset.type || 'image/jpeg',
  //               extension: 'jpeg', // 리사이즈 후 확장자
  //             };
  //           } catch (error) {
  //             console.error('Error resizing image:', error);
  //             return {
  //               base64: asset.base64 || '',
  //               uri: asset.uri || '',
  //               type: asset.type || 'image/jpeg',
  //               extension: asset.fileName?.split('.').pop() || 'jpeg',
  //             };
  //           }
  //         }),
  //       );

  //       navigation.navigate('GalleryCreate', {
  //         selectedImages: resizedImages,
  //       });
  //     },
  //   );
  // };

  return (
    <Container>
      {galleryData.length > 0 ? (
        <FlatList
          data={galleryData}
          keyExtractor={item => item.galleryId.toString()}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleGalleryItemPress(item)}>
              <GalleryItem item={item} openModal={openModal} />
            </TouchableOpacity>
          )}
        />
      ) : (
        <EmptyMessageContainer>
          <EmptyMessageText>아직 업로드된 사진이 없어요.</EmptyMessageText>
        </EmptyMessageContainer>
      )}
      <ModalComponent
        visible={modalVisible}
        imageUri={selectedImage}
        closeModal={closeModal}
      />
      <FloatingButtonContainer>
        <FloatingButton onPress={handleFloatingButtonPress} />
      </FloatingButtonContainer>
    </Container>
  );
};

export default Gallery;
