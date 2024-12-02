import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleProp,
  ViewStyle,
} from 'react-native';
import styled from 'styled-components/native';
import Pen from '../../assets/report/pen.svg';

type ImageType = {
  imageId: number;
  imageUrl: string;
};

type GalleryItemProps = {
  item: {
    galleryId: number;
    createdBy: string;
    createdAt: string;
    title: string;
    images: ImageType[];
  };
  openModal: (image: string) => void;
};

const GalleryItemContainer = styled.View`
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

const GalleryItem: React.FC<GalleryItemProps> = ({item, openModal}) => {
  const formatDate = (date: string): string => {
    const givenDate = new Date(date);
    const year = givenDate.getFullYear();
    const month = String(givenDate.getMonth() + 1).padStart(2, '0');
    const day = String(givenDate.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const timeFromNow = (date: string): string => {
    try {
      const now = new Date();
      const givenDate = new Date(date);
      if (isNaN(givenDate.getTime())) {
        console.error(`Invalid date: ${date}`);
        return '잘못된 날짜';
      }

      const diffInMs = now.getTime() - givenDate.getTime();
      const diffInMinutes = Math.abs(Math.floor(diffInMs / (1000 * 60)));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
      if (diffInHours < 24) return `${diffInHours}시간 전`;
      return `${diffInDays}일 전`;
    } catch (error) {
      console.error(`Error in timeFromNow: ${error}`);
      return '알 수 없음';
    }
  };
  return (
    <GalleryItemContainer>
      <PenIconContainer onPress={() => console.log('Edit post')}>
        <Pen width={18} height={18} />
      </PenIconContainer>
      <ItemHeader>
        <ItemTitle>{item.createdBy}</ItemTitle>
      </ItemHeader>

      <ItemDate>
        {timeFromNow(item.createdAt)} | {formatDate(item.createdAt)}
      </ItemDate>
      <Divider />
      <DescriptionText>{item.title}</DescriptionText>
      <ImageSlider>
        <FlatList
          horizontal
          data={item.images}
          keyExtractor={image => image.imageId.toString()}
          renderItem={({item: image}) => (
            <TouchableOpacity
              onLongPress={() => openModal(image.imageUrl)}
              style={{marginRight: 8}}>
              <Image
                source={{uri: image.imageUrl}}
                style={{width: 100, height: 100, borderRadius: 8}}
              />
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </ImageSlider>
    </GalleryItemContainer>
  );
};

export default GalleryItem;
