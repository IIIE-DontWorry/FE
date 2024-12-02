import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useFontSize } from '../../store/FontSizeContext';

const FontSizeChange = () => {
  const { setScale } = useFontSize();
  const [sliderValue, setSliderValue] = useState<number>(1); // 초기값 설정 (1 = 기본)

  const handleFontSizeChange = (value: number) => {
    const scales = [1, 1.25, 1.5]; // 기본, 크게, 많이 크게
    setSliderValue(value);
    setScale(scales[Math.round(value)]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>폰트 크기 설정</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={2}
        step={1}
        value={sliderValue} // 초기값 설정
        onValueChange={(value) => handleFontSizeChange(value)} // 값 변경 핸들러
      />
      <Text style={styles.label}>
        {sliderValue === 0
          ? '기본'
          : sliderValue === 1
          ? '크게'
          : '많이 크게'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  slider: {
    width: '80%',
    height: 40,
  },
  label: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default FontSizeChange;
