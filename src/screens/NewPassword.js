import {Text} from 'react-native';
import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {components} from '../components';
import {theme} from '../constants';

const NewPassword = ({navigation}) => {
  const renderHeader = () => {
    return <components.Header goBack={true} title='New password' />;
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: theme.sizes.marginTop_20,
          paddingBottom: theme.sizes.paddingBottom_20,
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_16,
            lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
            color: theme.colors.bodyTextColor,
            marginBottom: theme.sizes.marginBottom_30,
          }}
        >
          Enter new password and confirm.
        </Text>
        <components.InputField
          keyIcon={true}
          placeholder='••••••'
          containerStyle={{
            marginBottom: theme.sizes.marginBottom_10,
          }}
          secureTextEntry={true}
          eyeOffIcon={true}
        />
        <components.InputField
          placeholder='Confirm your password'
          keyIcon={true}
          secureTextEntry={true}
          containerStyle={{
            marginBottom: theme.sizes.marginBottom_14,
          }}
          eyeOffIcon={true}
        />
        <components.Button
          title='Change Password'
          onPress={() => navigation.navigate('ForgotPasswordSentEmail')}
        />
      </KeyboardAwareScrollView>
    );
  };

  return (
    <components.SafeAreaView background={true}>
      {renderHeader()}
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default NewPassword;
