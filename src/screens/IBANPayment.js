import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {components} from '../components';
import {theme} from '../constants';

const cards = [
  {
    id: 1,
    number: '**** **** **** 7895',
    balance: '4 863.27',
    currency: 'USD',
    image: require('../assets/cards/01.png'),
  },
  {
    id: 2,
    number: '**** **** **** 7895',
    balance: '2 392.11',
    currency: 'EUR',
    image: require('../assets/cards/02.png'),
  },
];

const IBANPayment = ({navigation}) => {
  const [card, setCard] = useState(cards[0]);

  const renderHeader = () => {
    return <components.Header title='IBAN payment' goBack={true} />;
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1, paddingTop: 10, paddingBottom: 20}}
        enableOnAndroid={true}
      >
        <View style={{paddingHorizontal: 20}}>
          <Text
            style={{
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              color: theme.colors.bodyTextColor,
              marginBottom: 10,
            }}
          >
            Beneficiary info
          </Text>
          <components.InputField
            placeholder='IBAN number'
            hashIcon={true}
            containerStyle={{
              marginBottom: theme.sizes.marginBottom_10,
            }}
          />
          <components.InputField
            placeholder='Beneficiary name'
            userIcon={true}
            containerStyle={{
              marginBottom: theme.sizes.marginBottom_10,
            }}
          />
          <components.InputField
            placeholder='BIC code'
            keyIcon={true}
            containerStyle={{
              marginBottom: theme.sizes.marginBottom_10,
            }}
          />
          <components.InputField
            placeholder='Beneficiary bank'
            briefcaseIcon={true}
            containerStyle={{
              marginBottom: theme.sizes.marginBottom_10,
            }}
          />
          <components.InputField
            placeholder='Amount'
            dollarIcon={true}
            containerStyle={{
              marginBottom: theme.sizes.marginBottom_10,
            }}
          />
          <View
            style={{
              width: '100%',
              backgroundColor: theme.colors.white,
              borderRadius: 10,
              height: responsiveHeight(14),
              borderWidth: 1,
              borderColor: '#FFEFE6',
              paddingHorizontal: 20,
              paddingVertical: 14,
              marginBottom: responsiveHeight(3),
            }}
          >
            <TextInput
              placeholder='Comment'
              style={{
                flex: 1,
              }}
              multiline={true}
            />
          </View>
        </View>
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_14,
            lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
            color: theme.colors.bodyTextColor,
            marginBottom: theme.sizes.marginBottom_10,
            marginLeft: 20,
          }}
        >
          Use card
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            flexGrow: 0,
          }}
          contentContainerStyle={{
            paddingLeft: 20,
          }}
        >
          {cards.map((item, index, array) => {
            const last = index === array.length - 1;

            return (
              <TouchableOpacity
                key={index}
                style={{
                  width: responsiveWidth(74),
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor:
                    item.id === card.id ? theme.colors.mainColor : '#FFEFE6',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  marginRight: last ? 0 : 14,
                  backgroundColor: theme.colors.white,
                }}
                onPress={() => setCard(item)}
              >
                <components.Image
                  source={item.image}
                  style={{
                    width: 62,
                    height: 42,
                    marginRight: 12,
                  }}
                />
                <View>
                  <Text
                    style={{
                      color: theme.colors.bodyTextColor,
                      ...theme.fonts.SourceSansPro_Regular,
                      fontSize: 12,
                    }}
                  >
                    {item.number}
                  </Text>
                  <Text
                    style={{
                      ...theme.fonts.H6,
                      color: theme.colors.mainDark,
                    }}
                  >
                    {item.balance} {item.currency}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </KeyboardAwareScrollView>
    );
  };

  const renderButton = () => {
    return (
      <components.Button
        title='Send'
        onPress={() => {
          navigation.navigate('PaymentSuccess');
          // navigation.navigate('PaymentFailed');
        }}
        containerStyle={{
          margin: 20,
        }}
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

export default IBANPayment;
