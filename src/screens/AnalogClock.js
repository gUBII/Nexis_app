import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';

const AnalogClock = () => {
  const [seconds, setSeconds] = useState(new Date().getSeconds());
  const [minutes, setMinutes] = useState(new Date().getMinutes());
  const [hours, setHours] = useState(new Date().getHours());

  useEffect(() => {
    // Update the time every second
    const timer = setInterval(() => {
      const currentTime = new Date();
      setSeconds(currentTime.getSeconds());
      setMinutes(currentTime.getMinutes());
      setHours(currentTime.getHours());
    }, 1000);

    // Cleanup the interval when component is unmounted
    return () => clearInterval(timer);
  }, []);

  // Calculate the rotation for each hand
  const secondDegrees = seconds * 6; // 360 / 60 seconds
  const minuteDegrees = minutes * 6 + seconds * 0.1; // 360 / 60 minutes, + second hand effect
  const hourDegrees = (hours % 12) * 30 + minutes * 0.5; // 360 / 12 hours, + minute effect

  return (
    <View style={styles.container}>
      <View style={styles.clockFace}>
        {/* Clock Digits */}
        {[...Array(12).keys()].map((digit) => {
          const angle = ((digit + 1) * 30 - 90) * (Math.PI / 180); // Rotate digits correctly
          const x = 40 * Math.cos(angle); // 40 is the adjusted radius for the digits
          const y = 40 * Math.sin(angle);

          return (
            <Text
              key={digit}
              style={[
                styles.digit,
                { 
                  left: 50 + x - 6, // 50 is the center position, adjust based on radius
                  top: 50 + y - 6, // Adjust based on radius and text size
                },
              ]}
            >
              {digit + 1}
            </Text>
          );
        })}

        {/* Hour Hand */}
        <Animated.View
          style={[
            styles.hand,
            styles.hourHand,
            {
              transform: [{ rotate: `${hourDegrees}deg` }, { translateY: -10 }],
            },
          ]}
        />
        {/* Minute Hand */}
        <Animated.View
          style={[
            styles.hand,
            styles.minuteHand,
            {
              transform: [{ rotate: `${minuteDegrees}deg` }, { translateY: -15 }],
            },
          ]}
        />
        {/* Second Hand */}
        <Animated.View
          style={[
            styles.hand,
            styles.secondHand,
            {
              transform: [{ rotate: `${secondDegrees}deg` }, { translateY: -17.5 }],
            },
          ]}
        />
        {/* Clock Center */}
        <View style={styles.centerDot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#fff',
    backgroundColor:'#EFFCF3'
  },
  clockFace: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#fff',
  },
  digit: {
    position: 'absolute',
    fontSize: 8, // Smaller font size for the smaller clock
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    width: 12,
    height: 12, // Adjusted height for proper centering
  },
  hand: {
    position: 'absolute',
    width: 1,
    backgroundColor: '#000',
  },
  hourHand: {
    height: 25,
    width: 3, // Thicker for hour hand
    backgroundColor: '#333',
    borderRadius: 2,
  },
  minuteHand: {
    height: 35,
    width: 2, // Thinner than hour hand
    backgroundColor: '#555',
    borderRadius: 2,
  },
  secondHand: {
    height: 42.5,
    width: 1, // Thinnest for second hand
    backgroundColor: 'red',
    borderRadius: 1,
  },
  centerDot: {
    width: 5,
    height: 5,
    backgroundColor: '#333',
    borderRadius: 2.5,
    position: 'absolute',
  },
});

export default AnalogClock;
