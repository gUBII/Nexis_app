import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

import {theme} from '../constants';
import {svg} from '../assets/svg';
import {useTheme} from '../constants/ThemeContext';

const BlockHeading = ({title, onPress, containerStyle, icon}) => {
  const {theme, toggleTheme} = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 14,
        ...containerStyle,
      }}
    >
      <Text
        style={{
          color: theme === 'dark' ? '#fff' : '#000',
        }}
      >
        {title}
      </Text>
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          color: theme === 'dark' ? '#fff' : '#000',
        }}
      >
        {icon}
      </TouchableOpacity>
    </View>
  );
};

export default BlockHeading;
