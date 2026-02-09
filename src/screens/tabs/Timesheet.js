import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../constants/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment-timezone';
import FastImage from 'react-native-fast-image';

const Timesheet = () => {
  const { theme } = useTheme();

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const ref_db = await AsyncStorage.getItem('ref_db');
      const userid = await AsyncStorage.getItem('secondaryId');

      if (!ref_db || !userid) return;

      const response = await axios.get('https://app.nexis365.com/api/get-jobs', {
        params: { ref_db, userid, filter: 'completed' },
      });

      if (response.data.success) {
        setAttendanceData(response.data.jobs);
      } else {
        setAttendanceData([]);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalTime = (clockIn, clockOut) => {
    if (!clockIn || !clockOut) return 'N/A';
    const duration = moment.duration(moment.unix(clockOut).diff(moment.unix(clockIn)));
    return `${duration.hours()}h ${duration.minutes()}m`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      padding: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginVertical: 10,
      color: theme === 'dark' ? '#fff' : '#757575',
    },
    card: {
      backgroundColor: theme === 'dark' ? '#444' : '#fff',
      padding: 8,
      borderRadius: 10,
      marginBottom: 8,
      elevation: 2,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#fff' : '#000',
      flex: 1,
      textAlign: 'justify',
    },
    value: {
      fontSize: 16,
      color: theme === 'dark' ? '#fff' : '#000',
      flex: 1,
      textAlign: 'justify',
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#333' : '#fff' }}>
      {loading ? (
        <View style={{ alignItems: 'center', justifyContent: 'center', height: 200 }}>
          <FastImage
            source={require('../../assets/moving.gif')} // Correct path to your assets
            style={{ width: 100, height: 100 }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#333' }}>
            TimeSheet
          </Text>

          <View style={{ marginBottom: 120 }}>
               {attendanceData.length === 0 ? (
          <Text style={{ 
            fontSize: 18, 
            color: theme === 'dark' ? '#fff' : '#333', 
            textAlign: 'center', 
            marginTop: 50 
          }}>
            No attendance data found.
          </Text>
        ) : (
           attendanceData.slice(0, 10).map((item, index) => {
              const clockInTimestamp = item.clockin ? moment.unix(item.clockin).tz('Australia/Sydney') : null;
              const clockOutTimestamp = item.clockout ? moment.unix(item.clockout).tz('Australia/Sydney') : null;

              const clockInTime = clockInTimestamp ? clockInTimestamp.format('HH:mm:ss') : 'N/A';
              const clockOutTime = clockOutTimestamp ? clockOutTimestamp.format('HH:mm:ss') : 'N/A';
              const totalTime = calculateTotalTime(item.clockin, item.clockout);

              return (
                <View key={index} style={styles.card}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.row}>
                      <Text style={styles.label}>Clock In</Text>
                      <Text style={styles.label}>Clock Out</Text>
                      <Text style={styles.label}>Total Time</Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.value}>{clockInTime}</Text>
                      <Text style={styles.value}>{clockOutTime}</Text>
                      <Text style={styles.value}>{totalTime}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Timesheet;
