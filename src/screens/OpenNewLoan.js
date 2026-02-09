import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import ParsedText from 'react-native-parsed-text';

import {components} from '../components';
import {theme} from '../constants';
import {svg} from '../assets/svg';

const period = [
  {
    id: 1,
    period: '3 mos',
    rate: '13 %',
  },
  {
    id: 2,
    period: '6 mos',
    rate: '12 %',
  },
  {
    id: 3,
    period: '12 mos',
    rate: '11 %',
  },
  {
    id: 4,
    period: '18 mos',
    rate: '10 %',
  },
  {
    id: 5,
    period: '24 mos',
    rate: '9 %',
  },
  {
    id: 6,
    period: '36 mos',
    rate: '8 %',
  },
];

const OpenNewLoan = ({navigation}) => {
  const [currency, setCurrency] = useState('USD');
  const [loanPeriod, setLoanPeriod] = useState('3 mos');
  const [switchValue, setSwitchValue] = useState(false);

  const renderHeader = () => {
    return (
      <components.Header
        goBack={true}
        title='Open new loan'
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
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 15,
          paddingBottom: 20,
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
          Choose loan period
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
                  pattern: /13 %/,
                  style: {
                    ...theme.fonts.SourceSansPro_Regular_24,
                  },
                },
              ]}
            >
              {'You rate \n 13 %'}
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
                      loanPeriod === item.period
                        ? theme.colors.mainDark
                        : theme.colors.white,
                    borderWidth: 1,
                    borderRadius: 6,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => setLoanPeriod(item.period)}
                >
                  <Text
                    style={{
                      color:
                        loanPeriod === item.period
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
        <components.InputField
          dollarIcon={true}
          placeholder='25 000.00'
          containerStyle={{
            marginBottom: theme.sizes.marginBottom_30,
          }}
        />
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_14,
            lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
            color: theme.colors.bodyTextColor,
            marginBottom: theme.sizes.marginBottom_10,
          }}
        >
          Calculated monthly repayment
        </Text>
        <View
          style={{
            height: 50,
            backgroundColor: theme.colors.white,
            borderColor: '#FFEFE6',
            borderWidth: 1,
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 10,
            alignItems: 'center',
            flexDirection: 'row',
            marginBottom: theme.sizes.marginBottom_30,
          }}
        >
          <svg.DollarSignSvg />
          <Text
            style={{
              marginLeft: 14,
              ...theme.fonts.SourceSansPro_Regular_16,
              color: theme.colors.mainDark,
            }}
          >
            1 117.00
          </Text>
        </View>
        <View
          style={{
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
            Early loan repayment
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

export default OpenNewLoan;
