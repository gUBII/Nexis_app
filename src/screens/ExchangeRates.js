import {View, Text} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {components} from '../components';
import {theme} from '../constants';

const ExchangeRates = () => {
  const renderBackground = () => {
    return (
      <components.ImageBackground
        source={require('../assets/bg/05.png')}
        style={{
          height: responsiveHeight(36),
          position: 'absolute',
          width: responsiveWidth(100),
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <components.Image
          source={require('../assets/icons/exchange-2.png')}
          style={{
            width: 30,
            height: 20,
          }}
        />
      </components.ImageBackground>
    );
  };

  return (
    <View style={{flex: 1}}>
      {renderBackground()}
    </View>
  );
};

export default ExchangeRates;
