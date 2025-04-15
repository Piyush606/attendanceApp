'use client';

import { createContext, useContext, useState } from "react";

const PreviewContext = createContext();

export const usePreview = () => useContext(PreviewContext);

export const PreviewProvider = ({ children }) => {
  const [previewData, setPreviewData] = useState(null);
  const [previewDate, setPreviewDate] = useState(null);

  return (
    <PreviewContext.Provider value={{ previewData, setPreviewData, previewDate, setPreviewDate }}>
      {children}
    </PreviewContext.Provider>
  );
};
