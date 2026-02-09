import React, { useEffect, useState } from 'react';
import { components } from '../components';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateTimePicker from "@react-native-community/datetimepicker"; 
import DocumentPicker from 'react-native-document-picker';

const AddDocument = ({ theme }) => {
    const [modulesOptions, setModulesOptions] = useState([]);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [documentFiles, setDocumentFiles] = useState([]);
    const [formData, setFormData] = useState({
      documentName: '', 
      parentsmoduleid:'',
      cardNumber:'',
      status:'ON',
    });

    const onDateChange = (event, selectedDate) => {
      if (selectedDate) setDate(selectedDate);
      setShowDatePicker(Platform.OS === 'ios');
    };

    const handleDocumentPick = async () => {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
          allowMultiSelection: true, 
        });
  
        console.log('Selected documents:', res);
        setDocumentFiles(res); 
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          console.log('User cancelled the picker');
        } else {
          console.error('Unknown error: ', err);
          Alert.alert('Error', 'An error occurred while picking the document.');
        }
      }
    };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const ref_db = await AsyncStorage.getItem("ref_db");
        const userid = await AsyncStorage.getItem("secondaryId");
  
        if (!ref_db || !userid) return;
  
        const response = await axios.get("https://app.nexis365.com/api/get-parents-modules", {
          params: { ref_db, userid },  
        }); 
  
        if (response.data.success) {
          const modules = response.data.data;
          console.log("Fetched Modules:", modules); 
  
          const options = modules.map((item) => ({
            label: item.name,
            value: String(item.id),
          }));
          
  
          setModulesOptions([{ label: 'Select Category', value: '' }, ...options]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchModules();
  }, []);

  const handleSubmit = async () => {
    const ref_db = await AsyncStorage.getItem('ref_db');
    const userid = await AsyncStorage.getItem('secondaryId');
  
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('userid', userid);  
    formDataToSubmit.append('ref_db', ref_db);
    formDataToSubmit.append('documentName', formData.documentName);  
    formDataToSubmit.append('parentsmoduleid', formData.parentsmoduleid);  
    formDataToSubmit.append('date', String(Math.floor(date.getTime() / 1000)));  
    formDataToSubmit.append('cardNumber', formData.cardNumber? formData.cardNumber:'');
    formDataToSubmit.append('status', formData.status);

    if (documentFiles && documentFiles.length > 0) {
      documentFiles.forEach((file) => {
        formDataToSubmit.append('document', { 
          uri: file.uri,
          type: file.type, 
          name: file.name, 
        });
      });
    }
       
   
    try {
      const response = await axios.post('https://app.nexis365.com/api/documents-form', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',  
        },
      });
  
      if (response.data.success) {
        Alert.alert('Success', 'Documents log saved successfully!'); 
      } else {
        Alert.alert('Error', response.data.message || 'Failed to save documents log.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };


  


  return (
    <View style={[styles.formContainer, { backgroundColor: theme === 'dark' ? '#333' : '#fff'}]}>
      <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Document Name:</Text>
         <TextInput
              placeholder="Document Name"
              placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
              value={formData.documentName}
              onChangeText={(text) => handleChange('documentName', text)}
              style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
            />
        <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Select Category:</Text>
         <components.Dropdown
           items={modulesOptions}
           selectedValue={formData.parentsmoduleid}
           onValueChange={(value) => 
            setFormData((prevData) => ({ ...prevData, parentsmoduleid: value })) 
          }
          style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
        />

         <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Document:</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={handleDocumentPick}>
            <Text style={{ color: theme === 'dark' ? '#fff' : '#000', textAlign: 'center' }}>Upload Document</Text>
          </TouchableOpacity>

        <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Card Number (Optional)</Text>
         <TextInput
              placeholder="Card Number"
              placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
              value={formData.cardNumber}
              onChangeText={(text) => handleChange('cardNumber', text)}
              style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}  
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
            <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Status:</Text>
            <TextInput
              value={formData.status === 'ON' ? 'ON' : 'OFF'}
              editable={false}
              style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
              placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
              placeholder="Status"
            />

        <TouchableOpacity style={styles.submitButton} 
        onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
    </View>
  )
}

export default AddDocument;


const styles = StyleSheet.create({
  formContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderColor: '#55CBF5',
    padding: 10,
    marginBottom: 12,
    borderRadius: 10,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  uploadButton: {
     borderWidth: 2,
    borderColor: '#ccc',
    borderColor: '#55CBF5', 
    // backgroundColor: '#21AFF0',
    padding: 14,
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
});