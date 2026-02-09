import {View, ActivityIndicator} from 'react-native';
import React from 'react';

import {theme} from '../constants';

const Loader = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
      }}
    >
      <ActivityIndicator size='large' color={theme.colors.mainColor} />
    </View>
  );
};

export default Loader;
