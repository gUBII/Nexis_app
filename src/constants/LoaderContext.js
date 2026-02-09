// LoaderContext.js
import React, { createContext, useContext, useState } from 'react';

const LoaderContext = createContext();

export const useLoader = () => {
  return useContext(LoaderContext);
};

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};
