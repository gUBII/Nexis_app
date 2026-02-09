import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {components} from '../components';
import {theme} from '../constants';
import {svg} from '../assets/svg';

const limits = [
  {
    id: 1,
    title: 'Online payments',
    subtitle: 'Default limit: 100 USD per day',
    icon: svg.GlobeSvg,
  },
  {
    id: 2,
    title: 'ATM withdrawals',
    subtitle: 'Default limit: 3000 USD per day',
    icon: svg.DollarSvg,
  },
];

const security = [
  {
    id: 1,
    title: 'Change PIN code',
    icon: svg.SecurityKeySvg,
  },
  {
    id: 2,
    title: 'Reissue the card',
    icon: svg.RefreshSvg,
  },
  {
    id: 3,
    title: 'Block the card',
    icon: svg.LockSvg,
  },
  {
    id: 4,
    title: 'Сlose the card',
    icon: svg.TrashSvg,
  },
];

const CardDetails = ({navigation}) => {
  const renderHeader = () => {
    return <components.Header goBack={true} file={true} />;
  };

  const renderCard = () => {
    return (
      <components.Image
        source={{uri: 'https://george-fx.github.io/apitex/cards/03.png'}}
        style={{
          width: responsiveWidth(65),
          aspectRatio: 1.586,
          alignSelf: 'center',
          borderRadius: 20,
          marginTop: theme.sizes.marginTop_10,
          marginBottom: theme.sizes.marginBottom_20,
        }}
        imageStyle={{
          borderRadius: 20,
        }}
        resizeMode='contain'
      />
    );
  };

  const renderOptions = () => {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: '#FFF7F2',
            width: responsiveWidth(48) - 20,
            borderRadius: 10,
            padding: 15,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#FFEFE6',
          }}
        >
          <components.Image
            source={require('../assets/icons/wallet.png')}
            style={{width: 24, height: 18, marginRight: 12}}
          />
          <Text
            style={{
              ...theme.fonts.SourceSansPro_Regular_16,
              color: theme.colors.mainDark,
              marginRight: 'auto',
            }}
          >
            Apple Pay
          </Text>
          <svg.PlusSvg />
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: '#FFF7F2',
            width: responsiveWidth(48) - 20,
            borderRadius: 10,
            padding: 15,
            borderWidth: 1,
            borderColor: '#FFEFE6',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              ...theme.fonts.SourceSansPro_Regular_16,
              color: theme.colors.mainDark,
            }}
          >
            Default card
          </Text>
          <components.SwitchButton />
        </View>
      </View>
    );
  };

  const renderLimits = () => {
    return (
      <View style={{paddingHorizontal: 20, marginTop: responsiveHeight(4)}}>
        <Text
          style={{
            color: theme.colors.bodyTextColor,
            ...theme.fonts.SourceSansPro_Regular_14,
            lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
            marginBottom: theme.sizes.marginBottom_10,
          }}
        >
          Limits
        </Text>
        {limits.map((item, index, array) => {
          const last = index === array.length - 1;

          return (
            <TouchableOpacity
              key={index}
              style={{
                width: '100%',
                marginBottom: last ? 0 : 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onPress={() => {
                item.title === 'Online payments' &&
                  navigation.navigate('Payments');
              }}
            >
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 2,
                  }}
                >
                  <item.icon />
                  <Text
                    style={{
                      ...theme.fonts.SourceSansPro_Regular_16,
                      lineHeight:
                        theme.fonts.SourceSansPro_Regular_16.fontSize * 1.3,
                      color: theme.colors.mainDark,
                      marginLeft: 10,
                      marginBottom: 2,
                    }}
                  >
                    {item.title}
                  </Text>
                </View>
                <Text
                  style={{
                    ...theme.fonts.SourceSansPro_Regular_12,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
                    color: theme.colors.bodyTextColor,
                  }}
                >
                  {item.subtitle}
                </Text>
              </View>
              <svg.RightArrowSvg />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderSecurity = () => {
    return (
      <View style={{paddingHorizontal: 20, marginTop: responsiveHeight(4)}}>
        <Text
          style={{
            color: theme.colors.bodyTextColor,
            ...theme.fonts.SourceSansPro_Regular_14,
            lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
            marginBottom: theme.sizes.marginBottom_10,
          }}
        >
          Security
        </Text>
        {security.map((item, index, array) => {
          const last = index === array.length - 1;

          return (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: last ? 0 : responsiveHeight(1.6),
              }}
              onPress={() => {
                item.title === 'Change PIN code' &&
                  navigation.navigate('ChangePinCode');
              }}
            >
              <item.icon />
              <Text
                style={{
                  marginRight: 'auto',
                  marginLeft: 10,
                  ...theme.fonts.SourceSansPro_Regular_16,
                  lineHeight:
                    theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                  color: theme.colors.mainDark,
                }}
              >
                {item.title}
              </Text>
              <svg.RightArrowSvg />
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
          paddingBottom: theme.sizes.paddingBottom_20,
        }}
      >
        {renderOptions()}
        {renderLimits()}
        {renderSecurity()}
      </ScrollView>
    );
  };

  return (
    <components.SafeAreaView>
      {renderHeader()}
      {renderCard()}
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default CardDetails;
