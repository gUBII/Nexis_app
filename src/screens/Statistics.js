import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ParsedText from 'react-native-parsed-text';

import {components} from '../components';
import {theme} from '../constants';
import {svg} from '../assets/svg';

const operations = [
  {
    id: 1,
    icon: require('../assets/icons/exchange.png'),
    title: 'Money transfer',
    subtitle: '36 transactions',
    amount: '- 7923.52',
    percent: '68',
  },
  {
    id: 2,
    icon: require('../assets/icons/basket.png'),
    title: 'Food products',
    subtitle: '18 transactions',
    amount: '- 1398.27',
    percent: '12',
  },
  {
    id: 3,
    icon: require('../assets/icons/electricity.png'),
    title: 'Utility bills',
    subtitle: '6 transactions',
    amount: '- 466.09',
    percent: '8',
  },
  {
    id: 4,
    icon: require('../assets/icons/coffee.png'),
    title: 'Cafe and restaurants',
    subtitle: '4 transactions',
    amount: '- 332.18',
    percent: '6',
  },
  {
    id: 5,
    icon: require('../assets/icons/plus.png'),
    title: 'Medical supplies',
    subtitle: '2 transactions',
    amount: '- 76.09',
    percent: '4',
  },
];

const cards = [
  {
    id: 1,
    icon: require('../assets/cards/01.png'),
    number: '**** **** **** 7833',
    balance: '4 863.27',
    currency: 'USD',
  },
  {
    id: 2,
    icon: require('../assets/cards/02.png'),
    number: '**** **** **** 0936',
    balance: '2 156.35',
    currency: 'EUR',
  },
];

