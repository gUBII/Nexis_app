// services/notificationService.js

import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import axios from 'axios';  // Import axios for making HTTP requests

// Request user permission for push notifications
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Push Notification Authorization status:', authStatus);
  }
}

// Retrieve FCM Token, save it in AsyncStorage, and return it
export async function getFcmToken() {
  try {
    // Check if the token is already saved in AsyncStorage
    const storedToken = await AsyncStorage.getItem('fcmToken');
    if (storedToken) {
      console.log('FCM Token (from storage):', storedToken);
      return storedToken;
    }

    // Fetch new token if not found in storage
    const token = await messaging().getToken();
    if (token) {
      console.log('FCM Token (new):', token);
      // Save the token in AsyncStorage
      await AsyncStorage.setItem('fcmToken', token);

      // Send the FCM token to the server and update the user's data
      await saveFcmTokenToServer(token);
    }
    return token;
  } catch (error) {
    console.error('Error fetching FCM token:', error);
    return null;
  }
}

// Save FCM token to the server (for updating the user's record in the database)
export async function saveFcmTokenToServer(fcmToken) {
  try {
    const email = await AsyncStorage.getItem('email'); // Retrieve email from AsyncStorage

    if (email) {
      console.log('Sending to server:', { email, fcmToken }); 
      // Send the token to the server to update the 'fcm' field in the 'uerp_user' table
      const response = await axios.post('http://192.168.1.195:3000/api/update-fcm', {
        email: email,
        fcmToken: fcmToken
      });

      if (response.status === 200) {
        console.log('FCM token saved successfully to the server.');
      } else {
        console.error('Failed to save FCM token to the server:', response.data);
      }
    } else {
      console.error('Email not found in AsyncStorage');
    }
  } catch (error) {
    console.error('Error saving FCM token to the server:', error);
  }
}

// Handle foreground notifications
export function onForegroundNotification() {
  return messaging().onMessage(async remoteMessage => {
    Alert.alert('New FCM Message!', JSON.stringify(remoteMessage.notification));
  });
}

// Handle background notifications
export function onBackgroundNotification() {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
}
