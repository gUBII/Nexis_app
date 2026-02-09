import {Text, ScrollView} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {components} from '../components';
import {theme} from '../constants';

const ForgotPasswordSentEmail = ({navigation}) => {
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
          source={require('../assets/icons/padlock.png')}
          style={{
            width: responsiveHeight(13),
            aspectRatio: 1 / 1,
            marginBottom: theme.sizes.marginBottom_30,
          }}
        />
        <Text
          style={{
            ...theme.fonts.SourceSansPro_SemiBold_28,
            lineHeight: theme.fonts.SourceSansPro_SemiBold_28.fontSize * 1.2,
            marginBottom: theme.sizes.marginBottom_20,
            color: theme.colors.mainDark,
          }}
        >
          Your password has{'\n'}been reset!
        </Text>
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_16,
            lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
            marginBottom: theme.sizes.marginBottom_20,
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
        onPress={() => navigation.navigate('SignIn')}
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

export default ForgotPasswordSentEmail;
