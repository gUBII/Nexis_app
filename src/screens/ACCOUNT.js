// src/screens/ACCOUNT.js
import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native'; 

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

const renderContent = (theme, navigation) => {
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 20,
      }}
    >
      {/* Date and Calendar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            marginRight: 10,
          }}
        >
          Sep 1 - Sep 20, 2022
        </Text>
        {/* Replace with your calendar icon */}
        <Text>📅</Text>
      </View>

      {/* Bar Graph */}
      <View
        style={{
          width: '100%',
          height: 90,
          borderWidth: 1,
          borderColor: '#FFEFE6',
          borderRadius: 10,
          padding: 20,
          flexDirection: 'row',
          alignItems: 'flex-end',
          marginBottom: 20,
        }}
      >
        {['100%', '80%', '60%', '40%', '20%'].map((height, index) => (
          <View
            key={index}
            style={{
              height,
              width: 30,

              borderRadius: 3,
              marginRight: 10,
            }}
          />
        ))}
      </View>

      {/* Operations */}
      <View>
        {operations.map((item, index, array) => {
          const last = index === array.length - 1;

          return (
            <TouchableOpacity
              key={index}
              style={{
                width: '100%',
                paddingHorizontal: 10,
                paddingVertical: 12, 
                backgroundColor: '#FFF7F2',
                borderRadius: 10,
                marginBottom: last ? 0 : 6,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => navigation.navigate('TransactionDetails')}
            >
              <Image
                source={item.icon}
                style={{
                  width: 46,
                  height: 46,
                  marginRight: 14,
                }}
              />
              <View style={{marginRight: 'auto'}}>
                <Text numberOfLines={1}>{item.title}</Text>
                <Text>{item.subtitle}</Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text>{item.amount}</Text>
                <Text>{item.percent}%</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const ACCOUNT = () => {
  const theme = {}; 
  const navigation = useNavigation(); 

  return <View style={{flex: 1}}>{renderContent(theme, navigation)}</View>;
};

export default ACCOUNT;
