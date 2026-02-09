import React, { createContext, useContext, useState } from 'react';

const MenuContext = createContext();

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export const MenuProvider = ({ children }) => {
  const [refreshToggle, setRefreshToggle] = useState(false);

  const toggleRefresh = () => setRefreshToggle(prev => !prev);

  return (
    <MenuContext.Provider value={{ refreshToggle, toggleRefresh }}>
      {children}
    </MenuContext.Provider>
  );
};
