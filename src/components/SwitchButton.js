import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';

import {theme} from '../constants';

const SwitchButton = () => {
  const [switchValue, setSwitchValue] = useState(true);

  return (
    <TouchableOpacity
      style={{
        width: 40,
        height: 24,
        backgroundColor: switchValue ? '#008AF9' : '#B4B4C6',
        borderRadius: 20,
        justifyContent: 'center',
        paddingHorizontal: 2,
        alignItems: switchValue ? 'flex-end' : 'flex-start',
      }}
      onPress={() => setSwitchValue(!switchValue)}
    >
      <View
        style={{
          width: 20,
          height: 20,
          backgroundColor: theme.colors.white,
          borderRadius: 10,
        }}
      />
    </TouchableOpacity>
  );
};

export default SwitchButton;
