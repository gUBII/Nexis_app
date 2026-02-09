import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text, StyleSheet, Appearance} from 'react-native';

const Mode = () => {
  const colorScheme = Appearance.getColorScheme(); // Get initial color scheme
  const [theme, setTheme] = useState(colorScheme);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(colorScheme); // Set theme when system color scheme changes
    });

    return () => subscription.remove();
  }, []);

  const themeStyles = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ScrollView>
      <View style={themeStyles.container}>
        <Text style={themeStyles.text}>Hello, {theme} mode!</Text>
      </View>
    </ScrollView>
  );
};

export default Mode;

const lightTheme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000',
    fontSize: 24,
  },
});

const darkTheme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
});
