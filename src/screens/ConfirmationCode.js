import {View, Text, TextInput} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import ParsedText from 'react-native-parsed-text';

import {components} from '../components';
import {theme} from '../constants';

const ConfirmationCode = ({navigation}) => {
  const inp1Ref = useRef(null);
  const inp2Ref = useRef(null);
  const inp3Ref = useRef(null);
  const inp4Ref = useRef(null);
  const inp5Ref = useRef(null);

  const [inp1, setInp1] = useState('');
  const [inp2, setInp2] = useState('');
  const [inp3, setInp3] = useState('');
  const [inp4, setInp4] = useState('');
  const [inp5, setInp5] = useState('');

  const code = inp1 + inp2 + inp3 + inp4 + inp5;

  useEffect(() => {
    if (code.length === 5) {
      navigation.navigate('SignUpAccountCreated');
    }
  }, [code]);

  const renderHeader = () => {
    return <components.Header goBack={true} title='Verify your phone number' />;
  };

  const renderContent = () => {
    const blockWidth = responsiveWidth(14);
    const blockHeight = responsiveWidth(14);

    const resendCode = () => {
      console.log('Resend code');
    };

    const inputStyle = {
      textAlign: 'center',
      height: '100%',
      fontSize: responsiveFontSize(2.5),
    };

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          marginTop: 25,
          flexGrow: 1,
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_16,
            color: theme.colors.bodyTextColor,
            marginBottom: theme.sizes.marginBottom_30,
          }}
        >
          Enter your OTP code here.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: blockWidth,
              height: blockHeight,
              marginRight: 13,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#FFEFE6',
              backgroundColor:
                inp1 !== '' ? theme.colors.transparent : theme.colors.white,
            }}
          >
            <TextInput
              ref={inp1Ref}
              maxLength={1}
              style={{...inputStyle}}
              keyboardType='number-pad'
              onChangeText={(text) => {
                setInp1(text);
                if (text !== '') {
                  inp2Ref.current.focus();
                } else if (text === '') {
                  inp1Ref.current.focus();
                }
              }}
            />
          </View>
          <View
            style={{
              width: blockWidth,
              height: blockHeight,
              marginRight: 13,
              borderWidth: 1,
              borderColor: '#FFEFE6',
              borderRadius: 10,
              backgroundColor:
                inp2 !== '' ? theme.colors.transparent : theme.colors.white,
            }}
          >
            <TextInput
              ref={inp2Ref}
              maxLength={1}
              style={{...inputStyle}}
              keyboardType='number-pad'
              onChangeText={(text) => {
                setInp2(text);
                if (text !== '') {
                  inp3Ref.current.focus();
                } else if (text === '') {
                  inp1Ref.current.focus();
                }
              }}
            />
          </View>
          <View
            style={{
              width: blockWidth,
              height: blockHeight,
              marginRight: 13,
              borderWidth: 1,
              borderColor: '#FFEFE6',
              borderRadius: 10,
              backgroundColor:
                inp3 !== '' ? theme.colors.transparent : theme.colors.white,
            }}
          >
            <TextInput
              ref={inp3Ref}
              maxLength={1}
              style={{...inputStyle}}
              keyboardType='number-pad'
              onChangeText={(text) => {
                setInp3(text);
                if (text !== '') {
                  inp4Ref.current.focus();
                } else if (text === '') {
                  inp2Ref.current.focus();
                }
              }}
            />
          </View>
          <View
            style={{
              width: blockWidth,
              height: blockHeight,
              marginRight: 13,
              borderWidth: 1,
              borderColor: '#FFEFE6',
              borderRadius: 10,
              backgroundColor:
                inp4 !== '' ? theme.colors.transparent : theme.colors.white,
            }}
          >
            <TextInput
              ref={inp4Ref}
              maxLength={1}
              style={{...inputStyle}}
              keyboardType='number-pad'
              onChangeText={(text) => {
                setInp4(text);
                if (text !== '') {
                  inp5Ref.current.focus();
                } else if (text === '') {
                  inp3Ref.current.focus();
                }
              }}
            />
          </View>
          <View
            style={{
              width: blockWidth,
              height: blockHeight,
              marginRight: 13,
              borderWidth: 1,
              borderColor: '#FFEFE6',
              borderRadius: 10,
              backgroundColor:
                inp5 !== '' ? theme.colors.transparent : theme.colors.white,
            }}
          >
            <TextInput
              ref={inp5Ref}
              maxLength={1}
              style={{...inputStyle}}
              keyboardType='number-pad'
              onChangeText={(text) => {
                setInp5(text);
                if (text === '') {
                  inp4Ref.current.focus();
                }
              }}
            />
          </View>
        </View>
        <ParsedText
          style={{
            ...theme.fonts.SourceSansPro_Regular_16,
            lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
            color: theme.colors.bodyTextColor,
          }}
          parse={[
            {
              pattern: /Resend./,
              style: {color: theme.colors.mainColor},
              onPress: resendCode,
            },
          ]}
        >
          Didn’t receive the OTP? Resend.
        </ParsedText>
      </KeyboardAwareScrollView>
    );
  };

  return (
    <components.SafeAreaView background={true}>
      {renderHeader()}
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default ConfirmationCode;
