import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { svg } from '../assets/svg';
import { useTheme } from '../constants/ThemeContext';
import BottomTabBar from './tabs/BottomTabBar';
import { components } from '../components';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

const Notifications = () => {
  const { theme } = useTheme();
  const [pendingTasks, setPendingTasks] = useState([]);
  const [todayShifts, setTodayShifts] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingShifts, setLoadingShifts] = useState(true);


  useEffect(() => {
    const fetchPendingTasks = async () => {
      try {
        const refDb = await AsyncStorage.getItem('ref_db');
        const userId = await AsyncStorage.getItem('secondaryId');

        if (refDb && userId) {
          const response = await axios.get('https://app.nexis365.com/api/get-tasks', {
            params: {
              ref_db: refDb,
              activity: 0, // only Pending tasks
              userid: userId,
            },
          });

          if (response.data.success) {
            setPendingTasks(response.data.tasks);
          }
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchPendingTasks();
  }, []);

  useEffect(() => {
    const fetchTodayShifts = async () => {
      try {
        const refDb = await AsyncStorage.getItem('ref_db');
        const userId = await AsyncStorage.getItem('secondaryId');

        if (refDb && userId) {
          const response = await axios.get('https://app.nexis365.com/api/get-jobs', {
            params: {
              ref_db: refDb,
              filter: 'today',
              userid: userId,
            },
          });

          if (response.data.success) {
            const todayJobs = response.data.jobs.map(job => ({
              ...job,
              shiftTime: `${moment(job.stime).format("HH:mm")} - ${moment(job.etime).format("HH:mm")}`
            }));
            setTodayShifts(todayJobs);
          }
        }
      } catch (error) {
        console.error('Error fetching today\'s shifts:', error);
      } finally {
        setLoadingShifts(false);
      }
    };

    fetchTodayShifts();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // assuming UNIX timestamp in seconds
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTodayDate = () => {
    return moment().format("MMM D, YYYY"); // returns today's date
  };


  const renderHeader = () => (
    <components.Header logo={false} goBack={true} creditCard={true} favicon={true} />
  );

  const renderTitle = () => (
    <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
      <Text
        style={{
          color: theme === 'dark' ? '#fff' : '#000',
          fontSize: 24,
          fontWeight: 'bold',
        }}
      >
        Notifications
      </Text>
    </View>
  );

  const renderContent = () => (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 120,
      }}
      showsVerticalScrollIndicator={false}
    >
      {(loadingTasks || loadingShifts) ? (
      
         <View style={{ alignItems: 'center', justifyContent: 'center', height: 200 }}>
          <FastImage
            source={require('../assets/moving.gif')}
            style={{ width: 100, height: 100 }}
            resizeMode={FastImage.resizeMode.contain}
          />
          </View>
      ) : (
        <>
          {todayShifts.map((item, index) => {
            const last = index === todayShifts.length - 1;

            return (
              <TouchableOpacity
                key={item.id}
                style={{
                  backgroundColor: theme === 'dark' ? '#000' : '#f4f4f4',
                  // marginBottom: last ? 0 : 10,
                  marginBottom: last && pendingTasks.length > 0 ? 10 : last ? 0 : 10,
                  padding: 20,
                  borderRadius: 10,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                <Text numberOfLines={1} style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
                  <Text style={{ fontWeight: 'bold' }}>Today Shift: </Text>
                    {item.shiftTime}
                  </Text>
                </View>

                <Text numberOfLines={1} style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
                    <Text style={{ fontWeight: 'bold' }}>Client: </Text>
                    {item.client_name || "Unknown Client"}
                  </Text>
                  
              </TouchableOpacity>
            );
          })}
          {pendingTasks.map((item, index) => {
            const last = index === pendingTasks.length - 1;

            return (
              <TouchableOpacity
                key={item.id}
                style={{
                  backgroundColor: theme === 'dark' ? '#000' : '#f4f4f4',
                  marginBottom: last ? 0 : 10,
                  padding: 20,
                  borderRadius: 10,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                  {/* Add icons based on status if needed */}
                  {item.status === 'completed' && (
                    <View style={{ marginRight: 8 }}>
                      <svg.CompletedNoticeSvg />
                    </View>
                  )}
                  {item.status === 'alert' && (
                    <View style={{ marginRight: 8 }}>
                      <svg.AlertSvg />
                    </View>
                  )}
                  {item.status === 'rejected' && (
                    <View style={{ marginRight: 8 }}>
                      <svg.RejectedSvg />
                    </View>
                  )}
                  <Text numberOfLines={1} style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
                    <Text style={{ fontWeight: 'bold' }}>Task: </Text>
                    {item.title}
                  </Text>

                </View>

                <Text style={{ color: theme === 'dark' ? '#bbb' : '#666' }}>
                  {formatDate(item.date)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </>
      )}
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#333' : '#fff' }}>
      {renderHeader()}
      {renderTitle()}
      {renderContent()}
      <BottomTabBar />
    </View>
  );
};

export default Notifications;
