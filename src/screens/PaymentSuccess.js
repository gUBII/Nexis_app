import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import FitImage from 'react-native-fit-image';
import ParsedText from 'react-native-parsed-text';

import {components} from '../components';
import {theme} from '../constants';

const PaymentSuccess = ({navigation}) => {
  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          justifyContent: 'center',
        }}
      >
        <components.Image
          source={require('../assets/icons/transaction.png')}
          style={{
            width: responsiveHeight(12),
            aspectRatio: 1 / 1,
            marginBottom: theme.sizes.marginBottom_30,
          }}
        />
        <Text
          style={{
            ...theme.fonts.SourceSansPro_SemiBold_24,
            lineHeight: theme.fonts.SourceSansPro_SemiBold_24.fontSize * 1.2,
            marginBottom: theme.sizes.marginBottom_30,
            color: theme.colors.mainDark,
          }}
        >
          Your payment has been{'\n'}processed!
        </Text>
        <ParsedText
          style={{
            ...theme.fonts.SourceSansPro_Regular_28,
            color: theme.colors.mainDark,
            marginBottom: theme.sizes.marginBottom_10,
          }}
          parse={[
            {
              pattern: /.00 USD/,
              style: {
                ...theme.fonts.SourceSansPro_Regular_16,
                color: theme.colors.mainDark,
              },
            },
          ]}
        >
          364.00 USD
        </ParsedText>
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_16,
            lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
            color: theme.colors.bodyTextColor,
          }}
        >
          Labore sunt culpa excepteur culpa ipsum. Labore occaecat ex nisi
          mollit.
        </Text>
      </ScrollView>
    );
  };

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
          onPress={() => {
            navigation.navigate('TabNavigator');
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

  return (
    <components.SafeAreaView background={true}>
      {/* {renderContent()}
      {renderFooter()} */}
      {renderContent()}
      {renderButton()}
    </components.SafeAreaView>
  );
};

export default PaymentSuccess;
