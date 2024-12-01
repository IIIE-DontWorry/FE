import {PermissionsAndroid, Platform, Alert} from 'react-native';

export const requestGalleryPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions);

      if (
        granted['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        return true; // 권한 허용
      } else {
        Alert.alert('권한 거부', '갤러리에 접근할 수 없습니다.');
        return false; // 권한 거부
      }
    } catch (err) {
      console.warn(err);
      return false; // 오류 발생 시 기본적으로 거부 처리
    }
  }
  return true; // iOS는 권한 요청 필요 없음
};
