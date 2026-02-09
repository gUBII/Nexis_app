import React, { useState, useEffect, useCallback } from "react";
import { View,ScrollView , Text, TouchableOpacity, StyleSheet, Dimensions, TouchableWithoutFeedback } from "react-native";
import { components } from "../components";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../constants/ThemeContext";

const { width } = Dimensions.get("window");

const Myjob = () => {
  const navigation = useNavigation();
  const [jobs, setJobs] = useState([]);
  const [refDb, setRefDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("today"); 
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const {theme} = useTheme();

  const toggleMenu = (index) => {
    setActiveMenuIndex(activeMenuIndex === index ? null : index);
  };

  useEffect(() => {
    setActiveMenuIndex(null); // Close any open menus when filter changes
  }, [activeFilter]);
  

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

  const fetchJobs = useCallback(async (ref_db, userid, filter) => {
    if (!ref_db || !userid) return;

    console.log('refDb job:', refDb, 'userId job:', userId, 'activeFilter job:', activeFilter);

    try {
      const response = await axios.get("https://app.nexis365.com/api/get-jobs", {
        params: { ref_db, userid, filter },
      });

      console.log("API Response for get-jobs:", response.data);
    
      if (response.data.success) {
        if (response.data.jobs.length === 0) {
          console.log("No jobs found for the given filter.");
        }
        setJobs(response.data.jobs);
      } else {
        console.error("API Response Error:", response.data.message || "Unknown Error");
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }, []);

  useEffect(() => {
    if (refDb && userId) {
      fetchJobs(refDb, userId, activeFilter);
    }
  }, [refDb, userId, activeFilter, fetchJobs]);


  const handleAcceptJob = async (jobId) => {
    try {
      const storedRefDb = await AsyncStorage.getItem("ref_db");
      const storedUserId = await AsyncStorage.getItem("secondaryId");
  
      if (!storedRefDb || !storedUserId) {
        console.error("Missing ref_db or userId");
        return;
      }
  
      const data = {
        ref_db: storedRefDb,
        userid: storedUserId,
        jobId,
      };
      console.log("Sending API request with data for job:", data);
  
      const response = await axios.post("https://app.nexis365.com/api/accept-job", data);
  
      console.log("API Response of Accept-Job:", response);
  
      if (response.data.success) {
        console.log("Job accepted successfully");
  
        // Update local jobs state to reflect the change instantly
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, accepted: 1 } : job
          )
        );
      } else {
        console.error("Error accepting job");
      }
    } catch (error) {
      console.error("Error in handleAcceptJob:", error);
    }
  };
  
  
    // Function to close menu when clicking outside
    const handleOutsidePress = () => {
      setActiveMenuIndex(null);
    };


    const styles = StyleSheet.create({
      container: { flex:1, backgroundColor: theme === 'dark' ? '#333' : '#fff', },
      title: { fontSize: 20, paddingLeft:24, marginTop:10 , fontWeight: "bold", marginBottom: 10, color: theme === 'dark' ? '#fff' : '#000' },
      buttonRow: { flexDirection: "row", justifyContent: "center", alignItems: 'center', gap: 10, paddingHorizontal: 20, },
      button: {  backgroundColor: "#21AFF0", paddingVertical: 8, paddingHorizontal: 10, borderRadius: 5 },
      activeButton: { backgroundColor: "#0056b3" },
      buttonText: { color: theme === 'dark' ? '#fff' : '#fff', fontSize: 14, fontWeight: "bold" },
      tableContainer: {
        marginTop: 20,
        borderRadius: 8,
        marginHorizontal: 10,
        marginBottom: 20,
        backgroundColor: theme === 'dark' ? '#444' : '#F9F9F9',
        elevation: 4, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      tableHeader: {
        flexDirection: 'row',
        backgroundColor: theme === 'dark' ? '#555' : '#EAEAEA',
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
        backgroundColor: theme === 'dark' ? '#444' : '#FFF',
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
      noDataText: { textAlign: "center", marginTop: 20, fontSize: 16, marginBottom:20 ,   color: theme === 'dark' ? '#E0E0E0' : '#333', },
      menu: {
        position: 'absolute',
        top: -5,
        left: '52%',
        backgroundColor: theme === 'dark' ? '#2A2A2A' : '#FFF',
        borderWidth: 1,
        borderColor: theme === 'dark' ? '#444' : '#CCC',
        borderRadius: 5,
        padding: 5,
        width: 150,
        zIndex: 1000,
        elevation: 5,
      },
      menuItem: { color: theme === 'dark' ? '#fff' : '#000', }
    });
    
  


  return (
    <ScrollView style={{marginBottom:100}}  onPress={handleOutsidePress}>
      <View style={styles.container}>
        {/* <components.Header logo={false} goBack={true} creditCard={true} /> */}
        <Text style={styles.title}>My Jobs</Text>

        {/* Filter Buttons */}
        <View style={styles.buttonRow}>
          {["today", "ongoing", "upcoming", "completed"].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.button, activeFilter === filter && styles.activeButton]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={styles.buttonText}>{filter.charAt(0).toUpperCase() + filter.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Job Table */}
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>ClockIn</Text>
            <Text style={styles.tableHeaderText}>ClockOut</Text>
            <Text style={styles.tableHeaderText}>Client</Text>
          </View>

          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <View key={index} style={{position: 'relative', zIndex: activeMenuIndex === index ? 1000 : 1 }} >
              <TouchableOpacity style={styles.tableRow}>
                <Text style={styles.tableCell}>{activeFilter === "today" ? moment(job.stime).format("HH:mm") : job.stime}</Text>
                <Text style={styles.tableCell}>{activeFilter === "today" ? moment(job.etime).format("HH:mm") : job.etime}</Text>
                <Text style={styles.tableCell}>{job.client_name || "Unknown Client"}</Text>
                <TouchableOpacity style={styles.moreButton} onPress={() => toggleMenu(index)} >
                  <MaterialIcons name="more-vert" size={20} style={{color: theme === 'dark' ? '#fff' : '#000',}} />
                </TouchableOpacity>
                {activeMenuIndex === index && (
                  <View style={styles.menu}>

                        {activeFilter === "today" && (
                          <View style={{ flexDirection: "column", gap: 10 }}>
                            {job.accepted === 0 ? (
                              <TouchableOpacity onPress={() => handleAcceptJob(job.id)}>
                                <Text style={styles.menuItem}>Accept</Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity onPress={() => navigation.navigate("AttendanceRecord", { jobData: job })}>
                              <Text style={styles.menuItem}>ClockIn</Text>
                            </TouchableOpacity>
                            )}
                            <TouchableOpacity>
                              <Text style={styles.menuItem}>Request</Text>
                            </TouchableOpacity>
                          </View>
                        )}


                    {activeFilter === "ongoing" && ( 
                      <TouchableOpacity onPress={() => navigation.navigate("AttendanceRecord", { jobData: job, fromClockOut: true, })}>
                        <Text style={styles.menuItem}>ClockOut</Text>
                      </TouchableOpacity>
                    )}
                    {activeFilter === "upcoming" && (
                      <TouchableOpacity >
                        <Text style={styles.menuItem}>Request</Text>
                      </TouchableOpacity>
                    )}
                    {activeFilter === "completed" && (
                      <TouchableOpacity onPress={() => navigation.navigate("TimeSheet")}>
                        <Text style={styles.menuItem}>Timesheet</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No jobs found</Text>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
}



export default Myjob;
