import {View, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';

import {theme} from '../constants';
import {svg} from '../assets/svg';

const InputField = ({
  value,
  placeholder,
  containerStyle,
  secureTextEntry,
  keyboardType,
  checkIcon,
  eyeOffIcon,
  eyeOnIcon,
  onToggleSecureEntry,
  onChangeText,
  userIcon,
  locationIcon,
  cityIcon,
  flagIcon,
  mailIcon,
  keyIcon,
  dollarIcon,
  editIcon,
  emailIcon,
  calendarIcon,
  mapPinIcon,
  hashIcon,
  briefcaseIcon,
  textStyle, 
}) => {
  const [focus, setFocus] = useState(false);

  return (
    <View
      style={{
        borderWidth: 2,
        borderRadius: 10,
        width: '100%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        backgroundColor: '#ffffff',
        borderColor: focus ? '#55CBF5' : '#55CBF5',
        paddingRight: eyeOffIcon || eyeOnIcon || checkIcon ? 0 : 10,
        ...containerStyle,
      }}
    >
      {briefcaseIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.BriefcaseSvg />
        </View>
      )}
      {mapPinIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.MapPinSvg />
        </View>
      )}
      {calendarIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.CalendarSvg />
        </View>
      )}
      {hashIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.HashSvg />
        </View>
      )}
      {emailIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.EmailSvg />
        </View>
      )}
      {editIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.EditSvg />
        </View>
      )}
      {dollarIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.DollarSignSvg />
        </View>
      )}
      {userIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.UserSvg />
        </View>
      )}
        {locationIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.LocationSvg />
        </View>
      )}
       {cityIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.CitySvg />
        </View>
      )}
      {flagIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.FlagSvg />
        </View>
      )}
      {mailIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.MailSvg />
        </View>
      )}
      {keyIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.KeySvg />
        </View>
      )}
      <TextInput
        keyboardType={keyboardType}
        placeholder={placeholder}
        // placeholderTextColor={'gray'}
        value={value}
        placeholderTextColor={'black'}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        style={{
          flex: 1,
          ...theme.fonts.SourceSansPro_Regular_16,
          lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
          color: theme.colors.mainDark,
           ...textStyle, 
        }}
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={() => {
          setFocus(false);
        }}
      />

{(eyeOffIcon || eyeOnIcon) && onToggleSecureEntry && (
        <TouchableOpacity
          onPress={onToggleSecureEntry} 
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          {secureTextEntry ? <svg.EyeOffSvg /> : <svg.EyeOnSvg />}
        </TouchableOpacity>
      )}

      {checkIcon && (
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <svg.CheckSvg />
        </View>
      )}
    </View>
  );
};

export default InputField;
