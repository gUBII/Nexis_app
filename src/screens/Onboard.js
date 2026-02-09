import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import { components } from '../components';
import BottomTabBar from './tabs/BottomTabBar';

const Onboard = () => {
  const { theme } = useTheme();

  const renderHeader = () => {
    return (
      <components.Header
        logo={false}
        goBack={true}
        creditCard={false}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#333' : '#fff' }}>
      <ScrollView >
        {renderHeader()}
        <View style={styles.container}>
          <Text style={[styles.text, { color: theme === 'dark' ? '#fff' : '#000' }]}>
            Hello World
          </Text>
        </View>
      </ScrollView>
      <BottomTabBar />
    </View>
  );
};

export default Onboard;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
