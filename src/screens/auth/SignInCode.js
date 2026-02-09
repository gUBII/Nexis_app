import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {components} from '../../components';
import {theme} from '../../constants';

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'scan', 0, 'x'];

const SignInCode = () => {
  const [code, setCode] = useState('');
  console.log(code);

  const renderStatusBar = () => {
    return (
      <StatusBar barStyle='dark-content' backgroundColor={theme.colors.white} />
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_18,
            lineHeight: theme.fonts.SourceSansPro_Regular_18.fontSize * 1.2,
            color: theme.colors.mainDark,
            marginBottom: theme.sizes.marginBottom_4,
          }}
        >
          Briley Henderson
        </Text>
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_16,
            lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
            marginBottom: theme.sizes.marginBottom_20,
            color: theme.colors.bodyTextColor,
          }}
        >
          brileyhenderson@mail.com
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.sizes.marginBottom_40,
          }}
        >
          {[1, 2, 3, 4].map((item, index) => {
            return (
              <View key={index}>
                <View
                  style={{
                    width: responsiveHeight(1),
                    height: responsiveHeight(1),
                    borderRadius: responsiveHeight(1) / 2,
                    backgroundColor: theme.colors.mainDark,
                    marginHorizontal: 7,
                    opacity: item <= code.length ? 1 : 0.2,
                  }}
                />
              </View>
            );
          })}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: theme.sizes.marginBottom_30,
          }}
        >
          {numbers.map((number, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  width: responsiveWidth(19),
                  height: responsiveWidth(19),
                  borderRadius: 14,
                  backgroundColor: theme.colors.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 7,
                  borderColor: '#FFEFE6',
                  borderWidth: 1,
                }}
                onPress={() => {
                  if (number === 'x') {
                    setCode(code.slice(0, -1));
                  } else if (number === 'scan') {
                    console.log('scan');
                  } else {
                    if (code.length === 4) {
                      return;
                    }
                    setCode(code + number);
                  }
                }}
              >
                {number === 'scan' && (
                  <components.Image
                    source={require('../../assets/icons/scanCode.png')}
                    style={{
                      width: responsiveHeight(4),
                      aspectRatio: 1 / 1,
                    }}
                  />
                )}
                {number === 'x' && (
                  <components.Image
                    source={require('../../assets/icons/close.png')}
                    style={{
                      width: responsiveHeight(4),
                      aspectRatio: 1 / 1,
                    }}
                  />
                )}
                {number !== 'scan' && number !== 'x' && (
                  <Text
                    style={{
                      ...theme.fonts.SourceSansPro_Regular_24,
                      color: theme.colors.mainDark,
                    }}
                  >
                    {number}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity>
          <Text
            style={{
              ...theme.fonts.SourceSansPro_Regular_16,
              lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
              color: theme.colors.mainColor,
              marginBottom: theme.sizes.marginBottom_10,
            }}
          >
            Lost your password?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            style={{
              ...theme.fonts.SourceSansPro_Regular_16,
              lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
              color: theme.colors.mainColor,
            }}
          >
            Switch user
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <components.SafeAreaView background={true}>
      {renderStatusBar()}
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default SignInCode;
