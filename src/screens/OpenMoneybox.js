import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {responsiveWidth} from 'react-native-responsive-dimensions';

import {components} from '../components';
import {theme} from '../constants';

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

const OpenMoneybox = ({navigation}) => {
  const [card, setCard] = useState(cards[0]);
  const [roundingUp, setRoundingUp] = useState(null);

  const renderHeader = () => {
    return <components.Header goBack={true} title='Open moneybox' />;
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingTop: 10, paddingBottom: 20}}
      >
        <View style={{paddingHorizontal: 20, marginBottom: 30}}>
          <Text
            style={{
              marginBottom: theme.sizes.marginBottom_10,
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              color: theme.colors.bodyTextColor,
            }}
          >
            The amount you want to achieve
          </Text>
          <components.InputField
            placeholder='1 200.00'
            containerStyle={{
              marginBottom: theme.sizes.marginBottom_10,
            }}
            dollarIcon={true}
          />
          <components.InputField
            placeholder='Enter your goal'
            editIcon={true}
          />
        </View>
        <View style={{marginBottom: 30}}>
          <View style={{paddingHorizontal: 20}}>
            <Text
              style={{
                marginBottom: theme.sizes.marginBottom_10,
                ...theme.fonts.SourceSansPro_Regular_14,
                lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
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
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: theme.colors.white,
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
            marginBottom: theme.sizes.marginBottom_10,
          }}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderWidth: 1,
              borderColor: theme.colors.bodyTextColor,
              borderRadius: 18 / 2,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginRight: 12,
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                backgroundColor: '#55ACEE',
                borderRadius: 10 / 2,
              }}
            />
          </View>
          <Text
            style={{
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              color: theme.colors.bodyTextColor,
            }}
          >
            Amount per day
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: theme.sizes.marginBottom_17,
          }}
        >
          <components.InputField placeholder='10.00' dollarIcon={true} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            style={{
              width: responsiveWidth(42),
              padding: 16,
              borderRadius: 10,
              borderWidth: 1,
              backgroundColor: theme.colors.white,
              borderColor: '#FFEFE6',
            }}
            onPress={() => setRoundingUp('$1')}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderWidth: 1,
                borderColor: theme.colors.bodyTextColor,
                borderRadius: 18 / 2,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginRight: 12,
                marginBottom: theme.sizes.marginBottom_8,
              }}
            >
              {roundingUp === '$1' && (
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
            <Text
              style={{
                ...theme.fonts.SourceSansPro_Regular_14,
                lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                color: theme.colors.mainDark,
              }}
            >
              Rounding up to $1 per transaction.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: responsiveWidth(42),
              padding: 16,
              borderRadius: 10,
              borderWidth: 1,
              backgroundColor: theme.colors.white,
              borderColor: '#FFEFE6',
            }}
            onPress={() => setRoundingUp('$10')}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderWidth: 1,
                borderColor: theme.colors.bodyTextColor,
                borderRadius: 18 / 2,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginRight: 12,
                marginBottom: theme.sizes.marginBottom_8,
              }}
            >
              {roundingUp === '$10' && (
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
            <Text
              style={{
                ...theme.fonts.SourceSansPro_Regular_14,
                lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                color: theme.colors.mainDark,
              }}
            >
              Rounding up to $10 per transaction.
            </Text>
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
            Open Moneybox
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <components.SafeAreaView background={true}>
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
    </components.SafeAreaView>
  );
};

export default OpenMoneybox;
