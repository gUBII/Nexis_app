import React from 'react';
import {SafeAreaView as SafeAreaViewRN} from 'react-native-safe-area-context';
import {useTheme} from '../../constants/ThemeContext';

const SafeAreaView = ({children, edges, background, safeAreaStyle}) => {
  const {theme} = useTheme();
  

  if (!background) {
    return (
      <SafeAreaViewRN
        style={{
          flex: 1,
          backgroundColor: theme === 'dark' ? '#333' : '#fff',
          ...safeAreaStyle,
        }}
        edges={edges}
      >
        {children}
      </SafeAreaViewRN>
    );
  }

  if (!background) {
    return (
      <SafeAreaViewRN
      style={{
        flex: 1,
        ...safeAreaStyle,
      }}
        edges={edges}
      >
        {children}
      </SafeAreaViewRN>
    );
  }

  
};

export default SafeAreaView;
