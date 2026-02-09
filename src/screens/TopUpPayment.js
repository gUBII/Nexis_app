import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import {components} from '../components';
import {theme} from '../constants';

const cards = [
  {
    id: 1,
    number: '**** **** **** 8456',
    curency: 'EUR',
    balance: '2 156.35',
    icon: require('../assets/cards/01.png'),
  },
];

const methods = [
  {
    id: 1,
    title: 'Card from another bank',
    icon: require('../assets/icons/credit-card2.png'),
  },
  {
    id: 2,
    title: 'SEPA',
    icon: require('../assets/icons/sepa.png'),
  },
  {
    id: 3,
    title: 'Western Union',
    icon: require('../assets/icons/western-union.png'),
  },
  {
    id: 4,
    title: 'Paypal',
    icon: require('../assets/icons/pay-pal.png'),
  },
  {
    id: 5,
    title: 'Payoneer',
    icon: require('../assets/icons/payoneer.png'),
  },
];

const TopUpPayment = () => {
  const renderHeader = () => {
    return <components.Header title='Top-Up payment' goBack={true} />;
  };

  const renderCards = () => {
    return (
      <View style={{marginBottom: theme.sizes.marginBottom_30}}>
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_14,
            lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
            color: theme.colors.bodyTextColor,
            marginBottom: theme.sizes.marginBottom_10,
          }}
        >
          TopUpPayment
        </Text>
        {cards.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                padding: 12,
                backgroundColor: '#FFF7F2',
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <components.Image
                source={require('../assets/cards/02.png')}
                style={{
                  width: 62,
                  height: 42,
                  marginRight: 12,
                }}
              />
              <View>
                <Text
                  style={{
                    ...theme.fonts.SourceSansPro_Regular_12,
                    color: theme.colors.bodyTextColor,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_12.fontSize * 1.4,
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
                  {item.balance} {item.curency}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderEntrepreneurAccounts = () => {
    return (
      <View style={{marginBottom: theme.sizes.marginBottom_30}}>
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_14,
            color: theme.colors.bodyTextColor,
            lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
            marginBottom: theme.sizes.marginBottom_10,
          }}
        >
          Entrepreneur accounts
        </Text>
        <View
          style={{
            backgroundColor: '#FFF7F2',
            borderRadius: 10,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <components.Image
            source={require('../assets/icons/enterpreneur-acc.png')}
            style={{
              width: 62,
              height: 42,
              marginRight: 12,
            }}
          />
          <View>
            <Text
              style={{
                ...theme.fonts.SourceSansPro_Regular_12,
                lineHeight: theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
                color: theme.colors.bodyTextColor,
              }}
            >
              US**********************4571
            </Text>
            <Text
              style={{
                ...theme.fonts.SourceSansPro_Regular_14,
                lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              }}
            >
              39 863.62 USD
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderMethods = () => {
    return (
      <View>
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_14,
            color: theme.colors.bodyTextColor,
            lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
            marginBottom: theme.sizes.marginBottom_10,
          }}
        >
          Other methods
        </Text>
        {methods.map((item, index, array) => {
          const lastElement = index === array.length - 1;

          return (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: lastElement ? 0 : theme.sizes.marginBottom_20,
              }}
            >
              <components.Image
                source={item.icon}
                style={{
                  width: responsiveWidth(9),
                  aspectRatio: 1,
                  marginRight: 14,
                }}
              />
              <Text
                style={{
                  ...theme.fonts.SourceSansPro_Regular_14,
                  lineHeight:
                    theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                  color: theme.colors.mainDark,
                }}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: theme.sizes.paddingTop_10,
        }}
      >
        {renderCards()}
        {renderEntrepreneurAccounts()}
        {renderMethods()}
      </ScrollView>
    );
  };

  return (
    <components.SafeAreaView>
      {renderHeader()}
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default TopUpPayment;
