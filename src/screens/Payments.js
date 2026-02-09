import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React from 'react';
import FitImage from 'react-native-fit-image';
import {responsiveHeight} from 'react-native-responsive-dimensions';

import {components} from '../components';
import {svg} from '../assets/svg';
import {theme} from '../constants';
import Clock from './Clock';
import AnalogClock from './AnalogClock';

const paymentsList = [
  {
    id: 1,
    title: 'Money transfer',
    icon: require('../assets/icons/dollar.png'),
  },
  {
    id: 2,
    title: 'Mobile payment',
    icon: require('../assets/icons/mobile-payment.png'),
  },
  {
    id: 3,
    title: 'IBAN payment',
    icon: require('../assets/icons/paycheck.png'),
  },
  {
    id: 4,
    title: 'Utility bills',
    icon: require('../assets/icons/car.png'),
  },
  {
    id: 5,
    title: 'Transport',
    icon: require('../assets/icons/dollar.png'),
  },
  {
    id: 6,
    title: 'Insurance',
    icon: require('../assets/icons/dollar.png'),
  },
  {
    id: 7,
    title: 'Penalties',
    icon: require('../assets/icons/yellow-card.png'),
  },
  {
    id: 8,
    title: 'Charity',
    icon: require('../assets/icons/charity.png'),
  },
];

const Payments = ({navigation}) => {
  const renderHeader = () => {
    return <components.Header title='Payments' goBack={true} />;
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingBottom: 20,
          paddingTop: 10,
        }}
      >
        {paymentsList.map((item, index, array) => {
          const last = index === array.length - 1;

          return (
            <TouchableOpacity
              key={index}
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: last ? 0 : responsiveHeight(1.8),
              }}
              onPress={() => {
                item.title === 'Mobile payment' &&
                  navigation.navigate('MobilePayment');
                item.title === 'Money transfer' &&
                  navigation.navigate('FundTransfer');
                item.title === 'IBAN payment' &&
                  navigation.navigate('IBANPayment');
              }}
            >
              <components.Image
                source={item.icon}
                style={{
                  width: responsiveHeight(4.4),
                  aspectRatio: 1,
                }}
              />
              <Text
                style={{
                  marginRight: 'auto',
                  marginLeft: 14,
                  ...theme.fonts.SourceSansPro_Regular_14,
                  lineHeight:
                    theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                  color: theme.colors.mainDark,
                }}
              >
                {item.title}
              </Text>
              <svg.InfoSvg />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <components.SafeAreaView>
      {renderHeader()}
      {renderContent()}
      {<AnalogClock />}
      {<Clock />}
    </components.SafeAreaView>
  );
};

export default Payments;
