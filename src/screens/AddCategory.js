import React, { useEffect, useState } from 'react';
import { components } from '../components';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; 

const AddCategory = ({ theme }) => {
    const [modulesOptions, setModulesOptions] = useState([]);
    const [formData, setFormData] = useState({
      categoryName: '', 
      moduleid:'',
      status:'1',
    });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const ref_db = await AsyncStorage.getItem("ref_db");
        const userid = await AsyncStorage.getItem("secondaryId");
  
        if (!ref_db || !userid) return;
  
        const response = await axios.get("https://app.nexis365.com/api/get-modules", {
          params: { ref_db, userid },  
        }); 
  
        if (response.data.success) {
          const modules = response.data.data;
          console.log("Fetched Modules:", modules);
  
          const options = modules.map((item) => ({
            label: item.name,
            value: String(item.id),
          }));
          
  
          setModulesOptions(options);
          if (options.length > 0) {
            setFormData((prev) => ({ ...prev, moduleid: options[0].value }));
          }
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };
  
    fetchModules();
  }, []);

  const handleSubmit = async () => {
    try {
      const ref_db = await AsyncStorage.getItem("ref_db");
      const userid = await AsyncStorage.getItem("secondaryId");
  
      if (!ref_db || !userid) {
        alert("Missing required data");
        return; 
      }

      const response = await axios.get("https://app.nexis365.com/api/category-form", {
        params: {
          ref_db,
          userid,
          categoryName: formData.categoryName,
          moduleid: formData.moduleid,
          status:formData.status,
        },
      });
  
      if (response.data.success) {
        alert("Category submitted successfully!");
        console.log("Response:", response.data);
      } else {
        alert("Failed to submit category.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while submitting the category.");
    }
  };

  return (
    <View style={[styles.formContainer, { backgroundColor: theme === 'dark' ? '#333' : '#fff'}]}>
        <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Select Category:</Text>
         <components.Dropdown
           items={modulesOptions}
           selectedValue={formData.moduleid}
           onValueChange={(value) => 
            handleChange('moduleid', value)
          }
          style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
        />
         <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Category Name:</Text>
         <TextInput
              placeholder="Category Name"
              placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
              value={formData.categoryName}
              onChangeText={(text) => handleChange('categoryName', text)}
              style={[styles.input,{ color: theme === 'dark' ? '#fff' : '#000' }]}
            />
            <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Status:</Text>
            <TextInput
              value={formData.status === '1' ? 'ON' : 'OFF'}
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

export default AddCategory;


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