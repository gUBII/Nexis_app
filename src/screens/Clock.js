import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-AU', { hour12: false }); // Change to true for 12-hour format
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // flex: 1,
    backgroundColor: '#fff',
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Clock;
