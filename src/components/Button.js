import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import { useTheme } from '../constants/ThemeContext';

const Button = ({title, onPress, containerStyle, lightShade}) => {
  const {theme} = useTheme();
  return (
    <View style={{...containerStyle}}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          width: '100%',
          height: 40,
          backgroundColor: '#1EA8E7',
        }}
        onPress={onPress}
      >
        <Text
          style={{
            color: theme === 'dark' ? '#fff' : '#fff',
            textTransform: 'capitalize',
            fontSize: 16,
            fontWeight: '600', 
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Button;
