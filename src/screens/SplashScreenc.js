import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';

const SplashScreenc = () => {
  const navigation = useNavigation();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
      navigation.replace('Onboarding'); // Navigate to main app
    }, 6000); // Adjust delay time as needed
  }, []);

  if (!showSplash) return null; // Hide splash screen after delay

  return (
    <View style={styles.container}>
      <FastImage 
        source={require('../assets/nexis-animated-logo.gif')} // Use your GIF image
        style={styles.gif}
        resizeMode={FastImage.resizeMode.contain} 
      />
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  gif: {
    width:200,
    height: 200,
  },
});

export default SplashScreenc;
