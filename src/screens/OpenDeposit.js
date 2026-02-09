import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import ParsedText from 'react-native-parsed-text';

import {components} from '../components';
import {theme} from '../constants';

const period = [
  {
    id: 1,
    period: '3 mos',
  },
  {
    id: 2,
    period: '6 mos',
  },
  {
    id: 3,
    period: '12 mos',
  },
  {
    id: 4,
    period: '18 mos',
  },
  {
    id: 5,
    period: '24 mos',
  },
  {
    id: 6,
    period: '36 mos',
  },
];

const cards = [
  {
    id: 1,
    number: '**** **** **** 1234',
    balance: '4863.27',
  },
  {
    id: 2,
    number: '**** **** **** 1234',
    balance: '4863.27',
  },
];

const OpenDeposit = ({navigation}) => {
  const [currency, setCurrency] = useState('USD');
  const [depositPeriod, setDepositPeriod] = useState('3 mos');
  const [switchValue, setSwitchValue] = useState(false);
  const [card, setCard] = useState(cards[0]);

  const renderHeader = () => {
    return (
      <components.Header
        goBack={true}
        title='Open deposit'
        containerStyle={{}}
      />
    );
  };

  const renderCurrency = () => {
    return (
      <View
        style={{
          marginTop: theme.sizes.marginTop_10,
          marginBottom: theme.sizes.marginBottom_14,
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_14,
            marginBottom: theme.sizes.marginBottom_10,
            lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
            color: theme.colors.bodyTextColor,
          }}
        >
          Choose currency
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            style={{
              height: 30,
              width: '48%',
              backgroundColor:
                currency === 'USD' ? theme.colors.mainDark : theme.colors.white,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 6,
              borderWidth: 1,
              borderColor: theme.colors.mainDark,
            }}
            onPress={() => setCurrency('USD')}
          >
            <Text
              style={{
                ...theme.fonts.SourceSansPro_Regular_14,
                color:
                  currency === 'USD'
                    ? theme.colors.white
                    : theme.colors.mainDark,
              }}
            >
              USD
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 30,
              width: '48%',
              backgroundColor:
                currency === 'EUR' ? theme.colors.mainDark : theme.colors.white,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 6,
              borderWidth: 1,
              borderColor: theme.colors.mainDark,
            }}
            onPress={() => setCurrency('EUR')}
          >
            <Text
              style={{
                ...theme.fonts.SourceSansPro_Regular_14,
                color:
                  currency === 'EUR'
                    ? theme.colors.white
                    : theme.colors.mainDark,
              }}
            >
              EUR
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingTop: 15, paddingBottom: 20}}
      >
        <View style={{paddingHorizontal: 20}}>
          <Text
            style={{
              ...theme.fonts.SourceSansPro_Regular_14,
              marginBottom: theme.sizes.marginBottom_10,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              color: theme.colors.bodyTextColor,
            }}
          >
            Choose deposit period
          </Text>
          <View style={{flexDirection: 'row', marginBottom: 30}}>
            <View
              style={{
                width: '33%',
                backgroundColor: '#FFF7F2',
                height: 110,
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}
            >
              <ParsedText
                style={{
                  ...theme.fonts.SourceSansPro_Regular_12,
                  color: theme.colors.mainColor,
                  textAlign: 'center',
                }}
                parse={[
                  {
                    pattern: /8 %/,
                    style: {
                      ...theme.fonts.SourceSansPro_Regular_24,
                    },
                  },
                ]}
              >
                {'You rate \n 8 %'}
              </ParsedText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                flex: 1,
                height: 110,
                alignContent: 'space-between',
              }}
            >
              {period.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      width: '48%',
                      height: 30,
                      backgroundColor:
                        depositPeriod === item.period
                          ? theme.colors.mainDark
                          : theme.colors.white,
                      borderWidth: 1,
                      borderRadius: 6,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => setDepositPeriod(item.period)}
                  >
                    <Text
                      style={{
                        color:
                          depositPeriod === item.period
                            ? theme.colors.white
                            : theme.colors.mainDark,
                        ...theme.fonts.SourceSansPro_Regular_14,
                        fontSize: 14,
                        lineHeight: 14 * 1.6,
                      }}
                    >
                      {item.period}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
        <View style={{marginBottom: 30, paddingHorizontal: 20}}>
          <Text
            style={{
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              marginBottom: theme.sizes.marginBottom_10,
              color: theme.colors.bodyTextColor,
            }}
          >
            Amount
          </Text>
          <components.InputField dollarIcon={true} placeholder='1000' />
        </View>
        <View style={{marginBottom: 30}}>
          <View style={{marginLeft: 20}}>
            <Text
              style={{
                ...theme.fonts.SourceSansPro_Regular_14,
                lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                marginBottom: theme.sizes.marginBottom_10,
                color: theme.colors.bodyTextColor,
              }}
            >
              Use card
            </Text>
          </View>
          <ScrollView
            horizontal={true}
            contentContainerStyle={{paddingLeft: 20}}
            showsHorizontalScrollIndicator={false}
          >
            {cards.map((item, index, array) => {
              const last = index === array.length - 1;

              const bg1 = require('../assets/cards/01.png');
              const bg2 = require('../assets/cards/02.png');

              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    width: 336,
                    borderWidth: 1,
                    padding: 12,
                    borderRadius: 10,
                    marginRight: last ? 20 : 14,
                    backgroundColor: theme.colors.white,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderColor:
                      item.id === card.id ? theme.colors.mainColor : '#FFEFE6',
                  }}
                  onPress={() => setCard(item)}
                >
                  <components.ImageBackground
                    source={item.id === 1 ? bg1 : bg2}
                    style={{
                      width: 62,
                      height: 42,
                      paddingHorizontal: 6,
                      paddingVertical: 8,
                      marginRight: 12,
                    }}
                    imageStyle={{borderRadius: 6}}
                  >
                    <Text
                      style={{
                        fontSize: 8,
                        lineHeight: 8 * 1.2,
                      }}
                    >
                      {item.id === 1 && 'Card 1'}
                      {item.id === 2 && 'Card 2'}
                    </Text>
                  </components.ImageBackground>
                  <View>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_12,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      {item.number}
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {item.balance} USD
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              color: theme.colors.mainDark,
            }}
          >
            Early deposit withdrawal
          </Text>
          <TouchableOpacity
            style={{
              width: 40,
              height: 24,
              backgroundColor: '#55ACEE',
              borderRadius: 20,
              justifyContent: 'center',
              paddingHorizontal: 2,
              alignItems: switchValue ? 'flex-end' : 'flex-start',
            }}
            onPress={() => setSwitchValue(!switchValue)}
          >
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: theme.colors.white,
                borderRadius: 10,
              }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderFooter = () => {
    return (
      <View style={{padding: 20}}>
        <TouchableOpacity
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.mainDark,
            height: 40,
            borderRadius: 10,
          }}
          onPress={() => navigation.navigate('TabNavigator')}
        >
          <Text
            style={{
              color: theme.colors.white,
              ...theme.fonts.SourceSansPro_SemiBold_16,
              textTransform: 'capitalize',
            }}
          >
            Open deposit
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <components.SafeAreaView>
      {renderHeader()}
      {renderCurrency()}
      {renderContent()}
      {renderFooter()}
    </components.SafeAreaView>
  );
};

export default OpenDeposit;
