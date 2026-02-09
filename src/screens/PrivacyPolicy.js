import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import {components} from '../components';
import {theme} from '../constants';

const PrivacyPolicy = () => {
  const renderHeader = () => {
    return <components.Header goBack={true} />;
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: theme.sizes.marginTop_10,
          paddingBottom: theme.sizes.paddingBottom_20,
        }}
      >
        <Text
          style={{
            ...theme.fonts.SourceSansPro_SemiBold_28,
            lineHeight: theme.fonts.SourceSansPro_Regular_28.fontSize * 1.2,
            color: theme.colors.mainDark,
            marginBottom: theme.sizes.marginBottom_20,
          }}
        >
          Privacy policy
        </Text>
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_18,
            lineHeight: theme.fonts.SourceSansPro_Regular_18.fontSize * 1.2,
            color: theme.colors.mainDark,
            marginBottom: theme.sizes.marginBottom_10,
          }}
        >
          1. Terms
        </Text>
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_16,
            lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
            color: theme.colors.bodyTextColor,
            marginBottom: theme.sizes.marginBottom_30,
          }}
        >
          By accessing this website, you are agreeing to be bound by these
          website Terms and Conditions of Use, applicable laws and regulations
          and their compliance. If you disagree with any of the stated terms and
          conditions, you are prohibited from using or accessing this site. The
          materials contained in this site are secured by relevant copyright and
          trademark law.
        </Text>
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_18,
            lineHeight: theme.fonts.SourceSansPro_Regular_18.fontSize * 1.2,
            color: theme.colors.mainDark,
            marginBottom: theme.sizes.marginBottom_10,
          }}
        >
          2. Use Licence
        </Text>
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_16,
            lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
            color: theme.colors.bodyTextColor,
            marginBottom: theme.sizes.marginBottom_30,
          }}
        >
          By accessing this website, you are agreeing to be bound by these
          website Terms and Conditions of Use, applicable laws and regulations
          and their compliance. If you disagree with any of the stated terms and
          conditions, you are prohibited from using or accessing this site. The
          materials contained in this site are secured by relevant copyright and
          trademark law.
        </Text>
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_16,
            lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
            color: theme.colors.bodyTextColor,
          }}
        >
          • modify or copy the materials;
        </Text>
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_16,
            lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
            color: theme.colors.bodyTextColor,
          }}
        >
          • use the materials for any commercial use;
        </Text>
      </ScrollView>
    );
  };

  return (
    <components.SafeAreaView>
      {renderHeader()}
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default PrivacyPolicy;
