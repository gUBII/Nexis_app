import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import BottomTabBar from './tabs/BottomTabBar';
import { components } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from 'axios';

const EditCases = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { cases } = route.params;
  const [title, setTitle] = useState(cases.title || '');
  const [detail, setDetail] = useState(cases.detail || '');
  const [documentFile, setDocumentFile] = useState(null);
  const [date, setDate] = useState(new Date(cases.date * 1000));
  const [showDatePicker, setShowDatePicker] = useState(false);


        const onDateChange = (event, selectedDate) => {
            if (selectedDate) setDate(selectedDate);
            setShowDatePicker(Platform.OS === 'ios');
        };

  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      setDocumentFile(res);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Failed to pick document');
      }
    }
  };

  const handleUpdate = async () => { 
    const ref_db = await AsyncStorage.getItem('ref_db');
    const userid = await AsyncStorage.getItem('secondaryId');

    const formData = new FormData();
    formData.append('ref_db', ref_db);
    formData.append('userid', userid);
    formData.append('id', String(cases.id));
    formData.append('title', title);
    formData.append('detail', detail);
    formData.append('date', String(Math.floor(date.getTime() / 1000)));

    if (documentFile) {
      formData.append('document', {
        uri: documentFile.uri,
        type: documentFile.type, 
        name: documentFile.name,
      });
    }

    try {
      const response = await axios.post(
        'https://app.nexis365.com/api/update-cases',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Updated", "Cases updated successfully");
        navigation.goBack();
      } else {
        Alert.alert("Error", response.data.message || "Failed to update Cases");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const renderHeader = () => {
    return (
      <components.Header
        logo={false}
        goBack={true}
        creditCard={true}
      />
    );
  };

  return (
    <View style={{ backgroundColor: theme === 'dark' ? '#333' : '#fff', flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderHeader()}
        <View style={styles.container}>
          <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Title</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme === 'dark' ? '#555' : '#f0f0f0', color: theme === 'dark' ? '#fff' : '#000' }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title"
            placeholderTextColor={theme === 'dark' ? '#ccc' : '#888'}
          />

          <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Detail</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme === 'dark' ? '#555' : '#f0f0f0', color: theme === 'dark' ? '#fff' : '#000' }]}
            value={detail}
            onChangeText={setDetail}
            placeholder="Enter details"
            placeholderTextColor={theme === 'dark' ? '#ccc' : '#888'}
            multiline
            numberOfLines={4}
          />

          <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text style={{ color: theme === 'dark' ? '#fff' : '#000', paddingTop: 4, paddingBottom: 4 }}>
          Date: {date.toDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}


          <TouchableOpacity style={styles.button} onPress={handlePickDocument}>
            <Text style={styles.buttonText}>
              {documentFile ? documentFile.name : 'Pick Document'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
            <Text style={styles.submitButtonText}>Update Cases</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomTabBar />
    </View>
  );
};

export default EditCases;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
