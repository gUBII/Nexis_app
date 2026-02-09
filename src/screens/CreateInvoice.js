import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {components} from '../components';
import {theme} from '../constants';

const CreateInvoice = ({navigation}) => {
  const [currency, setCurrency] = useState('USD');

  const renderHeader = () => {
    return <components.Header goBack={true} title='Create invoice' />;
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: theme.sizes.marginTop_10,
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <components.InputField
          placeholder='Company name'
          userIcon={true}
          containerStyle={{
            marginBottom: theme.sizes.marginBottom_10,
          }}
        />
        <components.InputField
          placeholder='Country'
          mapPinIcon={true}
          containerStyle={{
            marginBottom: theme.sizes.marginBottom_10,
          }}
        />
        <components.InputField
          placeholder='Company email'
          emailIcon={true}
          containerStyle={{
            marginBottom: theme.sizes.marginBottom_10,
          }}
        />
        <components.InputField
          placeholder='Amount'
          dollarIcon={true}
          containerStyle={{
            marginBottom: theme.sizes.marginBottom_30,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.sizes.marginBottom_30,
          }}
        >
          <TouchableOpacity
            style={{
              width: responsiveWidth(48) - 20,
              backgroundColor:
                currency === 'USD' ? theme.colors.mainDark : theme.colors.white,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 6,
              borderWidth: 1,
              borderColor:
                currency !== 'USD'
                  ? theme.colors.bodyTextColor
                  : theme.colors.mainDark,
            }}
            onPress={() => setCurrency('USD')}
          >
            <Text
              style={{
                color:
                  currency === 'USD'
                    ? theme.colors.white
                    : theme.colors.mainDark,
                textTransform: 'uppercase',
                ...theme.fonts.SourceSansPro_Regular_14,
              }}
            >
              USD
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: responsiveWidth(48) - 20,
              backgroundColor:
                currency === 'EUR' ? theme.colors.mainDark : theme.colors.white,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 6,
              borderWidth: 1,
              borderColor:
                currency !== 'EUR'
                  ? theme.colors.bodyTextColor
                  : theme.colors.mainDark,
            }}
            onPress={() => setCurrency('EUR')}
          >
            <Text
              style={{
                color:
                  currency === 'EUR'
                    ? theme.colors.white
                    : theme.colors.mainDark,
                ...theme.fonts.SourceSansPro_Regular_14,
                textTransform: 'uppercase',
              }}
            >
              EUR
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '100%',
            backgroundColor: theme.colors.white,
            borderRadius: 10,
            height: responsiveHeight(16),
            borderWidth: 1,
            borderColor: '#FFEFE6',
            paddingHorizontal: 20,
            paddingVertical: 14,
            marginBottom: responsiveHeight(1),
          }}
        >
          <TextInput
            placeholder='Description'
            style={{
              flex: 1,
            }}
            multiline={true}
          />
        </View>
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_14,
            lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
            color: theme.colors.bodyTextColor,
          }}
        >
          Bank fee is charged from the payer.
        </Text>
      </KeyboardAwareScrollView>
    );
  };

  const renderButton = () => {
    return (
      <components.Button
        containerStyle={{padding: 20}}
        title='Send invoice'
        onPress={() => navigation.navigate('InvoiceSent')}
      />
    );
  };

  return (
    <components.SafeAreaView background={true}>
      {renderHeader()}
      {renderContent()}
      {renderButton()}
    </components.SafeAreaView>
  );
};

export default CreateInvoice;
