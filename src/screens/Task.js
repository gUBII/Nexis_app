import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { components } from '../components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useTheme } from '../constants/ThemeContext';

const { width } = Dimensions.get('window');

const Task = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [refDb, setRefDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState(0);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const {theme} = useTheme();

  useEffect(() => {
    const fetchRefDbAndUserId = async () => {
      try {
        const storedRefDb = await AsyncStorage.getItem('ref_db');
        const storedUserId = await AsyncStorage.getItem('secondaryId'); // Fetch userId

        console.log('Fetched ref_db:', storedRefDb); 
        console.log('Fetched userId:', storedUserId); 

        if (storedRefDb) {
          setRefDb(storedRefDb);
          fetchTasks(storedRefDb, status, storedUserId); // Pass userId to the fetch function
        }
        if (storedUserId) {
          setUserId(storedUserId); // Set userId in state
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
        params: { ref_db, activity: status, userid: userId }, // Pass userId as a query param
      });
      if (response.data.success) {
        setTasks(response.data.tasks);
        console.log('Updated get tasks:', response.data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleButtonClick = (statusValue) => {
    console.log('Button clicked with status:', statusValue);
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

  const handleOutsidePress = () => {
    setActiveMenuIndex(null);
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    if (refDb && userId) {
      try {
        const response = await axios.post('https://app.nexis365.com/api/update-task-status', {
          ref_db: refDb,
          taskId,
          newStatus,
          userid: userId, // Send userId with the update request
        });

        console.log('API Response:', response.data);

        if (response.data.success) {
          alert('Task status updated');
          fetchTasks(refDb, status, userId); // Fetch tasks again after updating
        } else {
          alert('Failed to update task status');
        }
      } catch (error) {
        console.error('Error updating task status:', error);
        alert('An error occurred while updating task status');
      }
    }
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
      marginTop:10,
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
      color: theme === 'dark' ? '#fff' : '#000',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      gap: 10,
    },
    button: {
      backgroundColor: '#21AFF0',
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 5,
      color: theme === 'dark' ? '#fff' : '#000',
    },
    buttonText: {
      color: theme === 'dark' ? '#fff' : '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    tableContainer: {
      marginTop: 20,
      borderRadius: 8,
      marginHorizontal: 10,
      marginBottom: 20,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#F9F9F9',
      elevation: 4, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: theme === 'dark' ? '#2A2A2A' : '#EAEAEA',
      paddingVertical: 12,
      paddingHorizontal: 15,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#444' : '#CFCFCF',
    },
    tableHeaderText: {
      flex: 3,
      fontWeight: 'bold',
      fontSize: 14,
      color: theme === 'dark' ? '#F1F1F1' : '#333',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    tableRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#333' : '#DDD',
      backgroundColor: theme === 'dark' ? '#252525' : '#FFF',
    },
    tableCell: {
      flex: 3,
      color: theme === 'dark' ? '#E0E0E0' : '#333',
      fontSize: 15,
    },
    moreButton: {
      flex: 0.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menu: {
      position: 'absolute',
      top: -5,
      left: '46%',
      backgroundColor: theme === 'dark' ? '#2A2A2A' : '#FFF',
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#444' : '#CCC',
      borderRadius: 5,
      padding: 5,
      width: 150,
      zIndex: 1000,
      elevation: 10,
    },
    menuOption: {
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    menuOptionText: {
      fontSize: 14,
      color: theme === 'dark' ? '#FFF' : '#000',
    },
    expandedRow:{
      padding:15,
    },
  });

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        {renderHeader()}
        <Text style={styles.title}>Task Table</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonClick(0)}>
            <Text style={styles.buttonText}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonClick(1)}>
            <Text style={styles.buttonText}>Processing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonClick(2)}>
            <Text style={styles.buttonText}>Completed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonClick(3)}>
            <Text style={styles.buttonText}>On Hold</Text>
          </TouchableOpacity>
        </View>

        {/* Table Section */}
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Date</Text>
              <Text style={styles.tableHeaderText}>Task</Text>
            </View>

              {tasks.length === 0 ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, color: theme === 'dark' ? '#fff' : '#333' }}>
                    No Data Found
                  </Text>
                </View>
              ) : (
                tasks.map((task, index) => (
                   <View key={index} style={{position: 'relative', zIndex: activeMenuIndex === index ? 1000 : 1 }} >
                                {/* Table Row */}
                                <TouchableOpacity 
                                  onPress={() => handleRowPress(index)}
                                  style={styles.tableRow}
                                >
                                  <Text style={styles.tableCell}>{task.start}</Text>
                                  <Text style={styles.tableCell}>{task.title}</Text>
                                  <TouchableOpacity
                                    style={styles.moreButton}
                                    onPress={() => toggleMenu(index)}
                                  >
                                    <MaterialIcons name="more-vert" size={20} style={{color: theme === 'dark' ? '#fff' : '#000'}} />
                                  </TouchableOpacity>
                                </TouchableOpacity>
                          
                                {/* Expanded Row Detail (Shown Below the Row) */}
                                {expandedRow === index && (
                                  <View style={styles.expandedRow}>
                                    <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>{task.detail}</Text>
                                  </View>
                                )}
                          
                                {/* Dropdown Menu (Options) */}
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
      </View>
    </TouchableWithoutFeedback>
  );
}



export default Task;