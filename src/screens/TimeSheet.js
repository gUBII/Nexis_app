import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import moment from "moment";
import { components } from "../components";
import { useTheme } from "../constants/ThemeContext";

const { width } = Dimensions.get("window");

const Timesheet = () => {
  const [jobs, setJobs] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const { theme } = useTheme();

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      try {
        const ref_db = await AsyncStorage.getItem("ref_db");
        const userid = await AsyncStorage.getItem("secondaryId");

        if (!ref_db || !userid) return;

        const response = await axios.get("https://app.nexis365.com/api/get-jobs", {
          params: { ref_db, userid, filter: "completed" },
        });

        if (response.data.success) {
          setJobs(response.data.jobs);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Error fetching completed jobs:", error);
      }
    };

    fetchCompletedJobs();
  }, []);

  const toggleImage = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle current row visibility
    }));
  };

  const calculateTotalTime = (clockIn, clockOut) => {
    if (!clockIn || !clockOut) return "N/A";
    const duration = moment.duration(moment.unix(clockOut).diff(moment.unix(clockIn)));
    return `${duration.hours()}h ${duration.minutes()}m`;
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme === "dark" ? "#333" : "#fff" },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: theme === "dark" ? "#fff" : "#000" },
    tableHeader: { flexDirection: "row", backgroundColor: theme === "dark" ? "#2A2A2A" : "#EAEAEA", padding: 12, borderRadius: 5 },
    tableHeaderText: { flex: 3, fontWeight: "bold", fontSize: 14, color: theme === "dark" ? "#F1F1F1" : "#333" },
    tableRow: { flexDirection: "row", alignItems: "center", padding: 14, borderBottomWidth: 1, borderBottomColor: theme === "dark" ? "#444" : "#DDD" },
    tableCell: { flex: 3, fontSize: 14, color: theme === "dark" ? "#E0E0E0" : "#333" },
    noDataText: { textAlign: "center", marginTop: 20, fontSize: 16, color: theme === "dark" ? "#E0E0E0" : "#333" },
    viewImageButton: { color: theme === "dark" ? "#00B0FF" : "#007BFF", fontSize: 14, marginTop: 10 },
    imageContainer: { alignItems: "center", marginVertical: 8 },
    image: { width: 200, height: 200, borderRadius: 10, borderWidth: 1, borderColor: "#ccc" },
    imageLabel:{color: theme === 'dark' ? '#fff' : '#757575',}
  });

  return (
    <View style={styles.container}>
      <components.Header logo={false} goBack={true} creditCard={true} />
      <View style={{ padding: 15 }}>
        <Text style={styles.title}>Timesheet</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>ClockIn</Text>
          <Text style={styles.tableHeaderText}>ClockOut</Text>
          <Text style={styles.tableHeaderText}>Total Time</Text>
          <Text style={styles.tableHeaderText}>View Image</Text>
        </View>
        {jobs.length > 0 ? (
          jobs.map((item, index) => (
            <View key={item.id}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{moment.unix(item.clockin).format("HH:mm")}</Text>
                <Text style={styles.tableCell}>{moment.unix(item.clockout).format("HH:mm")}</Text>
                <Text style={styles.tableCell}>{calculateTotalTime(item.clockin, item.clockout)}</Text>
                <TouchableOpacity onPress={() => toggleImage(index)}>
                  <Text style={styles.viewImageButton}>{expandedRows[index] ? "Hide Image" : "View Image"}</Text>
                </TouchableOpacity>
              </View>

              {/* Image Rows */}
              {expandedRows[index] && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10}}>
                  {item.image_in && (
                    <View style={styles.imageContainer}>
                      <Text style={styles.imageLabel}>ClockIn Image</Text>
                      <Image source={{ uri: item.image_in }} style={styles.image} />
                    </View>
                  )}
                  {item.image_out && (
                    <View style={styles.imageContainer}>
                      <Text style={styles.imageLabel}>ClockOut Image</Text>
                      <Image source={{ uri: item.image_out }} style={styles.image} />
                    </View>
                  )}
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No completed jobs found</Text>
        )}
      </View>
    </View>
  );
};

export default Timesheet;
