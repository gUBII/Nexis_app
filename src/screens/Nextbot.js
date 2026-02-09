import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Voice from '@react-native-voice/voice'; // ✅ Import voice module

const Nextbot = () => {
  const [isListening, setIsListening] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [recognizedText, setRecognizedText] = useState('');

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = (error) => console.log('onSpeechError:', error);

    const androidPermissionChecking = async () => {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Microphone Permission',
              message: 'This app needs access to your microphone to recognize speech.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Microphone permission granted');
          } else {
            console.log('Microphone permission denied');
          }

          const getService = await Voice.getSpeechRecognitionServices();
          console.log('getService for audio:', getService);

        }
      };
      
      androidPermissionChecking();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = () => {
    console.log('Recording Started');
  };

  const onSpeechEnd = () => {
    console.log('Recording Ended');
    setIsListening(false);
  };

  const onSpeechResults = (event) => {
    console.log('onSpeechResults:', event);
    const text = event.value[0];
    setRecognizedText(text);
    setSearchText(text);
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch (error) {
      console.log('StartListening Error:', error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.log('StopListening Error:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: '#f1f1f1',
      borderRadius: 30,
      alignItems: 'center',
      paddingHorizontal: 15,
      margin: 20,
      elevation: 3,
    },
    input: {
      flex: 1,
      height: 45,
      fontSize: 16,
      color: '#000',
    },
    iconContainer: {
      marginLeft: 10,
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#333',
      marginHorizontal: 2,
    },
  });

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search here..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        onPress={() => {
          isListening ? stopListening() : startListening();
        }}
        style={styles.iconContainer}
      >
        {isListening ? (
          <View style={styles.dotsContainer}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        ) : (
          <Icon name="microphone" size={24} color="#333" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Nextbot;
