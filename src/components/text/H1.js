import {Text} from 'react-native';
import React from 'react';

import {theme} from '../../constants';

const H1 = ({children, textStyle, mainDark}) => {
  return (
    <Text
      style={{
        ...theme.fonts.H1,
        fontSize: 32,
        color: mainDark ? theme.colors.mainDark : theme.colors.textColor,
        textTransform: 'capitalize',
        ...textStyle,
      }}
    >
      {children}
    </Text>
  );
};

export default H1;
