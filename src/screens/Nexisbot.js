import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import Voice from '@react-native-voice/voice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Nexisbot() {
  const [searchText, setSearchText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [noVoiceDetected, setNoVoiceDetected] = useState(false);

  useEffect(() => {
    Voice.onSpeechStart = () => console.log('Speech start');
    Voice.onSpeechEnd = () => console.log('Speech end');
    Voice.onSpeechResults = (event) => console.log('Speech results:', event);
    Voice.onSpeechError = (e) => console.log('Speech error:', e);
    
    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechError = onSpeechErrorHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  const onSpeechResultsHandler = (event) => {
    console.log('Speech results:', event);
    if (event.value && event.value.length > 0) {
      setSearchText(event.value[0]);
      setNoVoiceDetected(false); // reset if we get results
    }
  };

  const onSpeechEndHandler = () => {
    if (!searchText) {
      setNoVoiceDetected(true);
    }
  };

  const onSpeechErrorHandler = (e) => {
    console.log('Speech error:', e);
    setNoVoiceDetected(true);
  };

  const startRecording = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
    }

    const getSerevice = await Voice.getSpeechRecognitionServices();
    console.log('get-Service', getSerevice);

    try {
      setSearchText('');
      setNoVoiceDetected(false);
      await Voice.start('en-US');
      setIsRecording(true);
      startTimer();
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecording = async () => { 
    try {
      await Voice.stop();
      setIsRecording(false);
      stopTimer();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleRecording = () => {
    isRecording ? stopRecording() : startRecording();
  };

  const startTimer = () => {
    const id = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    clearInterval(intervalId);
    setTimer(0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search..."
          style={styles.input}
        />
        <TouchableOpacity onPress={toggleRecording} style={styles.micButton}>
          <Icon name={isRecording ? 'microphone-off' : 'microphone'} size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {isRecording && (
        <Text style={styles.timerText}>Recording: {formatTime(timer)}</Text>
      )}

      {noVoiceDetected && !isRecording && (
        <Text style={styles.errorText}>No voice found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 50,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
  },
  micButton: {
    marginLeft: 10,
  },
  timerText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: 'red', 
  },
});
