// src/screens/CRM.js
import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native'; 

const operations = [
  {
    id: 1,
    icon: require('../assets/icons/exchange.png'),
    title: 'Accounts',
  },
  {
    id: 2,
    icon: require('../assets/icons/basket.png'),
    title: 'Activity',
  },
  {
    id: 3,
    icon: require('../assets/icons/electricity.png'),
    title: 'Analysis',
  },
  {
    id: 4,
    icon: require('../assets/icons/coffee.png'),
    title: 'Appoinment',
  },
  {
    id: 5,
    icon: require('../assets/icons/plus.png'),
    title: 'Attendance',
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

      <View style={{marginTop: 20}}>
        {operations
          .reduce((rows, item, index, array) => {
            if (index % 2 === 0) {
              rows.push(array.slice(index, index + 2));
            }
            return rows;
          }, [])
          .map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6, 
              }}
            >
              {row.map((item, index) => (
                <TouchableOpacity
                  key={item.id} 
                  style={{
                    width: '48%',
                    paddingHorizontal: 10,
                    paddingVertical: 12,
                    backgroundColor: '#FFF7F2',
                    borderRadius: 10,
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
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
      </View>
    </ScrollView>
  );
};

const CRM = () => {
  const theme = {}; 
  const navigation = useNavigation(); 

  return (
    <View style={{flex: 1, backgroundColor: '#222222'}}>
      <TouchableOpacity
        style={{
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
        }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{fontSize: 24, marginRight: 8, color: '#ffffff'}}>←</Text>
      </TouchableOpacity>

      {renderContent(theme, navigation)}
    </View>
  );
};

export default CRM;
