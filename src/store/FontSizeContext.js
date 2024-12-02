import React, { createContext, useContext, useState } from 'react';

const FontSizeContext = createContext();

const baseFontSizes = [12, 14, 16, 18, 20, 24];

export const FontSizeProvider = ({ children }) => {
  const [scale, setScale] = useState(1); // 기본 배율

  const fontSizes = baseFontSizes.map((size) => size * scale);

  return (
    <FontSizeContext.Provider value={{ fontSizes, setScale }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => useContext(FontSizeContext);
