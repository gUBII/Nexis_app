import {useState, useEffect, useCallback, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text, 
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  PermissionsAndroid,
  Platform,
  ScrollView,
} from 'react-native';
import BottomTabBar from './tabs/BottomTabBar';
import {components} from '../components';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import moment from 'moment-timezone';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera} from 'react-native-image-picker';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {useTheme} from '../constants/ThemeContext'; 
import BackgroundFetch from "react-native-background-fetch";
import { initBackgroundLocationTracking, resetLocationStage } from './BackgroundLocationService';

const AttendanceRecord = () => {
  const [imageUri, setImageUri] = useState(null);
  const [isClockedIn, setIsClockedIn] = useState(false); 
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const navigation = useNavigation();
  const route = useRoute(); // Access params from the route
  const {jobData} = route.params; // Destructure the jobData
  const fromClockOut = route?.params?.fromClockOut || false;
  const [job, setJob] = useState(jobData);
  const {theme} = useTheme();
  const [clockInTimeDisplay, setClockInTimeDisplay] = useState('');
  const [eod, setEod] = useState('');
  const [km, setKm] = useState('');

  // console.log("Job Data come from Dashboard:", jobData);

  useEffect(() => {
    const loadJobData = async () => {
      const savedJobId = await AsyncStorage.getItem('currentJobId');
      if (savedJobId) {
        const savedJobData = JSON.parse(
          await AsyncStorage.getItem(`job_${savedJobId}`),
        );
        setJob(savedJobData);
        setIsClockedIn(savedJobData?.clockin !== null);
      }
    };
    loadJobData();
  }, []);

  useEffect(() => {
    let interval;
    if (isClockedIn) {
      interval = setInterval(async () => {
        // Calculate time difference
        const currentTime = moment();
        const clockInTime = moment(
          Number(await AsyncStorage.getItem('lastClockIn')) * 1000,
        ); // Retrieve clock-in timestamp
        const diff = currentTime.diff(clockInTime, 'seconds'); // Difference in seconds
        setElapsedTime(diff); // Update elapsed time with difference
        AsyncStorage.setItem('elapsedTime', diff.toString()); // Save updated time
      }, 1000);
    } else {
      clearInterval(interval); // Clear timer when clocked out
    }

    return () => clearInterval(interval); // Cleanup on unmount
  }, [isClockedIn]);

  const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const fine = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    let background = true;
    if (Platform.Version >= 29) { // Android 10+
      background = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION 
      );
    }

    return fine === PermissionsAndroid.RESULTS.GRANTED &&
           background === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true; // iOS handled via plist
};

  // Get Current Location
  const getCurrentLocation = async () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const {latitude, longitude} = position.coords;
          resolve({latitude, longitude});
        },
        (error) => {
          console.error('Location Error:', error);
          Alert.alert(
            'Error',
            'Failed to get location. Make sure GPS is enabled.',
          );
          reject(error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
  };

  // Open Camera and Capture Image
  const captureImage = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
      saveToPhotos: false,
      includeBase64: false,
      isFrontCamera: true,
    };

    const response = await launchCamera(options);

    if (response.didCancel) {
      Alert.alert('Cancelled', 'User cancelled image capture');
      return null;
    } else if (response.errorCode) {
      Alert.alert('Error', `Camera Error: ${response.errorMessage}`);
      return null;
    } else if (!response.assets || response.assets.length === 0) {
      Alert.alert('Error', 'No image captured. Try again.');
      return null;
    }

    return response.assets[0];
  };

  // Inside your useEffect
  useEffect(() => {
    const loadElapsedTime = async () => {
      const savedElapsedTime = await AsyncStorage.getItem('elapsedTime');
      if (savedElapsedTime) {
        setElapsedTime(Number(savedElapsedTime));
      }

      if (fromClockOut) {
        setIsClockedIn(true);
        setTimerRunning(true);
      }
    };
    loadElapsedTime();
  }, [fromClockOut]);

  const loadClockInTime = async () => {
    const lastClockIn = await AsyncStorage.getItem('lastClockIn'); 
    if (lastClockIn) {
      const formatted = moment
        .unix(parseInt(lastClockIn))
        .tz('Asia/Dhaka') // or 'Australia/Sydney'
        .format('DD-MM-YYYY h:mm A');
      setClockInTimeDisplay(formatted);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadClockInTime();
    }, []),
  );

  const handleClockIn = async () => {
    try {
      // Fetch job start time
      if (!job?.stime) {
        Alert.alert('Error', 'Start time is missing for this job.');
        return;
      }

      // Set the current time and job start time
      const sydneyTime = moment().tz('Asia/Dhaka');
      const jobStartTime = moment.tz(
        job.stime,
        'YYYY-MM-DD HH:mm',
        'Asia/Dhaka',
      );

      // Calculate allowed clock-in window
      const earliestClockIn = jobStartTime.clone().subtract(10, 'minutes');

      // Check if current time is within the allowed clock-in window
      if (sydneyTime.isBefore(earliestClockIn)) {
        Alert.alert(
          'Clock-In Restricted',
          `You can clock in starting from ${earliestClockIn.format('HH:mm A')}`,
        );
        return;
      }

      // Request location permission
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      // Get current location
      const {latitude, longitude} = await getCurrentLocation();
      const timestamp = Math.floor(sydneyTime.valueOf() / 1000);
      const clockIn = {date: timestamp};

      const ref_db = await AsyncStorage.getItem('ref_db');
      if (!ref_db || !job?.id) {
        Alert.alert('Error', 'Missing user details. Please log in again.');
        return;
      }

      // Capture image
      const image = await captureImage();
      if (!image) return;
      setImageUri(image.uri);

      const formData = new FormData();
      formData.append('ref_db', ref_db);
      formData.append('jobId', job.id);
      formData.append('clockIn', JSON.stringify(clockIn)); 
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('images', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName,
      });

      // Upload clock-in data
      console.log("🚀 Sending Clock-In Data:", {
        ref_db,
        jobId: job.id,
        clockIn,
        latitude,
        longitude,
        image: image.uri
      });

      // Upload clock-in data
      const responseUpload = await axios.post(
        'https://app.nexis365.com/api/clock-in',
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
        },
      );

      // Store clock-in details
      const newRecord = { 
        clockIn,
        clockOut: null,
        image: image.uri,
      };

      const existingRecords = await AsyncStorage.getItem('attendance_records');
      const records = existingRecords ? JSON.parse(existingRecords) : [];
      records.push(newRecord);
      await AsyncStorage.setItem('attendance_records', JSON.stringify(records));

      // Save job and clock-in data
      await AsyncStorage.setItem('currentJobId', job.id.toString());
      await AsyncStorage.setItem(`job_${job.id}`, JSON.stringify(job)); // Save job data
      await AsyncStorage.setItem('lastClockIn', timestamp.toString());
      await AsyncStorage.setItem('isClockedIn', 'true');

      // Retrieve and log stored values
      const currentJobId = await AsyncStorage.getItem('currentJobId');
      const jobData = await AsyncStorage.getItem(`job_${job.id}`);
      const lastClockIn = await AsyncStorage.getItem('lastClockIn');
      const isClockedIn = await AsyncStorage.getItem('isClockedIn');

      console.log('Current Job ID clockin:', currentJobId);
      console.log('Job Data clockin:', JSON.parse(jobData)); // Parse to view as an object
      console.log('Last Clock-In Timestamp clockin:', lastClockIn);
      console.log('Is Clocked In clockin:', isClockedIn);

      resetLocationStage(); 
      await initBackgroundLocationTracking();
      console.log("✅ Background location tracking started");

      loadClockInTime();
      Alert.alert('Success', responseUpload.data.message);
      setElapsedTime(0);
      setTimerRunning(true);
      setIsClockedIn(true);
      AsyncStorage.setItem('elapsedTime', '0');
    } catch (error) {
      console.error('Clock-In Error:', error);
      Alert.alert('Error', 'Please enable location to clock in.');
    }
  };

  // Handle Clock Out
  const handleClockOut = async () => {
    try {
      const {latitude, longitude} = await getCurrentLocation();
      const sydneyTime = moment().tz('Asia/Dhaka');
      const timestamp = Math.floor(sydneyTime.valueOf() / 1000);

      const clockOut = {date: timestamp};

      const ref_db = await AsyncStorage.getItem('ref_db');
      if (!ref_db || !job?.id) {
        Alert.alert('Error', 'Missing user details. Please log in again.');
        return;
      }

      if (!eod.trim() || !km.trim()) {
        Alert.alert(
          'Required',
          'Please fill in both EOD and KM before clocking out.',
        );
        return;
      }

      const image = await captureImage();
      if (!image) return;
      setImageUri(image.uri);

      const formData = new FormData();
      formData.append('ref_db', ref_db);
      formData.append('jobId', job.id);
      formData.append('clockOut', JSON.stringify(clockOut));
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('eod', eod);
      formData.append('km', km);

      formData.append('images', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName,
      });

       console.log("🚀 Sending Clock-Out Data:", {
      ref_db,
      jobId: job.id,
      clockOut,
      latitude,
      longitude,
      eod,
      km,
      image: image.uri,
    });


      const responseUpload = await axios.post(
        'https://app.nexis365.com/api/clock-out',
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
        },
      );

      const newRecord = {
        clockIn: null,
        clockOut,
        image: image.uri,
      };

      const existingRecords = await AsyncStorage.getItem('attendance_records');
      const records = existingRecords ? JSON.parse(existingRecords) : [];
      records.push(newRecord);
      await AsyncStorage.setItem('attendance_records', JSON.stringify(records));
      await AsyncStorage.setItem('currentJobId', ''); // Reset current job ID
      await AsyncStorage.setItem('isClockedIn', 'false');

      // Retrieve and log stored values
      const attendanceRecords = await AsyncStorage.getItem(
        'attendance_records',
      );
      const currentJobId = await AsyncStorage.getItem('currentJobId');
      const isClockedIn = await AsyncStorage.getItem('isClockedIn');

      console.log( 
        'Attendance Records clockout:',
        JSON.parse(attendanceRecords),
      ); // Parse to view as an object
      console.log('Current Job ID after Clock Out:', currentJobId);
      console.log('Is Clocked In after Clock Out:', isClockedIn);

        BackgroundFetch.stop();
        console.log("🛑 Background tracking stopped after Clock Out");
        resetLocationStage();

      // Show success message
      Alert.alert('Success', responseUpload.data.message, [
        {
          text: 'OK',
          onPress: () => {
            // Wait 2 seconds before redirecting to Dashboard
            setTimeout(() => {
              navigation.navigate('TabNavigator');
            }, 1000); // 2000 milliseconds = 2 seconds
          },
        },
      ]);

      await AsyncStorage.removeItem('lastClockIn');
      await AsyncStorage.removeItem('elapsedTime');

      // Now try to retrieve the removed values
      const removedClockIn = await AsyncStorage.getItem('lastClockIn');
      const removedElapsedTime = await AsyncStorage.getItem('elapsedTime');

      console.log('Removed lastClockIn:', removedClockIn); // Should be null
      console.log('Removed elapsedTime:', removedElapsedTime); // Should be null

      setTimerRunning(true);
      setIsClockedIn(false);
    } catch (error) {
      console.error('Clock-Out Error:', error);
      Alert.alert('Error', 'Please enable location to clock out.');
    }
  };

  const goToTimeSheet = () => {
    navigation.navigate('TimeSheet');
  };

  const goToMyTask = () => {
    navigation.navigate('Task');
  };

  const renderHeader = () => {
    return <components.Header logo={false} goBack={true} creditCard={true} />;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
    },
    title: {
      marginTop: 20,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme === 'dark' ? '#fff' : '#000',
    },
    content: {
      alignItems: 'center',
    },
    text: {
      marginTop: 10,
      color: theme === 'dark' ? '#fff' : '#000',
    },
    clockInButton: {
      marginTop: 20,
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#21AFF0',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    clockOutButton: {
      marginTop: 20,
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#FF5733',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    clockInText: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    clockOutText: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    buttonRow: {
      flexDirection: 'row',
      marginTop: 20,
      gap: 15,
    },
    timeSheetButton: {
      width: 140,
      height: 80,
      borderRadius: 15,
      backgroundColor: theme === 'dark' ? '#000' : '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    myTaskButton: {
      width: 140,
      height: 80,
      borderRadius: 15,
      backgroundColor: theme === 'dark' ? '#000' : '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    clockInText: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 18,
      fontWeight: 'bold',
    },
    clockOutText: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 18,
      fontWeight: 'bold',
    },
    timeSheetText: {
      color: '#21AFF0',
      fontSize: 16,
      fontWeight: 'bold',
    },
    myTaskText: {
      color: '#FFA500',
      fontSize: 16,
      fontWeight: 'bold',
    },
    timerText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 10,
      textAlign: 'center',
      color: theme === 'dark' ? '#fff' : '#000',
    },
    previewImage: {
      marginTop: 20,
      width: 200,
      height: 200,
      borderRadius: 10,
    },
    bottomTab: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    timeInfoBox: {
      width: 140,
      height: 80,
      borderRadius: 15,
      backgroundColor: theme === 'dark' ? '#000' : '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.2,
      shadowRadius: 3,
      padding: 5,
    },
    timeInfoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4,
    },

    timeInfoLabel1: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#28a745',
    },
    timeInfoText1: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#28a745',
    },
    timeInfoLabel2: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#dc3545',
    },
    timeInfoText2: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#dc3545',
    },
    clockinInfoBox: {
      marginTop: 20,
      marginHorizontal: 20,
      padding: 15,
      borderRadius: 12,
      backgroundColor: theme === 'dark' ? '#222' : '#f0f8ff',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    clockinInfoText: {
      fontSize: 15,
      fontWeight: '500',
      color: theme === 'dark' ? '#fff' : '#000',
    },

    input: {
      height: 50,
      borderWidth: 1,
      borderColor: '#21AFF0', 
      borderRadius: 8,
      paddingHorizontal: 12,
      fontSize: 15,
      backgroundColor: theme === 'dark' ? '#222' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000',
      marginTop: 5,
    },
  });

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView
        contentContainerStyle={{paddingBottom: 100}}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Attendance Record</Text>
          <View style={styles.buttonRow}>
            <View style={styles.timeInfoBox}>
              <View style={styles.timeInfoHeader}>
                <Icon name='play-circle' size={20} color='#28a745' />
                <Text style={styles.timeInfoLabel1}>Start Time</Text>
              </View>
              <Text style={styles.timeInfoText1}>{job?.stime}</Text>
            </View>
            <View style={styles.timeInfoBox}>
              <View style={styles.timeInfoHeader}>
                <Icon name='stop-circle' size={20} color='#dc3545' />
                <Text style={styles.timeInfoLabel2}>End Time</Text>
              </View>
              <Text style={styles.timeInfoText2}>{job?.etime}</Text>
            </View>
          </View>

          <View style={styles.clockinInfoBox}>
            <Icon name='log-in' size={24} color='#21AFF0' />
            <Text style={styles.clockinInfoText}>
              Clockin Time: {clockInTimeDisplay || 'Not yet clocked in'}
            </Text>
          </View>

          <TouchableOpacity
            style={
              isClockedIn || fromClockOut
                ? styles.clockOutButton
                : styles.clockInButton
            }
            onPress={
              isClockedIn || fromClockOut ? handleClockOut : handleClockIn
            }
          >
            {!(isClockedIn || fromClockOut) && (
              <Icon
                name='clock'
                size={30}
                style={{color: theme === 'dark' ? '#fff' : '#000'}}
              />
            )}
            <Text
              style={
                isClockedIn || fromClockOut
                  ? styles.clockOutText
                  : styles.clockInText
              }
            >
              {isClockedIn || fromClockOut ? 'Clock Out' : 'Clock In'}
            </Text>
          </TouchableOpacity>

          {isClockedIn && (
            <Text style={styles.timerText}>
              {new Date(elapsedTime * 1000).toISOString().substr(11, 8)}
            </Text>
          )}

          <TextInput
            placeholder='Enter EOD Note'
            value={eod}
            onChangeText={setEod}
            style={styles.input}
          />

          <TextInput
            placeholder='Enter KM'
            value={km}
            onChangeText={setKm}
            keyboardType='numeric'
            style={styles.input}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.timeSheetButton}
              onPress={goToTimeSheet}
            >
              <Icon name='calendar' size={25} color='#21AFF0' />
              <Text style={styles.timeSheetText}>TimeSheet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.myTaskButton} onPress={goToMyTask}>
              <Icon name='check-circle' size={25} color='#FFA500' />
              <Text style={styles.myTaskText}>My Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BottomTabBar style={styles.bottomTab} />
    </View>
  );
};

export default AttendanceRecord;
