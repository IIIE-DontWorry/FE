import React from 'react';
import {View, Text, FlatList, Image, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useRoute} from '@react-navigation/native';

type ImageType = {
  imageId: number;
  imageUrl: string;
};

type GalleryDetailProps = {
  galleryItem: {
    galleryId: number;
    createdBy: string;
    createdAt: string;
    title: string;
    images: ImageType[];
  };
};

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding: 16px;
`;

const Header = styled.View`
  padding-bottom: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const TitleText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
`;

const MetaInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const MetaText = styled.Text`
  font-size: 14px;
  color: #888;
`;

const ImageContainer = styled.View`
  margin-top: 16px;
`;

const StyledImage = styled.Image`
  width: 100%;
  height: 500px;
  margin-bottom: 16px;
  border-radius: 12px;
`;

const GalleryDetail: React.FC = () => {
  const route = useRoute();
  const {galleryItem} = route.params as GalleryDetailProps;

  const formatDate = (date: string): string => {
    const givenDate = new Date(date);
    const year = givenDate.getFullYear();
    const month = String(givenDate.getMonth() + 1).padStart(2, '0');
    const day = String(givenDate.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  return (
    <Container>
      {/* Header Section */}
      <Header>
        <TitleText>{galleryItem.title}</TitleText>
        <MetaInfo>
          <MetaText>작성자: {galleryItem.createdBy}</MetaText>
          <MetaText>{formatDate(galleryItem.createdAt)}</MetaText>
        </MetaInfo>
      </Header>

      {/* Image List Section */}
      <ImageContainer>
        <ScrollView>
          {galleryItem.images.map(image => (
            <StyledImage
              key={image.imageId}
              source={{uri: image.imageUrl}}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      </ImageContainer>
    </Container>
  );
};

export default GalleryDetail;
