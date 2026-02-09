import {Text} from 'react-native';
import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ParsedText from 'react-native-parsed-text';
import {components} from '../components';
import {theme} from '../constants';

const ForgotPassword = ({navigation}) => {
  const renderHeader = () => {
    return <components.Header goBack={true} title='Forgot password' />;
  };

  const renderContent = () => {
    const handleSignIn = () => {
      navigation.navigate('SignIn');
    };
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: theme.sizes.paddingTop_20,
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_16,
            lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
            color: '#ffffff',
            marginBottom: theme.sizes.marginBottom_30,
          }}
        >
          Please enter your email address. You will receive a link to create a
          new password via email.
        </Text>
        <components.InputField
          placeholder='brileyhenderson@mail.com'
          emailIcon={true}
          checkIcon={true}
          containerStyle={{marginBottom: theme.sizes.marginBottom_14}}
        />
        <components.Button
          title='Send'
          onPress={() => navigation.navigate('NewPassword')}
        />

        <ParsedText
          style={{
            ...theme.fonts.SourceSansPro_Regular_16,
            lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
            color: '#ffffff',
            padding: 2,
          }}
          parse={[
            {
              pattern: /Log in./,
              style: {color: theme.colors.mainColor},
              onPress: handleSignIn,
            },
          ]}
        >
          Back to Log in.
        </ParsedText>
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

export default ForgotPassword;
