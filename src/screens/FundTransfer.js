import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
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

const FundTransfer = ({navigation}) => {
  const [card, setCard] = useState(cards[0]);

  const renderHeader = () => {
    return <components.Header title='Fund transfer' goBack={true} />;
  };

  const renderSendMoney = () => {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          marginTop: theme.sizes.marginTop_10,
        }}
      >
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_14,
            color: theme.colors.bodyTextColor,
            lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
            marginBottom: theme.sizes.marginBottom_10,
          }}
        >
          Use card
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.sizes.marginBottom_30,
          }}
        >
          <components.Image
            source={{uri: 'https://george-fx.github.io/apitex/users/02.png'}}
            style={{
              width: responsiveWidth(8),
              aspectRatio: 1 / 1,
              marginRight: 14,
            }}
          />
          <Text
            style={{
              marginRight: 'auto',
              ...theme.fonts.SourceSansPro_Regular_16,
              lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.3,
              color: theme.colors.mainDark,
              textTransform: 'capitalize',
            }}
            numberOfLines={1}
          >
            Jazmine Goodwin
          </Text>
          <Text
            style={{
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              color: theme.colors.bodyTextColor,
            }}
          >
            **** 1258
          </Text>
        </View>
      </View>
    );
  };

  const renderUseCard = () => {
    return (
      <View>
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_14,
            color: theme.colors.bodyTextColor,
            lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
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
            marginBottom: theme.sizes.marginBottom_10,
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
                      ...theme.fonts.SourceSansPro_Regular_12,
                      lineHeight:
                        theme.fonts.SourceSansPro_Regular_12.fontSize * 1.4,
                      fontSize: 12,
                    }}
                  >
                    {item.number}
                  </Text>
                  <Text
                    style={{
                      ...theme.fonts.SourceSansPro_Regular_14,
                      lineHeight:
                        theme.fonts.SourceSansPro_Regular_14.fontSize * 1.4,
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
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: theme.sizes.marginBottom_10,
          }}
        >
          <components.InputField
            label='Amount'
            dollarIcon={true}
            placeholder='Amount'
          />
        </View>
        <View
          style={{
            backgroundColor: theme.colors.white,
            borderRadius: 10,
            height: responsiveHeight(14),
            borderWidth: 1,
            borderColor: '#FFEFE6',
            paddingHorizontal: 20,
            paddingVertical: 14,
            marginBottom: theme.sizes.marginBottom_10,
            marginHorizontal: 20,
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
        <Text
          style={{
            marginLeft: 20,
            ...theme.fonts.SourceSansPro_Regular_14,
            color: theme.colors.bodyTextColor,
          }}
        >
          Bank fee: 0.20 USD
        </Text>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView style={{flexGrow: 1}} enableOnAndroid={true}>
        {renderSendMoney()}
        {renderUseCard()}
      </KeyboardAwareScrollView>
    );
  };

  const renderButton = () => {
    return (
      <components.Button
        title='Send'
        containerStyle={{margin: 20}}
        onPress={() => {
          navigation.navigate('PaymentSuccess');
          // navigation.navigate('PaymentFailed');
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

export default FundTransfer;
