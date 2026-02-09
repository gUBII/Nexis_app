import {View, Text} from 'react-native';
import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-input';

import {components} from '../components';
import {theme} from '../constants';

const VerifyYourPhoneNumber = ({navigation}) => {
  const renderHeader = () => {
    return <components.Header goBack={true} title='Verify your phone number' />;
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: theme.sizes.paddingTop_20,
          paddingBottom: theme.sizes.paddingBottom_10,
          paddingHorizontal: 20,
        }}
        enableOnAndroid={true}
      >
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_16,
            lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
            marginBottom: theme.sizes.marginBottom_30,
            color: theme.colors.bodyTextColor,
          }}
        >
          We have sent you an SMS with a code to number +17 0123456789.
        </Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#FFEFE6',
            backgroundColor: theme.colors.white,
            borderRadius: 10,
            marginBottom: theme.sizes.marginBottom_14,
          }}
        >
          <PhoneInput
            style={{
              paddingHorizontal: 20,
              height: 50,
            }}
            initialCountry={'us'}
            initialValue='123456789'
            textStyle={{
              ...theme.fonts.SourceSansPro_Regular_16,
              color: theme.colors.mainDark,
            }}
          />
        </View>
        <components.Button
          title='Confirm'
          onPress={() => navigation.navigate('ConfirmationCode')}
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

export default VerifyYourPhoneNumber;
