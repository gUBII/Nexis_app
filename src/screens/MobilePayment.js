import {View, Text} from 'react-native';
import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-input';

import {components} from '../components';
import {theme} from '../constants';

const MobilePayment = ({navigation}) => {
  const renderHeader = () => {
    return <components.Header title='Mobile payment' goBack={true} />;
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: theme.sizes.paddingTop_10,
          paddingBottom: theme.sizes.paddingBottom_20,
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            borderWidth: 1,
            borderColor: '#FFEFE6',
            backgroundColor: theme.colors.white,
            borderRadius: 10,
            marginBottom: theme.sizes.marginBottom_10,
          }}
        >
          <PhoneInput
            style={{
              paddingHorizontal: 10,
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
        <components.InputField
          placeholder='Amount'
          dollarIcon={true}
          containerStyle={{
            marginBottom: 10,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.sizes.marginBottom_20,
          }}
        >
          <Text
            style={{
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              color: theme.colors.bodyTextColor,
            }}
          >
            Your balance: 4 863.27 USD
          </Text>
          <Text
            style={{
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              color: theme.colors.bodyTextColor,
            }}
          >
            No fees
          </Text>
        </View>
        <components.Button
          title='Confirm'
          onPress={() => navigation.navigate('TopUpPayment')}
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

export default MobilePayment;
