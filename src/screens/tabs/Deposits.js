import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import ParsedText from 'react-native-parsed-text';

import {theme} from '../../constants';
import {svg} from '../../assets/svg';
import {useTheme} from '../../constants/ThemeContext';

const currentDeposits = [
  {
    id: 1,
    type: 'Withdrawal →',
    amount: 1712.78,
    date: 'Jan 1 - Apr 1, 2023',
    status: 'completed',
    currency: 'USD',
  },
  {
    id: 2,
    type: 'Top - up  →',
    amount: 3648.37,
    date: 'Jan 1 - Apr 1, 2023',
    status: 'processing',
    currency: 'USD',
  },
];

const currentMoneyboxes = [
  {
    id: 1,
    amount: 650.37,
    moneybox: 'New iPhone Pro Max',
    goal: 1200,
    currency: 'USD',
  },
];

const Deposits = () => {
  const navigation = useNavigation();
  const {theme, toggleTheme} = useTheme();

  const renderHeader = () => {
    return (
      <View style={{paddingHorizontal: 20}}>
        <Text
          style={{
            color: theme === 'dark' ? '#fff' : '#000',
            marginTop: 20,
            fontSize: 24,
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
          }}
        >
          Deposits
        </Text>
      </View>
    );
  };

  const renderMoneyboxes = () => {
    return (
      <View>
        <Text
          style={{
            color: theme === 'dark' ? '#fff' : '#000',
            fontSize: 16,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          Current moneyboxes
        </Text>
        {currentMoneyboxes.map((item, index, array) => {
          const last = array.length === index + 1;

          return (
            <TouchableOpacity
              key={index}
              style={{
                width: '100%',
                paddingVertical: 17,
                paddingHorizontal: 14,
                backgroundColor: '#21AFF0',
                borderRadius: 10,
                marginBottom: last ? 0 : 6,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View style={{marginRight: 8}}>
                <svg.PiggyBankSvg />
              </View>
              <View style={{flex: 1}}>
                <ParsedText
                  style={{
                    color: theme === 'dark' ? '#fff' : '#000',
                  }}
                  parse={[
                    {
                      pattern: /USD/,
                      style: {
                        color: theme === 'dark' ? '#fff' : '#000',
                      },
                    },
                  ]}
                >
                  {item.amount + ' ' + item.currency}
                </ParsedText>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={
                      {
                        color: theme === 'dark' ? '#fff' : '#000',
                      }
                    }
                    numberOfLines={1}
                  >
                    {item.moneybox}
                  </Text>
                  <Text
                    style={
                      {
                        color: theme === 'dark' ? '#fff' : '#000',
                      }
                    }
                  >
                    Goal: ${item.goal}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderDeposits = () => {
    return (
      <View
      >
        <Text
          style={{
            color: theme === 'dark' ? '#fff' : '#000',
            fontSize: 16,
            marginTop: 18,
            marginBottom: 10,
          }}
        >
          Current deposits
        </Text>
        {currentDeposits.map((item, index, array) => {
          const last = array.length === index + 1;

          return (
            <TouchableOpacity
              key={index}
              style={{
                width: '100%',
                paddingVertical: 17,
                paddingHorizontal: 14,
                backgroundColor: '#21AFF0',
                borderRadius: 10,
                marginBottom: last ? 0 : 6,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {item.status === 'completed' && (
                <View style={{marginRight: 8}}>
                  <svg.CompletedSvg />
                </View>
              )}
              {item.status === 'processing' && (
                <View style={{marginRight: 8}}>
                  <svg.ProcessingSvg />
                </View>
              )}
              <View style={{marginRight: 'auto'}}>
                <ParsedText
                  style={
                    {
                      color: theme === 'dark' ? '#fff' : '#000',
                    }
                  }
                  parse={[
                    {
                      pattern: /USD/,
                      style: {
                        color: theme === 'dark' ? '#fff' : '#000',
                      },
                    },
                  ]}
                >
                  {item.amount + ' ' + item.currency}
                </ParsedText>
                <Text
                  style={
                    {
                      color: theme === 'dark' ? '#fff' : '#000',
                    }
                  }
                  numberOfLines={1}
                >
                  {item.date}
                </Text>
              </View>
              <Text
                style={
                  {
                    color: theme === 'dark' ? '#fff' : '#000',
                  }
                }
              >
                {item.type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1, paddingHorizontal: 20,}}>
        {renderDeposits()}
        {renderMoneyboxes()}
        {renderFooter()}
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
          marginTop:40,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: '#21AFF0',
            width: '48%',
            height: 40,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('OpenMoneybox')}
        >
          <Text
            style={{
             color: theme === 'dark' ? '#fff' : '#000',
              textTransform: 'capitalize',
            }}
          >
            + moneybox
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '48%',
            height: 40,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFD9C3',
          }}
          onPress={() => navigation.navigate('OpenDeposit')}
        >
          <Text
            style={{
              color: theme === 'dark' ? '#fff' : '#000',
              textTransform: 'capitalize',
            }}
          >
            + Deposit
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={{flex: 1, backgroundColor: theme === 'dark' ? '#333' : '#fff'}}
    >
      {renderHeader()}
      {renderContent()}
    </View>
  );
};

export default Deposits;
