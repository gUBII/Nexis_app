import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import FitImage from 'react-native-fit-image';
import ParsedText from 'react-native-parsed-text';

import {components} from '../components';
import {theme} from '../constants';

const details = {
  id: 1,
  sentTo: 'Hillary Holmes',
  card: '**** 1234',
  amount: '263.57 USD',
  fee: '1.8 USD',
  residualBalance: '4 863.27 USD',
};

const TransactionDetails = () => {
  const renderHeader = () => {
    return <components.Header goBack={true} />;
  };

  // const renderContent = () => {
  //   return (
  //     <ScrollView
  //       contentContainerStyle={{
  //         flexGrow: 1,
  //         paddingTop: theme.sizes.paddingTop_10,
  //         paddingBottom: theme.sizes.paddingBottom_20,
  //       }}
  //     >
  //       <ParsedText
  //         style={{
  //           ...theme.fonts.SourceSansPro_Regular_40,
  //           color: theme.colors.mainDark,
  //           textAlign: 'center',
  //           marginBottom: theme.sizes.marginBottom_10,
  //         }}
  //         parse={[
  //           {
  //             pattern: /57 USD/,
  //             style: {
  //               ...theme.fonts.SourceSansPro_Regular_16,
  //               color: theme.colors.mainDark,
  //             },
  //           },
  //         ]}
  //       >
  //         - 263.57 USD
  //       </ParsedText>
  //       <Text
  //         style={{
  //           color: '#B4B4C6',
  //           textAlign: 'center',
  //           ...theme.fonts.SourceSansPro_Regular_14,
  //           lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
  //           marginBottom: theme.sizes.marginBottom_20,
  //         }}
  //       >
  //         Apr 10, 2023 at 11:34 AM
  //       </Text>
  //       <components.Image
  //         source={require('../assets/icons/check.png')}
  //         style={{
  //           width: responsiveHeight(8),
  //           aspectRatio: 1 / 1,
  //           alignSelf: 'center',
  //           marginBottom: theme.sizes.marginBottom_25,
  //         }}
  //       />
  //       <View
  //         style={{
  //           paddingHorizontal: 20,
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //           justifyContent: 'space-between',
  //           marginBottom: responsiveHeight(2),
  //         }}
  //       >
  //         <Text
  //           style={{
  //             ...theme.fonts.SourceSansPro_Regular_16,
  //             lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
  //             color: theme.colors.bodyTextColor,
  //           }}
  //         >
  //           Sent to
  //         </Text>
  //         <Text
  //           style={{
  //             ...theme.fonts.SourceSansPro_Regular_16,
  //             lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.3,
  //             color: theme.colors.mainDark,
  //           }}
  //         >
  //           Hillary Holmes
  //         </Text>
  //       </View>
  //       <View
  //         style={{
  //           paddingHorizontal: 20,
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //           justifyContent: 'space-between',
  //           marginBottom: responsiveHeight(2),
  //         }}
  //       >
  //         <Text
  //           style={{
  //             ...theme.fonts.SourceSansPro_Regular_16,
  //             lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
  //             color: theme.colors.bodyTextColor,
  //           }}
  //         >
  //           Card
  //         </Text>
  //         <Text
  //           style={{
  //             ...theme.fonts.SourceSansPro_Regular_16,
  //             lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.3,
  //             color: theme.colors.mainDark,
  //           }}
  //         >
  //           **** 4253
  //         </Text>
  //       </View>
  //       <View
  //         style={{
  //           paddingHorizontal: 20,
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //           justifyContent: 'space-between',
  //           marginBottom: responsiveHeight(2),
  //         }}
  //       >
  //         <Text
  //           style={{
  //             ...theme.fonts.SourceSansPro_Regular_16,
  //             lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
  //             color: theme.colors.bodyTextColor,
  //           }}
  //         >
  //           Amount
  //         </Text>
  //         <Text
  //           style={{
  //             ...theme.fonts.SourceSansPro_Regular_16,
  //             lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.3,
  //             color: theme.colors.mainDark,
  //           }}
  //         >
  //           263.57 USD
  //         </Text>
  //       </View>
  //       <View
  //         style={{
  //           paddingHorizontal: 20,
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //           justifyContent: 'space-between',
  //           marginBottom: responsiveHeight(2),
  //         }}
  //       >
  //         <Text
  //           style={{
  //             ...theme.fonts.SourceSansPro_Regular_16,
  //             lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
  //             color: theme.colors.bodyTextColor,
  //           }}
  //         >
  //           Fee
  //         </Text>
  //         <Text
  //           style={{
  //             ...theme.fonts.SourceSansPro_Regular_16,
  //             lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.3,
  //             color: theme.colors.mainDark,
  //           }}
  //         >
  //           1.8 USD
  //         </Text>
  //       </View>
  //       <View
  //         style={{
  //           paddingHorizontal: 20,
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //           justifyContent: 'space-between',
  //           marginBottom: responsiveHeight(2),
  //         }}
  //       >
  //         <Text
  //           style={{
  //             ...theme.fonts.SourceSansPro_Regular_16,
  //             lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
  //             color: theme.colors.bodyTextColor,
  //           }}
  //         >
  //           Residual balance
  //         </Text>
  //         <Text
  //           style={{
  //             ...theme.fonts.SourceSansPro_Regular_16,
  //             lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.3,
  //             color: theme.colors.mainDark,
  //           }}
  //         >
  //           4 863.27 USD
  //         </Text>
  //       </View>
  //     </ScrollView>
  //   );
  // };

  const renderFooter = () => {
    return (
      <View
        style={{
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <components.Button
          title='repeat transfer'
          containerStyle={{
            width: responsiveWidth(42),
          }}
          lightShade={true}
        />
        <components.Button
          title='Download PDF'
          containerStyle={{
            width: responsiveWidth(42),
          }}
        />
      </View>
    );
  };

  const renderContent = () => {
    const [currency, setCurrency] = useState('USD');
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
    <components.SafeAreaView>
      {renderHeader()}
      {/* {renderContent()}
      {renderFooter()} */}
      {renderContent()}
      {renderButton()}
    </components.SafeAreaView>
  );
};

export default TransactionDetails;
