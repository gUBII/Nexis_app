import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import FitImage from 'react-native-fit-image';

import {components} from '../components';
import {theme} from '../constants';

const InvoiceSent = ({navigation}) => {
  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-end',
          paddingHorizontal: 20,
        }}
      >
        <components.Image
          source={require('../assets/icons/bill.png')}
          style={{
            width: responsiveHeight(13),
            aspectRatio: 1 / 1,
            marginBottom: theme.sizes.marginBottom_30,
          }}
        />
        <Text
          style={{
            marginBottom: theme.sizes.marginBottom_20,
            ...theme.fonts.SourceSansPro_SemiBold_28,
            lineHeight: theme.fonts.SourceSansPro_SemiBold_28.fontSize * 1.2,
            color: theme.colors.mainDark,
          }}
        >
          Your invoice has been{'\n'}sent!
        </Text>
        <Text
          style={{
            marginBottom: responsiveHeight(2),
            ...theme.fonts.SourceSansPro_Regular_16,
            lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
            color: theme.colors.bodyTextColor,
          }}
        >
          Qui ex aute ipsum duis. Incididunt adipisicing voluptate laborum
        </Text>
      </ScrollView>
    );
  };

  const renderButton = () => {
    return (
      <components.Button
        containerStyle={{padding: 20, width: responsiveWidth(50)}}
        title='Done'
        onPress={() => navigation.navigate('TabNavigator')}
      />
    );
  };

  return (
    <components.SafeAreaView background={true}>
      {renderContent()}
      {renderButton()}
    </components.SafeAreaView>
  );
};

export default InvoiceSent;
