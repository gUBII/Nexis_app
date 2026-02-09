// CampaignForm.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {components} from '../components';
import axios from 'axios'; 
import moment from 'moment';


const CampaignForm = ({ theme }) => {
  const [userOptions, setUserOptions] = useState([]);

  const [formData, setFormData] = useState({
    campaignName: '',
    coordinator: '',
    plan: '',
    possibility: '',
    opportunity: '',
    username: '',
    username2: '',
    managerid: '',
    priority: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const ref_db = await AsyncStorage.getItem("ref_db");
        const userid = await AsyncStorage.getItem("secondaryId");
  
        if (!ref_db || !userid) return;
  
        const response = await axios.get("https://app.nexis365.com/api/get-alluser", {
          params: { ref_db, userid },
        });
  
        if (response.data.success) {
          const users = response.data.data;
  
          const options = users.map((item) => ({
            label: `${item.username} ${item.username2}`,
            value: String(item.id),
          }));
  
          setUserOptions([{ label: 'Select Manager', value: '' }, ...options]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchUsers();
  }, []);
  

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };



  const handleSubmit = async () => {
    try {
      const ref_db = await AsyncStorage.getItem("ref_db");
      const userid = await AsyncStorage.getItem("secondaryId");
  
      if (!ref_db || !userid) {
        alert("Missing required data");
        return; 
      }

      const currentDate = moment().unix(); 

      const response = await axios.get("https://app.nexis365.com/api/campaigns-form", {
        params: {
          ref_db,
          userid,
          campaignName: formData.campaignName,
          managerid: formData.managerid,
          plan: formData.plan,
          possibility: formData.possibility,
          opportunity: formData.opportunity, 
          priority: formData.priority,
          currentDate,
        },
      });
  
      if (response.data.success) {
        alert("Campaign submitted successfully!");
        console.log("Response:", response.data);
      } else {
        alert("Failed to submit campaign.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while submitting the campaign.");
    }
  };
  


  return (
    <View style={[styles.formContainer, { backgroundColor: theme === 'dark' ? '#333' : '#fff'}]}>
      <Text style={[styles.formTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}> Campaign Form</Text>

      <TextInput
        placeholder="Campaign Name"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.campaignName}
        onChangeText={(text) => handleChange('campaignName', text)}
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
      />


      <components.Dropdown
        items={userOptions}
        selectedValue={formData.managerid}
        onValueChange={(value) => 
          setFormData((prevData) => ({ ...prevData, managerid: value })) 
        }
        style={{ flex: 1, marginBottom: 12 }}
      />


      <TextInput
        placeholder="Plan"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.plan}
        onChangeText={(text) => handleChange('plan', text)}
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
      />
      <TextInput
        placeholder="Possibility"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.possibility}
        onChangeText={(text) => handleChange('possibility', text)}
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
      />
      <TextInput
        placeholder="Opportunity"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.opportunity}
        onChangeText={(text) => handleChange('opportunity', text)}
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
      />

      <components.Dropdown
        items={[
          { label: 'Select Priority', value: '' },
          { label: 'High', value: 'High' },
          { label: 'Medium', value: 'Medium' },
          { label: 'Low', value: 'Low' },
        ]}
        selectedValue={formData.priority}
        onValueChange={(value) =>
          setFormData((prevData) => ({ ...prevData, priority: value })) 
        }
        style={{ marginBottom: 12 }}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CampaignForm;

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
