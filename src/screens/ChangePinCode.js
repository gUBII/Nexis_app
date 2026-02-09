import React from 'react';
import {StatusBar} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {responsiveHeight} from 'react-native-responsive-dimensions';

import {components} from '../components';
import {theme} from '../constants';

const ChangePinCode = ({navigation}) => {
  const renderHeader = () => {
    return <components.Header title='Change PIN code' goBack={true} />;
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: theme.sizes.paddingTop_10,
          paddingBottom: theme.sizes.paddingBottom_20,
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <components.InputField
          placeholder='••••'
          secureTextEntry={true}
          eyeOffIcon={true}
          keyIcon={true}
          containerStyle={{
            marginBottom: theme.sizes.marginBottom_10,
          }}
        />
        <components.InputField
          placeholder='New PIN'
          secureTextEntry={true}
          eyeOffIcon={true}
          keyIcon={true}
          containerStyle={{
            marginBottom: theme.sizes.marginBottom_10,
          }}
        />
        <components.InputField
          placeholder='Confirm PIN'
          secureTextEntry={true}
          eyeOffIcon={true}
          keyIcon={true}
          containerStyle={{
            marginBottom: theme.sizes.marginBottom_14,
          }}
        />
        <components.Button
          title='Save'
          onPress={() => {
            navigation.navigate('CardDetails');
          }}
        />
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

export default ChangePinCode;