const Statistics = ({navigation}) => {
  const [type, setType] = useState('expenses');
  const [cardModal, setCardModal] = useState(false);
  const [card, setCard] = useState(cards[0]);

  const insets = useSafeAreaInsets();
  const homeIndicatorHeight = insets.bottom;

  const homeIndicatorSettings = () => {
    if (homeIndicatorHeight !== 0) {
      return homeIndicatorHeight;
    }
    if (homeIndicatorHeight === 0) {
      return 20;
    }
  };

  const renderHeader = () => {
    return <components.Header goBack={true} title='Statistics' />;
  };

  const renderType = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          marginTop: theme.sizes.marginTop_10,
          marginBottom: theme.sizes.marginBottom_30,
        }}
      >
        <TouchableOpacity
          style={{
            width: responsiveWidth(48) - 20,
            height: 28,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            backgroundColor:
              type === 'expenses' ? theme.colors.mainDark : '#FFF6F2',
          }}
          onPress={() => setType('expenses')}
        >
          <Text
            style={{
              color:
                type === 'expenses'
                  ? theme.colors.white
                  : theme.colors.mainDark,
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              textTransform: 'capitalize',
            }}
          >
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: responsiveWidth(48) - 20,
            height: 28,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            backgroundColor:
              type === 'income' ? theme.colors.mainDark : '#FFF6F2',
          }}
          onPress={() => setType('income')}
        >
          <Text
            style={{
              color:
                type === 'income' ? theme.colors.white : theme.colors.mainDark,
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              textTransform: 'capitalize',
            }}
          >
            Statistics
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCurrentCard = () => {
    return (
      <TouchableOpacity
        style={{
          width: '100%',
          borderWidth: 1,
          borderColor: '#FFEFE6',
          borderRadius: 10,
          padding: 12,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: theme.sizes.marginBottom_30,
        }}
        onPress={() => setCardModal(true)}
      >
        <components.Image
          source={card.icon}
          style={{
            width: 62,
            height: 42,
            marginRight: 12,
          }}
        />
        <View style={{marginRight: 'auto'}}>
          <Text
            style={{
              ...theme.fonts.SourceSansPro_Regular_12,
              lineHeight: theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
              color: theme.colors.bodyTextColor,
            }}
          >
            {card.number}
          </Text>
          <Text
            style={{
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              color: theme.colors.mainDark,
            }}
          >
            {card.balance} {card.currency}
          </Text>
        </View>
        <View style={{paddingHorizontal: 8}}>
          <svg.VerticalMenuSvg />
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingBottom: theme.sizes.paddingBottom_20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.sizes.marginBottom_14,
          }}
        >
          <Text
            style={{
              marginRight: 10,
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              color: theme.colors.bodyTextColor,
            }}
          >
            Sep 1 - Sep 20, 2022
          </Text>
          <svg.StatCalendarSvg />
        </View>
        {card && renderCurrentCard()}
        <View
          style={{
            width: '100%',
            height: responsiveHeight(15),
            borderWidth: 1,
            borderColor: '#FFEFE6',
            borderRadius: 10,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'flex-end',
            marginBottom: responsiveHeight(2.4),
          }}
        >
          <View
            style={{
              height: '100%',
              width: responsiveWidth(10),
              backgroundColor: theme.colors.mainDark,
              borderRadius: 3,
              marginRight: 10,
            }}
          />
          <View
            style={{
              height: '80%',
              width: responsiveWidth(10),
              backgroundColor: '#4F4F66',
              borderRadius: 3,
              marginRight: 10,
            }}
          />
          <View
            style={{
              height: '60%',
              width: responsiveWidth(10),
              backgroundColor: '#818192',
              borderRadius: 3,
              marginRight: 10,
            }}
          />
          <View
            style={{
              height: '40%',
              width: responsiveWidth(10),
              backgroundColor: '#B4B3BE',
              borderRadius: 3,
              marginRight: 10,
            }}
          />
          <View
            style={{
              height: '20%',
              width: responsiveWidth(10),
              backgroundColor: '#CDCDD3',
              borderRadius: 3,
              marginRight: 10,
            }}
          />
          <View style={{position: 'absolute', right: 20, top: 10}}>
            <ParsedText
              style={{
                ...theme.fonts.SourceSansPro_Regular_28,
                color: theme.colors.mainDark,
              }}
              parse={[
                {
                  pattern: /24/,
                  style: {
                    ...theme.fonts.SourceSansPro_Regular_18,
                    color: theme.colors.mainDark,
                  },
                },
              ]}
            >
              - 11 654.24
            </ParsedText>
          </View>
          <View style={{position: 'absolute', right: 20, bottom: 20}}>
            <Text
              style={{
                ...theme.fonts.SourceSansPro_Regular_16,
                lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                marginBottom: -4,
                color: theme.colors.mainDark,
              }}
            >
              USD
            </Text>
          </View>
        </View>
        <View>
          {operations.map((item, index, array) => {
            const last = index === array.length - 1;

            return (
              <TouchableOpacity
                key={index}
                style={{
                  width: '100%',
                  paddingHorizontal: 10,
                  paddingVertical: responsiveHeight(1.6),
                  backgroundColor: '#FFF7F2',
                  borderRadius: 10,
                  marginBottom: last ? 0 : 6,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  navigation.navigate('TransactionDetails');
                }}
              >
                <components.Image
                  source={item.icon}
                  style={{
                    width: responsiveHeight(4.6),
                    aspectRatio: 1,
                    marginRight: 14,
                  }}
                />
                <View style={{marginRight: 'auto'}}>
                  <Text
                    style={{
                      ...theme.fonts.SourceSansPro_Regular_14,
                      lineHeight:
                        theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                      color: theme.colors.mainDark,
                    }}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      ...theme.fonts.SourceSansPro_Regular_12,
                      color: theme.colors.bodyTextColor,
                      lineHeight:
                        theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
                    }}
                  >
                    {item.subtitle}
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: 'flex-end',
                  }}
                >
                  <Text
                    style={{
                      ...theme.fonts.SourceSansPro_Regular_14,
                      lineHeight:
                        theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                      color: theme.colors.mainDark,
                    }}
                  >
                    {item.amount}
                  </Text>
                  <Text
                    style={{
                      ...theme.fonts.SourceSansPro_Regular_12,
                      lineHeight:
                        theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
                      color: theme.colors.bodyTextColor,
                    }}
                  >
                    {item.percent}%
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const renderCardModal = () => {
    return (
      <Modal
        isVisible={cardModal}
        onBackdropPress={() => setCardModal(false)}
        hideModalContentWhileAnimating={true}
        backdropTransitionOutTiming={0}
        style={{
          margin: 20,
          justifyContent: 'flex-end',
          marginBottom: homeIndicatorSettings(),
        }}
        animationIn='fadeInUp'
        animationOut='fadeOutDown'
      >
        <View
          style={{
            backgroundColor: '#FFF7F2',
            paddingHorizontal: 20,
            paddingTop: 30,
            paddingBottom: 20,
            borderRadius: 14,
          }}
        >
          <Text
            style={{
              ...theme.fonts.H4,
              color: theme.colors.mainDark,
              marginBottom: responsiveHeight(1.8),
            }}
          >
            Choose card
          </Text>
          {cards.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  width: '100%',
                  height: 66,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: '#FFEFE6',
                  marginBottom: responsiveHeight(1),
                  backgroundColor: theme.colors.white,
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                }}
                onPress={() => {
                  setCard(item);
                  setCardModal(false);
                }}
              >
                <components.Image
                  source={item.icon}
                  style={{
                    width: 62,
                    height: 42,
                    marginRight: 12,
                  }}
                />
                <View style={{marginRight: 'auto'}}>
                  <Text
                    style={{
                      ...theme.fonts.SourceSansPro_Regular,
                      fontSize: responsiveFontSize(1.6),
                      color: theme.colors.bodyTextColor,
                      lineHeight: responsiveFontSize(1.6) * 1.6,
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
                    {item.balance} {item.currency === 'USD' && 'USD'}{' '}
                    {item.currency === 'EUR' && 'EUR'}
                  </Text>
                </View>
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderWidth: 1,
                    borderRadius: 18 / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: theme.colors.bodyTextColor,
                  }}
                >
                  {card.id === item.id && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: '#55ACEE',
                        borderRadius: 10 / 2,
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
          <components.Button
            onPress={() => setCardModal(false)}
            title='Show statistics'
            containerStyle={{
              marginTop: responsiveHeight(1.4),
            }}
          />
        </View>
      </Modal>
    );
  };

  return (
    <components.SafeAreaView>
      {renderHeader()}
      {renderType()}
      {renderContent()}
      {renderCardModal()}
    </components.SafeAreaView>
  );
};

export default Statistics;
