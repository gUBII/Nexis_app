import {View, Text, StyleSheet, ScrollView,TouchableOpacity, Image,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {components} from '../../components';
import {svg} from '../../assets/svg';
import {useTheme} from '../../constants/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { useMenu } from '../../constants/MenuContext';
import moment from "moment";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from '@react-navigation/native';
import tinycolor from 'tinycolor2';
import AnalogClock from '../AnalogClock';
import Clock from '../Clock';
import { useTask } from '../../constants/TaskContext';
import { usePending } from '../../constants/PendingContext';
import Icon from "react-native-vector-icons/FontAwesome";
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { setScreen } from '../../store/tabSlice';



const Dashboard = () => {
  const navigation = useNavigation();
  const [menuData, setMenuData] = useState([]);
  const { refreshToggle } = useMenu();
  const {theme} = useTheme();
  const dispatch = useDispatch();
  


  const [dataLoaded, setDataLoaded] = useState(false);
  const [asyncData, setAsyncData] = useState({ uidm: '', utypem: '', dbnamem: '', samvm: '', mode:'' });
  const [webViewSource, setWebViewSource] = useState(null);

  useEffect(() => {
    // Fetch data from AsyncStorage and prepare it for the WebView
    const fetchDataAndSend = async () => {
      try {
        const id = await AsyncStorage.getItem('secondaryId');
        const unbox = await AsyncStorage.getItem('secondaryUnbox');
        const ref_db = await AsyncStorage.getItem('ref_db');
        const samvm = await AsyncStorage.getItem('secondaryUsername2');

        // Save data in asyncData 
        const newData = { uidm: id || '', utypem: unbox || '', dbnamem: ref_db || '', samvm: samvm || '', mode: theme || 'light', };
        setAsyncData(newData);
        console.log('check cookies', newData); 

        // Prepare WebView POST data
        const formData = Object.keys(newData)
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(newData[key])}`)
          .join('&');

        setWebViewSource({
          uri: 'https://www.nexis365.com/saas/cookie.php',
          method: 'POST',
          body: formData,
        });

        setDataLoaded(true);
      } catch (error) {
        console.error('Failed to load async data or set WebView source', error);
      }
    };

    fetchDataAndSend();
  }, [theme]);


//webview for App to software data pass
  const renderWebviews = () => {
    if (!dataLoaded || !webViewSource) {
      return null; 
    }

    return (
      <WebView
        source={webViewSource}
        style={{flex: 1,
        }}
      />
    );
  };
  

  const GreetingHeader = () => {
    const [username, setUsername] = useState('User');
    const [designation, setDesignation] = useState('User');
    const [image, setImage] = useState('');

    const fetchProfileData = async () => {
      try {
        const ref_db = await AsyncStorage.getItem("ref_db");
        const userid = await AsyncStorage.getItem("secondaryId");
  
        if (!ref_db || !userid) {
          console.warn("Missing ref_db or userid.");
          return;
        }
  
        const response = await fetch(`https://app.nexis365.com/api/get-profile?ref_db=${ref_db}&userid=${userid}`);
        
        
        if (!response.ok) {
          console.error("Server error:", response.status, response.statusText);
          return;
        }
  
        const text = await response.text();  
  
        try {
          const data = JSON.parse(text);
  
          if (data.success) {
            setDesignation(data.profile.designation_name || '');

            const imagePath = data.profile.images || ''; 
    
            // Construct full image URL
            const fullImageUrl = imagePath 
              ? `https://www.nexis365.com/saas/${imagePath}` 
              : ''; 
            setImage(fullImageUrl); // Set the image URL

          } else {
            console.error("Failed to fetch profile data:", data.message);
          }
        } catch (jsonError) {
          console.error("Invalid JSON response, cannot parse:", text);
        }
        
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
  };
  
    
  
    useEffect(() => {
      fetchProfileData();
      const unsubscribe = navigation.addListener('focus', fetchProfileData);
      return unsubscribe;
    }, [navigation]);
  
    useEffect(() => {
      const fetchUsername = async () => {
        const storedUsername = await AsyncStorage.getItem('secondaryUsername2');
        // const storedDesignation = await AsyncStorage.getItem('designation');
        if (storedUsername) setUsername(storedUsername);
        // if (storedDesignation) setDesignation(storedDesignation);
      };
      fetchUsername();
    }, []);
  
    const getCurrentGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Morning';
      if (hour < 18) return 'Afternoon';
      return 'Evening';
    };

    const styles = StyleSheet.create({
      // Greeeting css START
      container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: theme === 'dark' ? '#333' : '#E0E0E0',
      },
      greeting: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme === 'dark' ? '#fff' : '#333',
      },
      date: {
        fontSize: 14,
        color: theme === 'dark' ? '#fff' : '#808080',
      },
      profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
      },
      // Greeeting css END
    });
  
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.greeting}>{`Good ${getCurrentGreeting()}, ${username} ✌🏼`}</Text>
          <Text style={styles.date}>{designation}</Text>
        </View>
        <TouchableOpacity  onPress={() => navigation.navigate('Profile')} >
        <Image source={image ? { uri: image } : require('../../assets/profile/profile.png')} 
         style={styles.profileImage} />
        </TouchableOpacity>
      </View>
    );
  };

  const DashboardAttendance = () => {

    const [loading, setLoading] = useState(false);
    const [bocData, setBocData] = useState(null);
    const [eodData, setEodData] = useState(null);
    const [incidentData, setIncidentData] = useState(null);
    const [error, setError] = useState(null);
    const [dataCount, setDataCount] = useState(0); 
    const [dataCount1, setDataCount1] = useState(0); 
    const [dataCount2, setDataCount2] = useState(0); 
    const dispatch = useDispatch();

    const { todayTaskCount } = useTask();
    const { pendingTasksCount } = usePending(); 

  // Format the date as DD-MM-YYYY
  const getCurrentDate = () => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date().toLocaleDateString('en-GB', options);
  };

  useEffect(() => {
    const fetchBocData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get ref_db and userid from AsyncStorage
        const refDb = await AsyncStorage.getItem('ref_db');
        const userId = await AsyncStorage.getItem('secondaryId');

        if (!refDb || !userId) {
          setError('Missing ref_db or userId in AsyncStorage');
          setLoading(false);
          return;
        }

        // Call the API with ref_db and userid
        const response = await axios.get('https://app.nexis365.com/api/boc', {
          params: {
            ref_db: refDb,
            employeeid: userId,
          },
        });

        // Set the result to state
        const data = response.data.data || [];
        setBocData(data);
        setDataCount(data.length || 0); // Update count based on the response
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data');
        setDataCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBocData();
  }, []);

  useEffect(() => {
    const fetchEodData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get ref_db and userid from AsyncStorage
        const refDb = await AsyncStorage.getItem('ref_db');
        const userId = await AsyncStorage.getItem('secondaryId');

        if (!refDb || !userId) {
          setError('Missing ref_db or userId in AsyncStorage');
          setLoading(false);
          return;
        }

        // Call the API with ref_db and userid
        const response = await axios.get('https://app.nexis365.com/api/eod', {
          params: {
            ref_db: refDb,
            employeeid: userId,
          },
        });

        // Set the result to state
        const data = response.data.data || [];
        setEodData(data);
        setDataCount1(data.length || 0); // Update count based on the response
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data');
        setDataCount1(0);
      } finally {
        setLoading(false);
      }
    };

    fetchEodData();
  }, []);

  useEffect(() => {
    const fetchIncidentData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get ref_db and userid from AsyncStorage
        const refDb = await AsyncStorage.getItem('ref_db');
        const userId = await AsyncStorage.getItem('secondaryId');

        if (!refDb || !userId) {
          setError('Missing ref_db or userId in AsyncStorage');
          setLoading(false);
          return;
        }

        // Call the API with ref_db and userid
        const response = await axios.get('https://app.nexis365.com/api/incident', {
          params: {
            ref_db: refDb,
            employeeid: userId,
          },
        });

        // Set the result to state
        const data = response.data.data || [];
        setIncidentData(data);
        setDataCount2(data.length || 0);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data');
        setDataCount2(0);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidentData();
  }, []);


  if (error) {
    return (
      <View>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

    const styles = StyleSheet.create({
      dcontainer: {
        padding: 16,
      },
      row: {
        flexDirection: "row", // Make sure the row's children are aligned horizontally
      },
      rowContainer: {
        alignItems:'center',
        flex: 1, // Ensures each card gets equal width
      },
      actionButton: {
        marginLeft: 150,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
      },
      buttonText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#fff",
      },
      card: {
        width: "100%",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
      },
      rowContainers: {
        marginTop:6,
        justifyContent:'space-between',
        flexDirection:'row',
        flex: 1, // Ensures each card gets equal width
      },
      cards: {
        width: "100%",
        backgroundColor: "#fff",
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 10,
      },
      title: {
        fontSize: 16,
        fontWeight: "bold",
      },
      time: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 4,
        color: "#555",
      },
      leftCard: {
        flex: 0.4,
        marginRight: 8, // Space between cards
      },
      rightCard: {
        flex: 0.6,
      },
      date: {
        alignItems:'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,  // Add spacing above the date
      },
      dates: {
        alignItems:'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
      },
      text: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
        flexWrap: 'wrap',
        
      },

      row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // paddingVertical: 4,
      },
      label: {
        fontSize: 16,
        fontWeight: "bold",
        flex: 1,
        textAlign: "left",
        color: theme === 'dark' ? '#757575' : '#757575',
      },
      colon: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        width: 20,
        color: theme === 'dark' ? '#757575' : '#757575',
      },
      value: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "right",
        color: theme === 'dark' ? '#757575' : '#757575',
        minWidth: 30,
      },

      tableRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: 40,
        paddingVertical: 4, 
      },

      lines: {
        borderBottomWidth: 1,
        borderBottomColor: "#A8D0E6",
        width: "100%",
      },
  
   
    });
  
    return (
      <View style={styles.dcontainer}>
        <View style={styles.row}>
          {/* First Card */}
          <View
            style={[styles.card, styles.leftCard, {backgroundColor:'#EFFCF3'}]}
          >
            <View style={styles.rowContainer}>
               <View >
                  <AnalogClock />
               </View>
               <View style={{marginTop:16}} >
               <Text style={styles.dates}>{getCurrentDate()}</Text>
               </View>
            </View>
          </View>
  
          {/* Second Card */}
          <View
            style={[styles.cards, styles.rightCard, {backgroundColor:'#EAF9FE', padding:10}]}
          >
          <TouchableOpacity style={styles.tableRow}   onPress={() => dispatch(setScreen('Jobs'))}>
            <Text style={styles.label}>Today's Shift</Text> 
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{todayTaskCount}</Text>
          </TouchableOpacity>
          <View style={styles.lines} />
          <TouchableOpacity style={styles.tableRow} onPress={() => dispatch(setScreen('Tasks'))} >
            <Text style={styles.label}>Today's Tasks</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{pendingTasksCount}</Text>
          </TouchableOpacity>
          <View style={styles.lines} />
          <TouchableOpacity style={styles.tableRow}
            onPress={() =>
              navigation.navigate('Webview', {
                type: 'boc',
              })
            }
          >
            <Text style={styles.label}>BOC</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{dataCount}</Text>
          </TouchableOpacity>
          <View style={styles.lines} />
          <TouchableOpacity style={styles.tableRow} 
           onPress={() =>
              navigation.navigate('Webview', {
                type: 'eod',
              })
            }>
            <Text style={styles.label}>EOD</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{dataCount1}</Text>
          </TouchableOpacity>
          <View style={styles.lines} />
          <TouchableOpacity style={styles.tableRow}  
            onPress={() =>
              navigation.navigate('Webview', {
                type: 'incident',
              })
            }>
            <Text style={styles.label}>INCIDENT</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{dataCount2}</Text>
          </TouchableOpacity>

          </View>


        </View>
      </View>
    );
  };


  const Myjobs = () => {
    const navigation = useNavigation();
    const [jobs, setJobs] = useState([]);
    const [refDb, setRefDb] = useState(null);
    const [userId, setUserId] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const { setTodayTaskCount } = useTask();
  
    useEffect(() => {
      const fetchStorageData = async () => {
        try {
          const storedRefDb = await AsyncStorage.getItem("ref_db");
          const storedUserId = await AsyncStorage.getItem("secondaryId");
  
          if (storedRefDb) setRefDb(storedRefDb);
          if (storedUserId) setUserId(storedUserId);
        } catch (error) {
          console.error("Error fetching stored data:", error);
        }
      };
  
      fetchStorageData();
    }, []);
  
    const fetchJobs = useCallback(async (ref_db, userid) => {
      if (!ref_db || !userid) return;
  
      try {
        const [todayResponse, ongoingResponse] = await Promise.all([
          axios.get("https://app.nexis365.com/api/get-jobs", { params: { ref_db, userid, filter: "today" } }),
          axios.get("https://app.nexis365.com/api/get-jobs", { params: { ref_db, userid, filter: "ongoing" } })
        ]);
  
        const todayJobs = todayResponse.data.success ? todayResponse.data.jobs.map(job => ({ ...job, filter: "today" })) : [];
        const ongoingJobs = ongoingResponse.data.success ? ongoingResponse.data.jobs.map(job => ({ ...job, filter: "ongoing" })) : [];
  
        setJobs([...ongoingJobs,...todayJobs]);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    }, []);

     useEffect(() => {
    // Count tasks with filter "today" and pass to parent
    const todayTaskCount = jobs.filter(job => job.filter === "today").length;
    setTodayTaskCount(todayTaskCount);
  }, [jobs]);
  
    useEffect(() => {
      if (refDb && userId) {
        fetchJobs(refDb, userId);
      }
    }, [refDb, userId, fetchJobs]);
  
    useFocusEffect(
      useCallback(() => {
        if (refDb && userId) {
          fetchJobs(refDb, userId);
        }
      }, [refDb, userId])
    );
  
    const handleClockIn = async (job) => {
      try {
        const storedRefDb = await AsyncStorage.getItem("ref_db");
        const storedUserId = await AsyncStorage.getItem("secondaryId");
  
        if (!storedRefDb || !storedUserId) {
          console.error("Missing ref_db or userId");
          return;
        }
  
        const data = { ref_db: storedRefDb, userid: storedUserId, jobId: job.id };
        const response = await axios.post("https://app.nexis365.com/api/accept-job", data);
  
        if (response.data.success) {
          setJobs(prevJobs => prevJobs.map(j => j.id === job.id ? { ...j, accepted: 1 } : j));
          navigation.navigate("AttendanceRecord", { jobData: job });
        } else {
          console.error("Error accepting job");
        }
      } catch (error) {
        console.error("Error in handleClockIn:", error);
      }
    };
  
    const handleClockOut = (job) => {
      navigation.navigate("AttendanceRecord", { jobData: job, fromClockOut: true, });
    };

    const handleRowPress = (item) => {
      setExpandedRow(expandedRow === item.id ? null : item.id);
    };

    return (
      <View style={{ padding: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#333',marginBottom:10 }}>Today Shift</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyJobs')}>
          <Text style={{ fontSize: 16, textDecorationLine: "underline", color: "#21AFF0" }}>View Jobs</Text>
          </TouchableOpacity>
          </View>

          {jobs.length === 0 ? (
            // <View style={{padding: 20, alignItems: 'center'}}>
            <View style={{
              width: "100%",
              backgroundColor: theme === 'dark' ? '#444' : '#fff',
              padding: 16,
              borderRadius: 10,
              borderLeftWidth: 4,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 3,
              marginTop:10,
              alignItems: 'center', 
              borderLeftColor: '#dc3545'
            }}>
              <Text style={{fontSize: 16, color: theme === 'dark' ? '#fff' : '#808080', }}>No Data Found</Text>
            </View>
        ) : (
        jobs.map((item) => (
          <View key={item.id} style={{ marginBottom: 10 }}>
            <TouchableOpacity style={{
              width: "100%",
              backgroundColor: "#fff",
              padding: 16, 
              borderRadius: 10,
              borderLeftWidth: 4,
              borderLeftColor: item.filter === "today" ? "#6FCF97" : "#F2994A",
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 3,
            }}
            onPress={() => handleRowPress(item)}
            >
               <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{}}>
                <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Time</Text>
                <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{moment(item.stime).format("HH:mm")} - {moment(item.etime).format("HH:mm")}</Text>
              </View>

              <View>
              {item.filter === "today" && (
                <TouchableOpacity style={{
                  backgroundColor: "#28a745",
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 20,
                  alignSelf: "flex-start",
                }} onPress={() => handleClockIn(item)}>
                  <Text style={{ fontSize: 14, fontWeight: "bold", color: "#fff" }}>Clock In</Text>
                </TouchableOpacity>
              )}
              {item.filter === "ongoing" && (
                <TouchableOpacity style={{
                  marginTop: 10,
                  backgroundColor: "#dc3545",
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 20,
                  alignSelf: "center",
                }} onPress={() => handleClockOut(item)}>
                  <Text style={{ fontSize: 14, fontWeight: "bold", color: "#fff" }}>Clock Out</Text>
                </TouchableOpacity>
              )}
              </View>
              </View>
                {expandedRow === item.id && (
                  <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 14, color: '#333' }}>
                    Clockin Time:{' '}
                    {item.clockin
                     ? moment.unix(item.clockin).format('DD-MM-YYYY, h:mm A')
                     : 'N/A'}
                    </Text>
                    {console.log(
                   'Clockin Time:',
                    moment.unix(item.clockin).format('DD-MM-YYYY, h:mm A')
                    )}
                    <Text style={{ marginTop: 5, fontSize: 14, color: '#555' }}>
                      Task Detail
                    </Text>
                  </View>
                )}
            </TouchableOpacity>
          </View>
        ))
      )}
      </View>
    );
  };

  const TaskDesign = () => {
    const [tasks, setTasks] = useState([]);
    const [refDb, setRefDb] = useState(null);
    const [userId, setUserId] = useState(null);
    const [status, setStatus] = useState(0);
    const [activeMenuIndex, setActiveMenuIndex] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const { theme } = useTheme();
    const { setPendingTasksCount} = usePending();
  
    useEffect(() => {
      const fetchRefDbAndUserId = async () => {
        try {
          const storedRefDb = await AsyncStorage.getItem('ref_db');
          const storedUserId = await AsyncStorage.getItem('secondaryId');
  
          if (storedRefDb) {
            setRefDb(storedRefDb);
            fetchTasks(storedRefDb, status, storedUserId);
          }
          if (storedUserId) {
            setUserId(storedUserId);
          }
        } catch (error) {
          console.error('Error fetching ref_db or userId:', error);
        }
      };
  
      fetchRefDbAndUserId();
    }, []);
  
    const fetchTasks = async (ref_db, status, userId) => {
      try {
        const response = await axios.get('https://app.nexis365.com/api/get-tasks', {
          params: { ref_db, activity: status, userid: userId },
        });
        if (response.data.success) {
          setTasks(response.data.tasks);

           // Get total tasks count
      const  pendingCount = response.data.tasks.length;
           setPendingTasksCount(pendingCount);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
  
    const handleButtonClick = (statusValue) => {
      setStatus(statusValue);
      if (refDb && userId) {
        fetchTasks(refDb, statusValue, userId);
      }
    };

 
  
    const toggleMenu = (index) => {
      setActiveMenuIndex(activeMenuIndex === index ? null : index);
    };
  
    const handleRowPress = (index) => {
      setExpandedRow(expandedRow === index ? null : index);
    };
  
    const handleUpdateTaskStatus = async (taskId, newStatus) => {
      if (refDb && userId) {
        try {
          const response = await axios.post('https://app.nexis365.com/api/update-task-status', {
            ref_db: refDb,
            taskId,
            newStatus,
            userid: userId,
          });
  
          if (response.data.success) {
            Alert.alert('Success', 'Task status updated');
            fetchTasks(refDb, status, userId);
          } else {
            Alert.alert('Error', 'Failed to update task status');
          }
        } catch (error) {
          Alert.alert('Error', 'An error occurred while updating task status');
        }
      }
    };

    const styles = StyleSheet.create({
      container: { padding: 16 },
      heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 10,color: theme === 'dark' ? '#fff' : '#757575', },
      buttonRow: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginBottom: 10 },
      button: { backgroundColor: '#21AFF0', padding: 10, borderRadius: 5 },
      buttonText: { color: '#fff', fontWeight: 'bold' },
      card: 
      { 
        width: "100%",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
        borderLeftWidth: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginTop:10,
      },
      rowContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
      expandedText: { marginTop: 10, fontSize: 14, color: '#555' },
      menu: { position: 'absolute', right: 35, top: 15,  backgroundColor: theme === 'dark' ? '#333' : '#fff', padding: 10, borderRadius: 5, elevation: 5 },
      menuOption: { paddingVertical: 5 },
      menuOptionText: { fontSize: 14, color: theme === 'dark' ? '#fff' : '#757575', },
      noDataContainer: { padding: 20, alignItems: 'center' },
      noDataText: { fontSize: 16, color: theme === 'dark' ? '#fff' : '#808080', },
    });

    const formatDate = (timestamp) => {
      const date = new Date(timestamp * 1000);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };
  
    return (
      <TouchableWithoutFeedback onPress={() => setActiveMenuIndex(null)}>
        <View style={styles.container}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#333' }}>Today Tasks</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Task')}>
          <Text style={{ fontSize: 16, textDecorationLine: "underline", color: "#21AFF0" }}>View Tasks</Text>
          </TouchableOpacity>
          </View>
  
          {tasks.length === 0 ? (
            <View style={{
              width: "100%",
              backgroundColor: theme === 'dark' ? '#444' : '#fff',
              padding: 16,
              borderRadius: 10,
              borderLeftWidth: 4,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 3,
              marginTop:10,
              alignItems: 'center',
              borderLeftColor: '#dc3545'
            }}>
              <Text style={styles.noDataText}>No Data Found</Text>
            </View>
          ) : (
            tasks.map((task, index) => (
              <View key={index} style={[styles.card, { borderLeftColor: '#6FCF97', backgroundColor: theme === 'dark' ? '#444' : '#fff',position: 'relative', zIndex: activeMenuIndex === index ? 1000 : 1 }]}> 
                <TouchableOpacity onPress={() => handleRowPress(index)} style={styles.rowContainer}>
                 <View >
                 <Text style={{fontSize: 16, fontWeight: 'bold',color: theme === 'dark' ? '#fff' : '#757575',}}> {formatDate(task.date)}</Text>
                    <Text style={ { width: 250,marginLeft:5,fontSize: 16, color: theme === 'dark' ? '#fff' : '#757575',}}>
                   {task.title}
                  </Text>
                 </View>
                  <TouchableOpacity onPress={() => toggleMenu(index)}>
                    <MaterialIcons name="more-vert" size={20} color={theme === 'dark' ? '#fff' : '#000'} style={{alignItems:'flex-end'}} />
                  </TouchableOpacity>
                </TouchableOpacity>
                {expandedRow === index && <Text style={styles.expandedText}>{task.detail}</Text>}
                {activeMenuIndex === index && (
                  <View style={styles.menu}>
                   {[0, 1, 2, 3].map((menuStatus) => (
                         menuStatus !== status && (
                           <TouchableOpacity
                             key={menuStatus} 
                             style={styles.menuOption}
                             onPress={() => handleUpdateTaskStatus(task.id, menuStatus)}
                           >
                             <Text style={styles.menuOptionText}>
                               {menuStatus === 0 ? 'Pending' : menuStatus === 1 ? 'Processing' : menuStatus === 2 ? 'Completed' : 'On Hold'}
                             </Text>
                           </TouchableOpacity>
                         )
                       ))}
                   </View>
                )}
              </View>
            ))
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };
  
  const TimeSheet = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const ref_db = await AsyncStorage.getItem("ref_db");
      const userid = await AsyncStorage.getItem("secondaryId");

      if (!ref_db || !userid) return;

      const response = await axios.get("https://app.nexis365.com/api/get-jobs", {
        params: { ref_db, userid, filter: "completed" },
      });

      if (response.data.success) {
        setAttendanceData(response.data.jobs);
      } else {
        setAttendanceData([]);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const calculateTotalTime = (clockIn, clockOut) => {
    if (!clockIn || !clockOut) return "N/A";
    const duration = moment.duration(moment.unix(clockOut).diff(moment.unix(clockIn)));
    return `${duration.hours()}h ${duration.minutes()}m`;
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme === "dark" ? "#333" : "#fff", padding: 16 },
    title: { fontSize: 22, fontWeight: "bold", marginVertical: 10, color: theme === "dark" ? "#fff" : "#757575" },
    card: {  backgroundColor: theme === 'dark' ? '#444' : '#f9f9f9', padding: 8, borderRadius: 10, marginBottom: 8, elevation: 2, },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5, },
    label: { fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#fff' : '#333', flex: 1, textAlign: 'justify' },
    value: { fontSize: 16, color: theme === 'dark' ? '#fff' : '#333', flex: 1, textAlign: 'justify'  },
  });
  

  return (
    <ScrollView style={styles.container}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#333',marginBottom:10}}>TimeSheet</Text>

      {attendanceData.slice(0, 10).map((item, index) => {
        const clockInTimestamp = item.clockin ? moment.unix(item.clockin).tz("Australia/Sydney") : null;
        const clockOutTimestamp = item.clockout ? moment.unix(item.clockout).tz("Australia/Sydney") : null;

        const clockInTime = clockInTimestamp ? clockInTimestamp.format("HH:mm:ss") : "N/A";
        const clockOutTime = clockOutTimestamp ? clockOutTimestamp.format("HH:mm:ss") : "N/A";
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
      })}
    </ScrollView>
  );
  };

  const RecentActivity = () => {
    const [activityData, setActivityData] = useState([]);
    const { theme } = useTheme();
  
    useEffect(() => {
      fetchRecentActivity();
    }, []);
  
    const fetchRecentActivity = async () => {
      try {
        const ref_db = await AsyncStorage.getItem("ref_db");
        const userid = await AsyncStorage.getItem("secondaryId");
  
        if (!ref_db || !userid) return;
  
        const response = await axios.get("https://app.nexis365.com/api/recent-activity", {
          params: { ref_db, userid },
        });

        console.log("Recent Activity:", response.data);
  
        if (response.data.success) {
          setActivityData(response.data.activities);
        } else {
          setActivityData([]); 
        }
      } catch (error) {
        console.error("Error fetching recent activity data:", error);
      }
    };
  
    const styles = StyleSheet.create({
      container: { flex: 1, backgroundColor: theme === "dark" ? "#333" : "#fff", padding: 10,marginBottom:80 },
      title: { fontSize: 22, fontWeight: "bold", marginVertical: 10, color: theme === "dark" ? "#fff" : "#757575" },
      card: { backgroundColor: theme === 'dark' ? '#444' : '#fff', padding: 12, borderRadius: 10, marginBottom: 10, elevation: 2 },
      row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
      label: { fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#fff' : '#000',},
      value: { fontSize: 16, color: theme === 'dark' ? '#fff' : '#000', },
    });

        // Format timestamp to readable date (DD/MM/YYYY format)
      const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-AU"); // Australian date format (DD/MM/YYYY)
      };
    
    return (
      <ScrollView style={styles.container}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#333', marginBottom:10}}>Recent Activity</Text>
  
        {activityData.slice(0, 10).map((item, index) => {
  
          return (
            <View key={index} style={styles.card}>
              <View style={{ flex: 1, }}>
                <View style={[styles.row,{alignItems:'center'}]}>
                  <Text style={styles.value}>{formatDate(item.date)}</Text>
                  <Text style={styles.value}>{item.tran_type}</Text>
                </View>
                <Text>
                <Text style={styles.label}>Note:</Text>
                  <Text style={styles.value}> {item.note}</Text>
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  const PaySlips = () => {
    const headers = [
      "Payroll Date",
      "Payslip ID",
      "Account",
      "Total Paid",
    ];
  
    const data = [
      { id: "1", payrollDate: "2025-03-01", payslipId: "PS001", account: "John Doe", totalPaid: "$1500" },
      { id: "2", payrollDate: "2025-03-02", payslipId: "PS002", account: "John Doe", totalPaid: "$1800" },
      { id: "3", payrollDate: "2025-03-03", payslipId: "PS003", account: "John Doe", totalPaid: "$2000" },
      { id: "4", payrollDate: "2025-03-04", payslipId: "PS004", account: "John Doe", totalPaid: "$1700" },
      { id: "5", payrollDate: "2025-03-05", payslipId: "PS005", account: "John Doe", totalPaid: "$1600" },
    ];
  
    return (
      <View style={{padding:10}} >
         <Text style={{  fontSize: 18, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#333',marginBottom:10 }}>Pay Slips</Text>
        <View
          style={{
            flexDirection: "row",
             backgroundColor: theme === 'dark' ? '#444' : '#f5f5f5',
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
          }}
        >
          {headers.map((header, index) => (
            <TouchableOpacity
              key={index}
              style={{ flex: 1, flexDirection: "row", alignItems: "center", }}
            >
              <Text style={{ fontSize:12,padding:5,fontWeight: "bold", marginRight: 3 , color: theme === 'dark' ? '#fff' : '#000',}}>{header}</Text>
              <Icon name="sort" size={14} style={{color: theme === 'dark' ? '#fff' : '#000',}} />
            </TouchableOpacity>
          ))}
        </View>
        {/* {data.map((item) => (
          <View
            key={item.id}
            style={{
              flexDirection: "row",
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
              alignItems:'center'
            }}
          >
            <Text style={{ flex: 1, textAlign:'justify', color: theme === 'dark' ? '#fff' : '#757575' }}>{item.payrollDate}</Text>
            <Text style={{ flex: 1, textAlign:'justify', marginLeft:8, color: theme === 'dark' ? '#fff' : '#757575' }}>{item.payslipId}</Text>
            <Text style={{ flex: 1, textAlign:'justify', color: theme === 'dark' ? '#fff' : '#757575' }}>{item.account}</Text>
            <Text style={{ flex: 1, textAlign:'justify', marginLeft:10 , color: theme === 'dark' ? '#fff' : '#757575' }}>{item.totalPaid}</Text>
          </View>
        ))} */}
         <View style={{
              width: "100%",
              backgroundColor: theme === 'dark' ? '#444' : '#fff',
              padding: 16,
              borderRadius: 10,
              borderLeftWidth: 4,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 3,
              marginTop:10,
              alignItems: 'center', 
              borderLeftColor: '#dc3545'
            }}>
              <Text style={{fontSize: 16, color: theme === 'dark' ? '#fff' : '#000', }}>No Data Found</Text>
            </View>
      </View>
    );
  };



  const renderContent = () => {
    return (
      <View style={{ flex: 1 }}>
      <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={{
          backgroundColor: theme === 'dark' ? '#333' : '#fff',
        }}
      >
        {GreetingHeader()}
        {DashboardAttendance()}
        {Myjobs()}
        {TaskDesign()}
        {TimeSheet()} 
        {PaySlips()} 
        {RecentActivity()} 
        {dataLoaded ? renderWebviews() : null}
      </ScrollView>
      </View>
    );
  };


  return <View style={{flex: 1}}>{renderContent()}</View>;
};

export default Dashboard;
