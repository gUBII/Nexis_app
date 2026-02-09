// Loader.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Loader = () => {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="small" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
});

export default Loader;
