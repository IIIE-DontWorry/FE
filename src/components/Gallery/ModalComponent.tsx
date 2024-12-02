import React from 'react';
import {Modal, TouchableOpacity, Image, StyleSheet} from 'react-native';
import styled from 'styled-components/native';

type ModalComponentProps = {
  visible: boolean;
  imageUri: string | null;
  closeModal: () => void;
};

const FullImage = styled.Image`
  width: 90%;
  height: 60%;
  border-radius: 12px;
`;

const ModalComponent: React.FC<ModalComponentProps> = ({
  visible,
  imageUri,
  closeModal,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableOpacity style={styles.modalBackground} onPress={closeModal}>
        <FullImage source={{uri: imageUri || ''}} />
      </TouchableOpacity>
    </Modal>
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

export default ModalComponent;
