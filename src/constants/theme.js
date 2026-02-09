import {Dimensions} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const {width, height} = Dimensions.get('window');

const colors = {
  mainDark: '#040325',
  mainColor: '#FF8A71',
  bodyTextColor: '#6C6D84',
  white: '#FFFFFF',
  transparent: 'transparent',
  textColor: '#4A5F73',
  lightBlue: '#DBE9F5',
  accent: '#F84C6B',
  strokeColor: '#DBE9F5',
  imageBackground: '#F6F8FB',
};

const fonts = {
  SourceSansPro_Regular_40: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: responsiveFontSize(5.2),
  },
  SourceSansPro_Regular_32: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: responsiveFontSize(4.2),
  },
  SourceSansPro_SemiBold_32: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: responsiveFontSize(4.2),
  },
  SourceSansPro_Regular_28: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: responsiveFontSize(3.7),
  },
  SourceSansPro_SemiBold_28: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: responsiveFontSize(3.7),
  },
  SourceSansPro_Regular_24: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: responsiveFontSize(3.2),
  },
  SourceSansPro_SemiBold_24: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: responsiveFontSize(3.2),
  },
  SourceSansPro_Regular_20: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: responsiveFontSize(2.6),
  },
  SourceSansPro_Regular_18: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: responsiveFontSize(2.6),
  },
  SourceSansPro_Regular_16: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: responsiveFontSize(2.1),
  },
  SourceSansPro_SemiBold_16: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: responsiveFontSize(2.1),
  },
  SourceSansPro_Regular_14: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: responsiveFontSize(1.8),
  },
  SourceSansPro_SemiBold_14: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: responsiveFontSize(1.8),
  },
  SourceSansPro_Regular_12: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: responsiveFontSize(1.6),
  },
  SourceSansPro_Regular_10: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: responsiveFontSize(1.4),
  },
};

const sizes = {
  width,
  height,
  width_20: responsiveWidth(6),
  height_50: responsiveHeight(6),
  marginBottom_4: responsiveHeight(0.5),
  marginBottom_8: responsiveHeight(1),
  marginBottom_10: responsiveHeight(1.2),
  marginBottom_12: responsiveHeight(1.4),
  marginBottom_14: responsiveHeight(1.8),
  marginBottom_17: responsiveHeight(2.1),
  marginBottom_20: responsiveHeight(2.4),
  marginBottom_25: responsiveHeight(3.1),
  marginBottom_30: responsiveHeight(3.3),
  marginBottom_40: responsiveHeight(4.8),
  marginTop_10: responsiveHeight(1.2),
  marginTop_20: responsiveHeight(2.4),
  marginTop_40: responsiveHeight(4.8),
  marginTop_46: responsiveHeight(5.5),
  paddingBottom_10: responsiveHeight(1.2),
  paddingBottom_20: responsiveHeight(2.4),
  paddingTop_10: responsiveHeight(1.2),
  paddingTop_20: responsiveHeight(2.4),
  paddingVertical_15: responsiveHeight(1.9),
};

const theme = {
  colors,
  fonts,
  sizes,
};

export {colors, fonts, sizes, theme};
