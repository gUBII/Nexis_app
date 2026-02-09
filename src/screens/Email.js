import React, { useState,  useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TextInput, ScrollView, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { components } from '../components';
import { useTheme } from '../constants/ThemeContext';
import BottomTabBar from './tabs/BottomTabBar';
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather';

const Email = ({route, navigation }) => {
  const { theme } = useTheme();
  const { leads } = route.params;
  const [logId, setLogId] = useState(leads.id);
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [document, setDocument] = useState(null);
  const [status, setStatus] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({})
  const [documentFile, setDocumentFile] = useState(null);
  const [tab, setTab] = useState('create'); 
  const [emails, setEmails] = useState([]); 

  const handleEmailEdit = (emailItem) => {
    navigation.navigate('EditEmail', { emails: emailItem });
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) setDate(selectedDate);
    setShowDatePicker(Platform.OS === 'ios');
  };

  const handleDocumentPick = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], 
      });
  
      console.log(res);
      setDocumentFile(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Unknown error: ', err);
      }
    }
  };

  const handleEmailSubmit = async () => {
    const ref_db = await AsyncStorage.getItem('ref_db');
    const userid = await AsyncStorage.getItem('secondaryId');
  
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('userid', userid); 
    formDataToSubmit.append('ref_db', ref_db);
    formDataToSubmit.append('logid', leads.id);  
    formDataToSubmit.append('date', Math.floor(date.getTime() / 1000));  
    formDataToSubmit.append('title', title);
    formDataToSubmit.append('detail', description);
    formDataToSubmit.append('status', status);
    // Include client_response and log_type
    formDataToSubmit.append('client_response', 1);
    formDataToSubmit.append('log_type', 'EMAIL');

    if (documentFile) {
        formDataToSubmit.append('document', {
          uri: documentFile.uri,
          type: documentFile.type,
          name: documentFile.name, 
        });
      }
        
  
    try {
      const response = await axios.post('https://app.nexis365.com/api/email', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data.success) {
        Alert.alert('Success', 'Email log saved successfully!');
        // **Clear fields after successful submit**
        setTitle('');
        setDescription('');
        setStatus('');
        setDocument(null);
        setDate(new Date()); 
        setShowDatePicker(false);
        // navigation.goBack(); 
      } else {
        Alert.alert('Error', response.data.message || 'Failed to save email log.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };
  
   useFocusEffect(
      useCallback(() => {
        const fetchEmails = async () => {
          const ref_db = await AsyncStorage.getItem("ref_db");
          const userid = await AsyncStorage.getItem("secondaryId");
    
          if (!ref_db || !userid) return;
    
          try {
            const response = await axios.get("https://app.nexis365.com/api/get-emails", {
              params: { ref_db, userid }
            });
    
            if (response.data.success) {
              setEmails(response.data.data);
            }
          } catch (error) {
            console.error("Failed to fetch campaigns:", error);
          }
        };
    
        fetchEmails();
      }, [])
    );

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
        <View style={styles.tabContainer}>
         <TouchableOpacity
            style={[styles.tabButton, tab === 'create' && styles.activeTabButton]}
            onPress={() => setTab('create')}
           >
            <Text style={[styles.tabButtonText, tab === 'create' && styles.activeTabButtonText]}>Create Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, tab === 'view' && styles.activeTabButton]}
            onPress={() => setTab('view')}
          >
            <Text style={[styles.tabButtonText, tab === 'view' && styles.activeTabButtonText]}>View Email</Text>
           </TouchableOpacity>
        </View>

        {tab === 'create' ? (
            <>

                <ScrollView style={styles.container}>
                 <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Log ID:</Text>
                 <TextInput
                    style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
                    value={logId ? logId.toString() : ''}
                    onChangeText={setLogId}
                    editable={false}
                    placeholder="Log ID"
                    placeholderTextColor="#aaa"
                 />

                 <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Date:</Text>
      
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

                    <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Title:</Text>
                    <TextInput
                        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter Title"
                        placeholderTextColor="#aaa"
                    />

                    <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Description:</Text>
                    <TextInput
                        style={[styles.textarea, { color: theme === 'dark' ? '#fff' : '#000' }]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter Description"
                        placeholderTextColor="#aaa"
                        multiline
                        numberOfLines={4}
                    />

          <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Document:</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={handleDocumentPick}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Upload Document</Text>
          </TouchableOpacity>

          <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Status:</Text>
          <components.Dropdown
            items={[
              { label: 'Select Status', value: '' },
              { label: 'Active', value: '1' },
              { label: 'Suspend', value: '0' },
            ]}
            selectedValue={status}
            onValueChange={(value) => setStatus(value)}
            style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleEmailSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text> 
          </TouchableOpacity>
        </ScrollView>
            </>
            ) : (
    <View style={{ marginTop: 20 }}>
      {emails.length === 0 ? (
      <Text style={{ textAlign: 'center', color: theme === 'dark' ? '#fff' : '#000', fontSize: 16 }}>
          No Emails Found
      </Text>
      ) : (
      emails.map((emailItem, index) => (
      <View
        key={index}
        style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#55CBF5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: theme === 'dark' ? '#444' : '#f9f9f9',
        }}
        >
        {/* Left side content */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#000' }}>
            Log ID: {emailItem.logid}
          </Text>
          <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
            Date: {new Date(emailItem.date * 1000).toLocaleDateString()}
          </Text>
          <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
            Title: {emailItem.title}
          </Text>
          <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
            Detail: {emailItem.detail}
          </Text>
        </View>
            
        {/* Edit button */}
        <TouchableOpacity
          onPress={() => handleEmailEdit(emailItem)}
          style={{
            padding: 8,  
            backgroundColor: '#55CBF5',
            borderRadius: 30,
            marginLeft: 10,
          }}
          >
          <Icon name="edit-3" size={20} color="#fff" />
          </TouchableOpacity>
          </View>
          ))
            
          )}

          </View>
        )}
      </ScrollView>
      <BottomTabBar />
    </View>
  );
};

export default Email;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  container: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: '#55CBF5',
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
  },
  textarea: {
    borderWidth: 2,
    borderColor: '#55CBF5',
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
    textAlignVertical: 'top', // for Android to align text at top
  },
  uploadButton: {
    backgroundColor: '#21AFF0',
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#21AFF0',
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop:30,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#eee',
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: '#21AFF0',
  },
  tabButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  activeTabButtonText: {
    color: '#fff',
  },
  
});
