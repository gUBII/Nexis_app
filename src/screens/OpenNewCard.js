import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  Text,
  Modal,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Checkbox, Button, IconButton} from 'react-native-paper';
import React, {useState} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {components} from '../components';
import {theme} from '../constants';

const cards = [
  'https://george-fx.github.io/apitex/cards/01.jpg',
  'https://george-fx.github.io/apitex/cards/02.jpg',
];

const OpenNewCard = ({navigation}) => {
  const [type, setType] = useState('debet');
  const [currency, setCurrency] = useState('USD');
  const [paymentSystem, setPaymentSystem] = useState('Visa');

  const renderHeader = () => {
    return (
      <components.Header
        goBack={true}
        creditCard={true}
        user={true}
        logo={false}
        // title='Open new card'
        showToggleTheme={true}
      />
    );
  };

  const renderType = () => {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          marginBottom: theme.sizes.marginBottom_30,
        }}
      >
        <Text
          style={{
            marginBottom: theme.sizes.marginBottom_10,
            color: theme.colors.bodyTextColor,
          }}
        >
          Type
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
              width: responsiveWidth(48) - 20,
              backgroundColor:
                type === 'debet' ? theme.colors.mainDark : theme.colors.white,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 6,
              borderWidth: 1,
            }}
            onPress={() => setType('debet')}
          >
            <Text
              style={{
                color:
                  type === 'debet' ? theme.colors.white : theme.colors.mainDark,
                ...theme.fonts.SourceSansPro_Regular_14,
                textTransform: 'capitalize',
              }}
            >
              Debet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: responsiveWidth(48) - 20,
              backgroundColor:
                type === 'credit' ? theme.colors.mainDark : theme.colors.white,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 6,
              borderWidth: 1,
            }}
            onPress={() => setType('credit')}
          >
            <Text
              style={{
                color:
                  type === 'credit'
                    ? theme.colors.white
                    : theme.colors.mainDark,
                ...theme.fonts.SourceSansPro_Regular_14,
              }}
            >
              Credit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCurrency = () => {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          marginBottom: theme.sizes.marginBottom_30,
        }}
      >
        <Text
          style={{
            marginBottom: theme.sizes.marginBottom_10,
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
              width: responsiveWidth(48) - 20,
              backgroundColor:
                currency === 'AUD' ? theme.colors.mainDark : theme.colors.white,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 6,
              borderWidth: 1,
            }}
            onPress={() => setCurrency('AUD')}
          >
            <Text
              style={{
                color:
                  currency === 'AUD'
                    ? theme.colors.white
                    : theme.colors.mainDark,
                textTransform: 'uppercase',
                ...theme.fonts.SourceSansPro_Regular_14,
              }}
            >
              AUD
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: responsiveWidth(48) - 20,
              backgroundColor:
                currency === 'EUR' ? theme.colors.mainDark : theme.colors.white,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 6,
              borderWidth: 1,
            }}
            onPress={() => setCurrency('EUR')}
          >
            <Text
              style={{
                color:
                  currency === 'EUR'
                    ? theme.colors.white
                    : theme.colors.mainDark,
                fontSize: 14,
                ...theme.fonts.SourceSansPro_Regular_14,
                textTransform: 'uppercase',
              }}
            >
              EUR
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPaymentSystem = () => {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          marginBottom: theme.sizes.marginBottom_30,
        }}
      >
        <Text
          style={{
            marginBottom: theme.sizes.marginBottom_10,
            color: theme.colors.bodyTextColor,
          }}
        >
          Payment system
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
              width: responsiveWidth(48) - 20,
              backgroundColor:
                paymentSystem === 'Visa'
                  ? theme.colors.mainDark
                  : theme.colors.white,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 6,
              borderWidth: 1,
            }}
            onPress={() => setPaymentSystem('Visa')}
          >
            <components.Image
              source={{
                uri: 'https://george-fx.github.io/apitex/payment/01.png',
              }}
              style={{width: 40.43, height: 12}}
              tintColor={
                paymentSystem === 'Visa'
                  ? theme.colors.white
                  : theme.colors.mainDark
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: responsiveWidth(48) - 20,
              backgroundColor:
                paymentSystem === 'MasterCard'
                  ? theme.colors.mainDark
                  : theme.colors.white,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 6,
              borderWidth: 1,
            }}
            onPress={() => setPaymentSystem('MasterCard')}
          >
            <components.Image
              source={{
                uri: 'https://george-fx.github.io/apitex/payment/02.png',
              }}
              style={{width: 26.35, height: 16}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCards = () => {
    return (
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          paddingLeft: 20,
        }}
        style={{flexGrow: 0, marginBottom: theme.sizes.marginBottom_20}}
        showsHorizontalScrollIndicator={false}
      >
        {cards.map((item, index) => {
          return (
            <components.Image
              source={{uri: item}}
              key={index}
              style={{
                width: responsiveWidth(48),
                marginRight: 10,
                aspectRatio: 1.64,
              }}
              imageStyle={{borderRadius: responsiveHeight(1.2)}}
            />
          );
        })}
      </ScrollView>
    );
  };

  const renderDescription = () => {
    return (
      <View style={{paddingHorizontal: 20}}>
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_16,
            lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
            // color: theme.colors.bodyTextColor,
            color: '#ffffff',
          }}
        >
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur.
        </Text>
      </View>
    );
  };

  const renderBar = () => {
    return (
      <View style={styles.iconBar}>
        <IconButton
          icon='view-dashboard'
          onPress={() => console.log('Print button pressed')}
          size={28}
          color='white'
          style={styles.iconButton}
        />
        <IconButton
          icon='clipboard-check-outline'
          size={28}
          onPress={() => console.log('Print button pressed')}
          style={styles.iconButton}
        />
        <IconButton
          icon='home'
          size={28}
          onPress={() => console.log('Print button pressed')}
          style={styles.iconButton}
        />

        <IconButton
          icon='magnify'
          size={28}
          color='white'
          onPress={() => console.log('Print button pressed')}
          style={styles.iconButton}
        />
        <IconButton
          icon='cloud-upload-outline'
          size={28}
          color='white'
          onPress={() => console.log('Print button pressed')}
          style={styles.iconButton}
        />
        <IconButton
          icon='emoticon-happy-outline'
          size={28}
          color='white'
          onPress={() => console.log('Print button pressed')}
          style={styles.iconButton}
        />
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: theme.sizes.marginTop_10,
        }}
      >
        {renderType()}
        {renderCurrency()}
        {renderPaymentSystem()}
        {renderCards()}
        {renderDescription()}
      </ScrollView>
    );
  };

  const renderButton = () => {
    return (
      <components.Button
        text='Open new card'
        containerStyle={{padding: 20}}
        textStyle={{color: 'white'}} // Set the text color to white
        title='Add new card'
        onPress={() => {
          navigation.navigate('CardMenu');
        }}
      />
    );
  };

  return (
    <components.SafeAreaView>
      {renderHeader()}
      {renderContent()}
      {renderButton()}
      {renderBar()}
    </components.SafeAreaView>
  );
};

const styles = StyleSheet.create({
  iconBar: {
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: '#333333',
    padding: 5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  iconButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    backgroundColor: '#ffffff',
    padding: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarWrapper: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  searchInput: {
    marginLeft: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '96%',
    marginTop: 10,
  },
  dropdownContainer: {
    position: 'absolute',
    bottom: 80,
    right: 60,
    width: 80,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 5,
    padding: 5,
    zIndex: 10,
  },
  option: {
    paddingVertical: 5,
  },
  optionText: {
    fontSize: 16,
    color: '#f1948a',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default OpenNewCard;
