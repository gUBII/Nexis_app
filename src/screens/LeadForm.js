// CampaignForm.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from "@react-native-community/datetimepicker";
import { launchCamera } from 'react-native-image-picker';
import {components} from '../components';
import axios from 'axios'; 

const LeadForm = ({ theme }) => {
  const [userId, setUserId] = useState([]);
  const [refDb, setRefDb] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
   const [userOptions, setUserOptions] = useState([]);
   const [dob, setDob] = useState(new Date());
   const [followUpDate, setFollowUpDate] = useState(new Date());
   const [appointmentDate, setAppointmentDate] = useState(new Date());
   const [targetDate, setTargetDate] = useState(new Date()); 
   const [imageFile, setImageFile] = useState(null); 
   const [imageUri, setImageUri] = useState(null);

  const [formData, setFormData] = useState({
    leadName: '',
    campaignid:'',
    title:'',
    firstName:'',
    surName:'',
    preferredName:'',
    gender:'',
    coordinator: '',
    plan: '',
    possibility: '',
    opportunity: '',
    username: '',
    username2: '',
    managerid: '',
    address:'',
    city:'',
    state:'',
    zip:'',
    country:'',
    email:'',
    phone:'',
    billingAddress:'',
    clientStory:'',
    note:'',
    addemail:'',
    addphone:'',
    type:'',
    ndis:'', 
    priority: '',
    status:'1',  
  }); 

  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showFollowUpPicker, setShowFollowUpPicker] = useState(false);
  const [showAppointmentPicker, setShowAppointmentPicker] = useState(false);
  const [showTargetPicker, setShowTargetPicker] = useState(false);

   // Handlers
   const onDobChange = (event, selectedDate) => {
    if (selectedDate) setDob(selectedDate);
    setShowDobPicker(Platform.OS === 'ios');
  };

  const onFollowUpChange = (event, selectedDate) => {
    if (selectedDate) setFollowUpDate(selectedDate);
    setShowFollowUpPicker(Platform.OS === 'ios');
  };

  const onAppointmentChange = (event, selectedDate) => {
    if (selectedDate) setAppointmentDate(selectedDate);
    setShowAppointmentPicker(Platform.OS === 'ios');
  };

  const onTargetChange = (event, selectedDate) => {
    if (selectedDate) setTargetDate(selectedDate);
    setShowTargetPicker(Platform.OS === 'ios');
  };



  useEffect(() => {
    const fetchCampaigns = async () => {
      const ref_db = await AsyncStorage.getItem("ref_db");
      const userid = await AsyncStorage.getItem("secondaryId");
  
      if (!ref_db || !userid) return;
  
      try {
        const response = await axios.get("https://app.nexis365.com/api/get-campaigns", {
          params: { ref_db, userid }
        });
  
        if (response.data.success) {
          setCampaigns(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      }
    };
  
    fetchCampaigns();
  }, []);

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
        // Fetch userId and ref_db from AsyncStorage
        useEffect(() => {
        const loadUserData = async () => {
          try {
            const storedUserId = await AsyncStorage.getItem("secondaryId");
            const storedRefDb = await AsyncStorage.getItem("ref_db");
            setUserId(storedUserId || "");
            setRefDb(storedRefDb || "");
          } catch (error) {
            console.error("Error loading user data:", error);
          }
        };
        loadUserData();
      }, []);


        const captureImage = async () => {
          const options = {
            mediaType: 'photo',
            quality: 0.7,
            saveToPhotos: false,
            includeBase64: false,
            isFrontCamera: true,
          };
      
          const response = await launchCamera(options);
      
          if (response.didCancel) {
            Alert.alert('Cancelled', 'User cancelled image capture');
            return null;
          } else if (response.errorCode) {
            Alert.alert('Error', `Camera Error: ${response.errorMessage}`);
            return null;
          } else if (!response.assets || response.assets.length === 0) {
            Alert.alert('Error', 'No image captured. Try again.');
            return null;
          }
      
          return response.assets[0];
        };


        const handleImagePick = async () => {
          const image = await captureImage(); // your existing function to open camera or gallery
          if (!image) return;
        
          setImageUri(image.uri);
          setImageFile({
            uri: image.uri,
            type: image.type || 'image/jpeg',
            name: image.fileName || 'photo.jpg',
          });
        };
        
      const handleSubmit = async () => {
        if (!userId || !refDb) {
          Alert.alert("Error", "User ID or Ref DB missing");
          return;
        }

        if (imageFile) {
          formDataToSubmit.append('images', imageFile);
        }
        
        

        const formDataToSubmit = new FormData();
        formDataToSubmit.append('userid', userId);
        formDataToSubmit.append('ref_db', refDb);
        formDataToSubmit.append('leadName', formData.leadName);
        formDataToSubmit.append('campaignid', formData.campaignid);
        formDataToSubmit.append('title', formData.title);
        formDataToSubmit.append('firstName', formData.firstName);
        formDataToSubmit.append('surName', formData.surName);
        formDataToSubmit.append('preferredName', formData.preferredName);
        formDataToSubmit.append('gender', formData.gender);
        formDataToSubmit.append('dob', Math.floor(dob.getTime() / 1000));
        formDataToSubmit.append('address', formData.address);
        formDataToSubmit.append('city', formData.city);
        formDataToSubmit.append('state', formData.state);
        formDataToSubmit.append('zip', formData.zip);
        formDataToSubmit.append('country', formData.country);
        formDataToSubmit.append('email', formData.email);
        formDataToSubmit.append('phone', formData.phone);
        formDataToSubmit.append('billingAddress', formData.billingAddress);
        formDataToSubmit.append('clientStory', formData.clientStory);
        formDataToSubmit.append('note', formData.note);
        formDataToSubmit.append('managerid', formData.managerid);
        formDataToSubmit.append('addemail', formData.addemail);
        formDataToSubmit.append('addphone', formData.addphone);
        formDataToSubmit.append('type', formData.type);
        formDataToSubmit.append('priority', formData.priority);  
        formDataToSubmit.append('ndis', formData.ndis);
        formDataToSubmit.append('followUpDate', Math.floor(followUpDate.getTime() / 1000));
        formDataToSubmit.append('appointmentDate', Math.floor(appointmentDate.getTime() / 1000));
        formDataToSubmit.append('targetDate', Math.floor(targetDate.getTime() / 1000)); 
        formDataToSubmit.append('status', formData.status);
        formDataToSubmit.append('images', imageFile);

      
        try {
          const response = await axios.post("https://app.nexis365.com/api/leads-form", formDataToSubmit, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
      
          console.log("Leads data sent:", formDataToSubmit);  
      
          if (response.data.success) {
            Alert.alert("Success", "Leads record submitted successfully!");
          } else {
            console.error("Error", "Failed to update LEADS record.");
            Alert.alert("Error", "Failed to submit leads.");
          }
        } catch (error) {
          console.error("Error submitting Leads:", error);
          Alert.alert("Error", "Something went wrong!");
        }
      };
      

  const campaignOptions = campaigns.map((item) => ({
    label: item.campaign_name,
    value: String(item.id),
  }));
  

  return (
    <View style={[styles.formContainer, { backgroundColor: theme === 'dark' ? '#333' : '#fff'}]}>
      <Text style={[styles.formTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>Create Lead</Text>

      <TextInput
        placeholder="Lead Name"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.leadName}
        onChangeText={(text) => handleChange('leadName', text)}
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
      />

      <components.Dropdown
        items={[{ label: 'Select Campaign', value: '' }, ...campaignOptions]}
        selectedValue={formData.campaignid}
        onValueChange={(value) =>
          setFormData((prevData) => ({ ...prevData, campaignid: value }))
        }
        style={{ flex: 1, marginBottom: 12 }}
      />

       <components.Dropdown
        items={[
        { label: 'Select Title', value: '' },
        { label: 'Mr.', value: 'Mr.' },
        { label: 'Mrs.', value: 'Mrs.' },
        { label: 'Miss', value: 'Miss' },
        { label: 'Mx', value: 'Mx' },
        { label: 'Madam', value: 'Madam' },
        { label: 'Sir', value: 'Sir' },
        { label: 'Lady', value: 'Lady' },
        { label: 'Dr.', value: 'Dr.' },
        { label: 'Rev.', value: 'Rev.' },
        { label: 'Master', value: 'Master' },
        ]}
        selectedValue={formData.title}
        onValueChange={(value) =>
        setFormData((prevData) => ({ ...prevData, title: value }))
        }
        style={{ marginBottom: 12 }}
        />

       <TextInput
        placeholder="First Name"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.firstName}
        onChangeText={(text) => handleChange('firstName', text)}
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
      />

       <TextInput
        placeholder="Sur Name"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.surName}
        onChangeText={(text) => handleChange('surName', text)}
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
      />

      <TextInput
        placeholder="Preferred Name"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.preferredName}
        onChangeText={(text) => handleChange('preferredName', text)}
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
      />
       <components.Dropdown
        items={[
        { label: 'Select Gender', value: '' },
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' },
        ]}
        selectedValue={formData.gender}
        onValueChange={(value) =>
        setFormData((prevData) => ({ ...prevData, gender: value }))
        }
        style={{ marginBottom: 12 }}
        />
        

      <TouchableOpacity onPress={() => setShowDobPicker(true)} style={styles.input}>
        <Text style={{ color: theme === 'dark' ? '#fff' : '#000', paddingTop: 4, paddingBottom: 4 }}>
          Date of Birth: {dob.toDateString()}
        </Text>
      </TouchableOpacity>
      {showDobPicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display="default"
          onChange={onDobChange}
        />
      )}
      <TextInput
        placeholder="Address"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.address}
        onChangeText={(text) => handleChange('address', text)}
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
      />
      <TextInput
        placeholder="City"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.city}
        onChangeText={(text) => handleChange('city', text)}
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
      />
       <TextInput
        placeholder="State"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.state}
        onChangeText={(text) => handleChange('state', text)}
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
      />
       <TextInput
        placeholder="Zip"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.zip}
        onChangeText={(text) => handleChange('zip', text)}
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
      />
       <TextInput
        placeholder="Country"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.country}
        onChangeText={(text) => handleChange('country', text)}
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
      />
       <TextInput
        placeholder="Email Address"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
      />
       <TextInput
        placeholder="Phone Number"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.phone}
        onChangeText={(text) => handleChange('phone', text)}
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
      />

      <TouchableOpacity onPress={handleImagePick} style={styles.uploadButton}>
        <Text style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}>
          Upload Image
        </Text>
        {imageFile && imageFile.name && (
          <Text style={{ marginTop: 10, color: '#000' }}>
            Selected Image: {imageFile.name}
          </Text>
        )}
      </TouchableOpacity>



      <TextInput
        placeholder="Billing Address"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.billingAddress}
        onChangeText={(text) => handleChange('billingAddress', text)}
        style={[styles.input, { height: 100, textAlignVertical: 'top', color: theme === 'dark' ? '#fff' : '#000' }]}
        multiline={true}
        numberOfLines={4}
      />

       <TextInput
        placeholder="Client Story/Enquiry (Note)"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.clientStory}
        onChangeText={(text) => handleChange('clientStory', text)}
        style={[styles.input, { height: 100, textAlignVertical: 'top', color: theme === 'dark' ? '#fff' : '#000' }]}
        multiline={true}
        numberOfLines={4}
      />

       <TextInput
        placeholder="Important Notes for Staff"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.note}
        onChangeText={(text) => handleChange('note', text)}
        style={[styles.input, { height: 100, textAlignVertical: 'top', color: theme === 'dark' ? '#fff' : '#000' }]}
        multiline={true}
        numberOfLines={4}
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
        placeholder="Additional Email"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.addemail}
        onChangeText={(text) => handleChange('addemail', text)} 
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
      />
       <TextInput
        placeholder="Additional Phone"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.addphone}
        onChangeText={(text) => handleChange('addphone', text)}
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
      />

      <components.Dropdown
        items={[
          { label: 'Select Type', value: '' },
          { label: 'HCP', value: 'HCP' },
          { label: 'CHSP', value: 'CHSP' },
        ]}
        selectedValue={formData.type}
        onValueChange={(value) =>
          setFormData((prevData) => ({ ...prevData, type: value }))
        }
        style={{ marginBottom: 12 }}
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

      <TextInput
        placeholder="NDIS Number"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        value={formData.ndis}
        onChangeText={(text) => handleChange('ndis', text)}
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]} 
      />

     <TouchableOpacity onPress={() => setShowFollowUpPicker(true)} style={styles.input}>
        <Text style={{ color: theme === 'dark' ? '#fff' : '#000', paddingTop: 4, paddingBottom: 4 }}>
          Follow Up Date: {followUpDate.toDateString()}
        </Text>
      </TouchableOpacity>
      {showFollowUpPicker && (
        <DateTimePicker
          value={followUpDate}
          mode="date"
          display="default"
          onChange={onFollowUpChange}
        />
      )}
       {/* Appointment Date */}
       <TouchableOpacity onPress={() => setShowAppointmentPicker(true)} style={styles.input}>
        <Text style={{ color: theme === 'dark' ? '#fff' : '#000', paddingTop: 4, paddingBottom: 4 }}>
          Appointment Date: {appointmentDate.toDateString()}
        </Text>
      </TouchableOpacity>
      {showAppointmentPicker && (
        <DateTimePicker
          value={appointmentDate}
          mode="date"
          display="default"
          onChange={onAppointmentChange}
        />
      )}

      {/* Target Date */}
      <TouchableOpacity onPress={() => setShowTargetPicker(true)} style={styles.input}>
        <Text style={{ color: theme === 'dark' ? '#fff' : '#000', paddingTop: 4, paddingBottom: 4 }}>
          Target Date: {targetDate.toDateString()}
        </Text>
      </TouchableOpacity>
      {showTargetPicker && (
        <DateTimePicker
          value={targetDate}
          mode="date"
          display="default"
          onChange={onTargetChange}
        />
      )}

      <components.Dropdown
        items={[
          { label: 'ON', value: '1' },
          { label: 'OFF', value: '0' },
        ]}
        selectedValue={formData.status}
        onValueChange={(value) =>
          setFormData((prevData) => ({ ...prevData, status: value }))
        }
        style={{ marginBottom: 12 }}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text> 
      </TouchableOpacity>
    </View>
  );
};

export default LeadForm;

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
    // borderColor: '#ccc',
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
