import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import StackNavigator from './src/navigation/StackNavigator';
import { store } from './src/store/store';
import { ThemeProvider } from './src/constants/ThemeContext';
import { LoaderProvider } from './src/constants/LoaderContext';
import { Alert, Platform } from 'react-native';
import { MenuProvider } from './src/constants/MenuContext';
import { TaskProvider } from './src/constants/TaskContext';
import { PendingProvider } from './src/constants/PendingContext';
import { UserProvider } from './src/constants/UserContext';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import PushNotification from 'react-native-push-notification';
import RNLocation from 'react-native-location'

RNLocation.configure({
  distanceFilter: 100, // Meters
  desiredAccuracy: {
    ios: "best",
    android: "balancedPowerAccuracy"
  },
  // Android only
  androidProvider: "auto",
  interval: 5000, // Milliseconds
  fastestInterval: 10000, // Milliseconds
  maxWaitTime: 5000, // Milliseconds
  // iOS Only
  activityType: "other",
  allowsBackgroundLocationUpdates: true,
  headingFilter: 1, // Degrees
  headingOrientation: "portrait",
  pausesLocationUpdatesAutomatically: false,
  showsBackgroundLocationIndicator: false,
})

const App = () => {
  const isFirebaseConfigured = () => {
    try {
      return firebase.apps.length > 0;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('[LOCAL NOTIF] =>', notification);
      },
      requestPermissions: Platform.OS === 'ios',
    });

    PushNotification.createChannel(
      {
        channelId: 'background-location',
        channelName: 'Background Tracking Alerts',
        channelDescription: 'A channel for background location updates',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`🔔 Notification channel '${created}' created`)
    );

    if (!isFirebaseConfigured()) {
      console.warn('[Firebase] Default app is not configured. Add GoogleService-Info.plist to ios/app and rebuild.');
      return undefined;
    }

    requestUserPermission();
    const unsubscribe = messaging().onMessage((remoteMessage) => {
      const messageBody = remoteMessage && remoteMessage.notification
        ? remoteMessage.notification.body
        : '';
      Alert.alert('New Notification', JSON.stringify(messageBody || ''));
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification opened from background state:', remoteMessage.notification);
    });

    messaging().getInitialNotification().then((remoteMessage) => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage.notification);
      }
    });

    return unsubscribe;
  }, []);

  const requestUserPermission = () => {
    messaging().requestPermission()
      .then((authStatus) => {
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Notification permission status:', authStatus);
          getFcmToken();
        } else {
          Alert.alert('Push Notification permission denied');
        }
      })
      .catch((error) => {
        console.error('Error requesting permission:', error);
      });
  };

  const getFcmToken = () => {
    messaging().getToken()
      .then((fcmToken) => {
        if (fcmToken) {
          console.log('FCM Token:', fcmToken);
        } else {
          console.log('Failed to get FCM token');
        }
      })
      .catch((error) => {
        console.error('Error fetching FCM token:', error);
      });
  };

  return (
    <SafeAreaProvider>
      <UserProvider>
        <MenuProvider>
          <TaskProvider>
            <PendingProvider>
              <Provider store={store}>
                <ThemeProvider>
                  <LoaderProvider>
                    <NavigationContainer>
                      <StackNavigator />
                    </NavigationContainer>
                  </LoaderProvider>
                </ThemeProvider>
              </Provider>
            </PendingProvider>
          </TaskProvider>
        </MenuProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
};

export default App;
