import React, { useState, useEffect } from 'react';
import { View, Button, PermissionsAndroid, Platform } from 'react-native';
import BackgroundService from 'react-native-background-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

const veryIntensiveTask = async taskData => {
  const { delay } = taskData;
  while (BackgroundService.isRunning()) {
    console.log('Running background task...');
    await sleep(delay);
  }
};

const options = {
  taskName: 'backgroundExample',
  taskTitle: 'Apps Running on Background',
  taskDesc: 'ExampleTask description',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#00ff00',
  linkingURI: '',
  parameters: {
    delay: 1000,
  },
};

async function requestPermissions() {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    ]);
  }
}

const BackgroundExample = () => {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const checkBackgroundStatus = async () => {
      const storedStatus = await AsyncStorage.getItem('bg_service_status');
      if (storedStatus === 'running') {
        setRunning(true);
      }
    };
    checkBackgroundStatus();
  }, []);

  const toggleBackgroundTask = async () => {
    if (!BackgroundService.isRunning()) {
      await requestPermissions();
      await BackgroundService.start(veryIntensiveTask, options);
      await AsyncStorage.setItem('bg_service_status', 'running');
      setRunning(true);
    } else {
      await BackgroundService.stop();
      await AsyncStorage.removeItem('bg_service_status');
      setRunning(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title={running ? 'Stop Background' : 'Start Background'}
        onPress={toggleBackgroundTask}
      />
    </View>
  );
};

export default BackgroundExample;
