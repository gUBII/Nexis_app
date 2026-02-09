import { StatusBar as RNStatusBar } from 'react-native';
import React from 'react';
import { useTheme } from '../constants/ThemeContext'; 

const StatusBar = () => {
  const { theme } = useTheme(); 

  return (
    <RNStatusBar
      barStyle={theme === 'dark' ? '#000' : '#000'}
      backgroundColor={theme === 'dark' ? '#000' : '#FFF'}
      translucent={true}
    />
  );
};

export default StatusBar;
