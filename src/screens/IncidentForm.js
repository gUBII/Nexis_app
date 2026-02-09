import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { RadioButton, Checkbox, Button, Menu, Provider } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import {components} from '../components';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useTheme } from "../constants/ThemeContext";


const IncidentForm = ({theme}) => {
  const [userId, setUserId] = useState([]);
  const [refDb, setRefDb] = useState([]);
  const [injuryType, setInjuryType] = useState([]);
  const [areaInjuryType, setAreaInjuryType] = useState([]);
  const [treatmentType, setTreatmentType] = useState("");
  const [reffaralType, setReffaralType] = useState("");
  const [projectTeams, setProjectTeams] = useState([]);
  const [other, setOther] = useState("");
  const [other1, setOther1] = useState("");
  const [other2, setOther2] = useState("");
  const [other3, setOther3] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [firstaid, setFirstAid] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [documentFile, setDocumentFile] = useState(null);

  const [formData, setFormData] = useState({
    clientid:'',
    person:'',
    email:'',
    phone:'',
    username:'',
    username2:'',
    employeeName:'',
    dob: '',
    gender: '',
    address: '',
    experience:'',
    participant:'',
    incident:'',
    witness1:'',
    witness2:'',
    dob1:'',
    dob2:'',
    address1:'',
    address2:'',
    phone1:'',
    phone2:'',
    incidentdate:'',
    timeofincident:'',
    happend:'',
    incidentperform:'',
 
  });

    useEffect(() => {
      const loadUserData = async () => {
        try {
          const savedEmail = await AsyncStorage.getItem('secondaryEmail');
          const savedPhone = await AsyncStorage.getItem('secondaryPhone');
          const savedUsername = await AsyncStorage.getItem("secondaryUsername2");
          const savedUsername2 = await AsyncStorage.getItem("secondaryUsername");
  
          console.log("checkemail", savedEmail);
          console.log("checkphone", savedPhone);
          setFormData((prevFormData) => ({
            ...prevFormData,
            email: savedEmail || '',
            phone: savedPhone || '',
            username: savedUsername || '',
            username2: savedUsername2 || ''
          }));
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      };
  
      loadUserData();
    }, []);

    const clientOptions = projectTeams.map((item) => ({
      label: `${item.username} ${item.username2}`,
      value: String(item.clientid),
    }));
  

    // Date Picker State
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
  
    // Function to Show Date Picker
    const showPicker = () => setShowDatePicker(true);
  
    // Handle Date Selection
    const onDateChange = (event, selectedDate) => {
      if (selectedDate) {
        setDate(selectedDate);
      }
      setShowDatePicker(Platform.OS === "ios"); // Keep open for iOS, close for Android
    };

  const injuryTypes = [
    "Physical Injury",
    "Psychological Harm",
    "Known challenging behaviour",
    "New challenging behaviour",
    "Sun exposure",
    "Vehicle accident - work vehicle",
    "Vehicle accident - own vehicle",
    "Mobility injury",
    "Workplace violnence",
    "Electric shock",
    "Medical/Medically induced",
    "Equipment/Facility",
    "Illness",
    "Phsychosocial",
    "Near miss",
    "Other",
  ];

  const areainjuryTypes = [
    "Psychologial",
    "Psychosocial",
    "Medical",
    "Head",
    "Neck",
    "Shoulders",
    "Arms",
    "Chest",
    "Hands",
    "Stomach",
    "Waist",
    "Pelvic",
    "Thighs",
    "Knees",
    "Calves",
    "Feet",
    "Other",
  ];

  const treatmentTypes = [
    "NO",
    "YES",
    "Not Applicable",
    "Other",
  ];

  const reffaralTypes = [
    "NO",
    "YES",
  ];

  const handleCheckboxToggle = (type) => {
    setInjuryType((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  const handleCheckboxToggle1 = (type1) => {
    setAreaInjuryType((prev) =>
      prev.includes(type1) ? prev.filter((item) => item !== type1) : [...prev, type1]
    );
  };

  const handleCheckboxToggle2 = (type2) => {
    setTreatmentType(type2); // Only store the selected type
  };

  const handleCheckboxToggle3 = (type3) => {
    setReffaralType(type3); // Only store the selected type
  };

  useEffect(() => {
    const fetchProjectTeams = async () => {
      try {
        const ref_db = await AsyncStorage.getItem("ref_db");
        const userid = await AsyncStorage.getItem("secondaryId"); // Assuming userid is stored as secondaryId
        console.log("check refdb", ref_db);
        console.log("check userid", userid);
        if (!ref_db || !userid) {
          Alert.alert("Error", "Missing user data. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get("https://app.nexis365.com/api/get-project-teams", {
          params: { ref_db, userid },
        });

        console.log("project allocation", response);

        if (response.data.success) {
          setProjectTeams(response.data.data);
          console.log("check allocation data", response.data.data);
        } else {
          console.error("Error", response.data.message);
        }
      } catch (error) {
        console.error("Error", "Failed to fetch project teams.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectTeams();
  }, []);



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

    const handleDocumentPick = async () => {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles], // Allow all file types
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


    const handleSubmit = async () => {
      if (!userId || !refDb) {
        Alert.alert("Error", "User ID or Ref DB missing");
        return;
      }


      const injuryTypeString = injuryType.join(", ");
      const areaInjuryTypeString = areaInjuryType.join(", ");
    
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('userid', userId);
      formDataToSubmit.append('ref_db', refDb);
      formDataToSubmit.append('date', Math.floor(date.getTime() / 1000));
      formDataToSubmit.append('clientid', formData.clientid);
      formDataToSubmit.append('person', formData.person);
      formDataToSubmit.append('incident', formData.incident);
      formDataToSubmit.append('witness1', formData.witness1);
      formDataToSubmit.append('dob1', formData.dob1);
      formDataToSubmit.append('address1', formData.address1);
      formDataToSubmit.append('phone1', formData.phone1);
      formDataToSubmit.append('witness2', formData.witness2);
      formDataToSubmit.append('dob2', formData.dob2);
      formDataToSubmit.append('address2', formData.address2);
      formDataToSubmit.append('phone2', formData.phone2);
      formDataToSubmit.append('incidentdate', formData.incidentdate);
      formDataToSubmit.append('timeofincident', formData.timeofincident);
      formDataToSubmit.append('happend', formData.happend);
      formDataToSubmit.append('incidentperform', formData.incidentperform);
      formDataToSubmit.append('type', injuryTypeString);
      formDataToSubmit.append('other', other);
      formDataToSubmit.append('type1', areaInjuryTypeString);
      formDataToSubmit.append('other1', other1);
      formDataToSubmit.append('type2', treatmentType);
      formDataToSubmit.append('other2', other2);
      formDataToSubmit.append('type3', reffaralType);
      formDataToSubmit.append('other3', other3);
      formDataToSubmit.append('suggestion', suggestion);
      formDataToSubmit.append('firstaid', firstaid);
      formDataToSubmit.append('status', '1'); 
      
        // Check if documentFile exists and append to form data
  if (documentFile) {
    formDataToSubmit.append('document', {
      uri: documentFile.uri,
      type: documentFile.type,
      name: documentFile.name,
    });
  }
    
      try {
        const response = await axios.post("https://app.nexis365.com/api/insert-incident", formDataToSubmit, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
        console.log("Incident data sent:", formDataToSubmit);
    
        if (response.data.success) {
          Alert.alert("Success", "Incident record submitted successfully!");
        } else {
          console.error("Error", "Failed to update INCIDENT record.");
          Alert.alert("Error", "Failed to submit incident.");
        }
      } catch (error) {
        console.error("Error submitting INCIDENT:", error);
        Alert.alert("Error", "Something went wrong!");
      }
    };
    
  
  

  return (
    <Provider>
      <ScrollView style={{ padding: 20, backgroundColor: theme === 'dark' ? '#333' : '#fff'  }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, color: theme === 'dark' ? '#fff' : '#000' }}>INCIDENT Reporting</Text>

          {/* Date Picker */}
          <Text  style={{color: theme === 'dark' ? '#fff' : '#000'}}>Posting Date:</Text>
        <TouchableOpacity onPress={showPicker} style={[styles.input, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
          <Text style={{
           color: theme === 'dark' ? '#fff' : '#000',
           backgroundColor: theme === 'dark' ? '#333' : '#fff', 
           paddingTop:4,
           paddingBottom:4,
           }} 
          >{date.toDateString()}</Text>
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>Email Address:</Text>
          <components.InputField
            value={formData.email}
            placeholder="Email will appear here"
            editable={false}
            placeholderTextColor='gray'
            containerStyle={{ marginBottom: 10,  backgroundColor: theme === 'dark' ? '#333' : '#fff' }}
            textStyle={{ color: theme === 'dark' ? 'white' : 'black' }}
            />

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>Employee Name:</Text>
        <components.InputField
          placeholder=''
          value={`${formData.username} ${formData.username2}`}
          onChangeText={(text) =>
            setFormData({ ...formData, employeeName: text })
          }
          containerStyle={{ marginBottom: 10,  backgroundColor: theme === 'dark' ? '#333' : '#fff' }}
          textStyle={{ color: theme === 'dark' ? 'white' : 'black' }}
          />

           <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>Phone:</Text>
            <components.InputField
              placeholder=''
              value={formData.phone}
              keyboardType="phone-pad"
              onChangeText={(text) =>
                setFormData({ ...formData, phone: text })
              }
              containerStyle={{ marginBottom: 10,  backgroundColor: theme === 'dark' ? '#333' : '#fff' }}
              textStyle={{ color: theme === 'dark' ? 'white' : 'black' }}
              />

        {/* <Text  style={{color: theme === 'dark' ? '#fff' : '#000'}}>DOB:</Text>
        <components.InputField
            placeholder=''
            value={formData.dob}
            onChangeText={(text) =>
              setFormData({ ...formData, dob: text })
            }
            containerStyle={{ marginBottom: 10 }}
            placeholderTextColor='gray'
          />

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>Gender:</Text>
        <components.InputField
            placeholder=''
            value={formData.gender}
            onChangeText={(text) =>
              setFormData({ ...formData, gender: text })
            }
            containerStyle={{ marginBottom: 10 }}
            placeholderTextColor='gray'
          />

        <Text  style={{color: theme === 'dark' ? '#fff' : '#000'}}>Address:</Text>
        <components.InputField
            placeholder=''
            value={formData.address}
            onChangeText={(text) =>
              setFormData({ ...formData, address: text })
            }
            containerStyle={{ marginBottom: 10 }}     
            placeholderTextColor='gray'
          />

        <Text  style={{color: theme === 'dark' ? '#fff' : '#000'}}>Experience in job:</Text>
        <components.InputField
            placeholder=''
            value={formData.experience}
            onChangeText={(text) =>
              setFormData({ ...formData, experience: text })
            }
            containerStyle={{ marginBottom: 10 }}
            placeholderTextColor='gray'
          /> */}

        <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>Generate Incident Report (IR)</Text>
        <Text  style={{color: theme === 'dark' ? '#fff' : '#000'}}>Participent Name :</Text>
         <components.Dropdown
          items={[{ label: 'Select Client', value: '' }, ...clientOptions]}
          selectedValue={formData.clientid}
          onValueChange={(value) =>
            setFormData((prevData) => ({ ...prevData, clientid: value }))
          }
          containerStyle={{ flex: 1, marginRight: 10 }}
          />

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>Status of Involved Person</Text>
        <components.Dropdown
          items={[
            { label: 'Please Select', value: '' },
            { label: 'Staff', value: 'staff' },
            { label: 'Participant', value: 'participant' },
            { label: 'Visitor', value: 'visitor' },
            { label: 'Volunteer', value: 'volunteer' },
            { label: 'Contractor', value: 'contractor' },
          ]}
          selectedValue={formData.person}
          onValueChange={(value) =>
            setFormData({ ...formData, person: value })
          }
          containerStyle={{ flex: 1, marginRight: 10 }}
        />

         <Text  style={{color: theme === 'dark' ? '#fff' : '#000'}}>Incident Location:</Text>
         <TextInput 
            placeholder='Describe Incident Location...' 
            value={formData.incident}
            onChangeText={(text) =>
              setFormData({ ...formData, incident: text })
            }
            style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000',
          backgroundColor: theme === 'dark' ? '#333' : '#fff',
          }]}
            placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
          />

         <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>Witness Detail</Text>

         <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>Details of Witness 1 (If any)</Text>
         <TextInput
           placeholder="Enter details of Witness 1 (optional)"
            value={formData.witness1}
            onChangeText={(text) =>
              setFormData({ ...formData, witness1: text })
            }
            style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000',
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            }]}
            placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
          />

         <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>D.O.B</Text>
         <TextInput
            placeholder='Enter Date of Birth'
            value={formData.dob1}
            onChangeText={(text) =>
              setFormData({ ...formData, dob1: text })
            }
             style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000', 
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            }]}
            placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
          />
           <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>Address</Text>
           <TextInput
            placeholder='Enter your address'
            value={formData.address1}
            onChangeText={(text) =>
              setFormData({ ...formData, address1: text })
            }
            style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000', 
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            }]}
            placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
           />
           <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>Phone:</Text>
          <TextInput
           placeholder='Enter your phone number'
           value={formData.phone1}
           keyboardType="phone-pad"
           onChangeText={(text) =>
             setFormData({ ...formData, phone1: text })
           }
           style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000', 
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            }]}
            placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
           />
           <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>Detail of Witness 2 (If any)</Text>
         <TextInput
            placeholder='Enter details of Witness 2 (optional)'
            value={formData.witness2}
            onChangeText={(text) =>
              setFormData({ ...formData, witness2: text })
            }
            style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000', 
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            }]}
            placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
          />
           <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>D.O.B</Text>
         <TextInput
            placeholder='Enter Date of Birth'
            value={formData.dob2}
            onChangeText={(text) =>
              setFormData({ ...formData, dob2: text })
            }
            style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000', 
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            }]}
            placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
          />
           <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>Address</Text>
         <TextInput
            placeholder='Enter your address'
            value={formData.address2}
            onChangeText={(text) =>
              setFormData({ ...formData, address2: text })
            }
            style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000', 
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            }]}
            placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
          />
            <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>Phone:</Text>
            <TextInput
            placeholder='Enter your phone number'
            value={formData.phone2}
            keyboardType="phone-pad"
            onChangeText={(text) =>
              setFormData({ ...formData, phone2: text })
            }
            style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000', 
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            }]}
            placeholderTextColor={theme === 'dark' ? '#fff' : '#000'} 
            />

            <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>Incident Detail</Text>

            <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>Date of Incident </Text>
            <TextInput
            placeholder='Enter date of incident (e.g., 2025-05-15)'
            value={formData.incidentdate}
            onChangeText={(text) =>
              setFormData({ ...formData, incidentdate: text })
            }
            style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000', 
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            }]}
            placeholderTextColor={theme === 'dark' ? '#fff' : '#000'} 
          />
            <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>Approximate time of incident</Text>
            <TextInput
            placeholder='Enter approximate time (e.g., 14:30)'
            value={formData.timeofincident}
            onChangeText={(text) =>
              setFormData({ ...formData, timeofincident: text })
            }
            style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000', 
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            }]}
            placeholderTextColor={theme === 'dark' ? '#fff' : '#000'} 
          />
            <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>What Happened? </Text>
            <TextInput
            placeholder='Describe what happened'
            value={formData.happend}
            onChangeText={(text) =>
              setFormData({ ...formData, happend: text })
            }
            style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000', 
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            }]}
            placeholderTextColor={theme === 'dark' ? '#fff' : '#000'} 
          />
            <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >
            What task was being performed at the time of the incident? </Text>
            <TextInput
            placeholder='Describe the task being performed'
            value={formData.incidentperform}
            onChangeText={(text) =>
              setFormData({ ...formData, incidentperform: text })
            }
            style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000', 
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            }]}
            placeholderTextColor={theme === 'dark' ? '#fff' : '#000'} 
          />
          <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>Nature of Incident/cause of injury</Text>
          {injuryTypes.map((type) => (
          <RadioButton.Item
            label={type}
            status={injuryType.includes(type) ? "checked" : "unchecked"}
            onPress={() => handleCheckboxToggle(type)}
            key={type}
            labelStyle={{ color: theme === 'dark' ? 'white' : 'black' }}
          />
        ))}
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Other (If Any)</Text>
        <TextInput 
        value={other} 
        placeholder="Enter any additional details"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        onChangeText={setOther} 
        style={[styles.input, {color: theme === 'dark' ? '#000' : '#000', 
        backgroundColor: theme === 'dark' ? '#333' : '#fff'}]}  />

        <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>Specify the Area of Injury</Text>
        {areainjuryTypes.map((type1) => (
          <RadioButton.Item
            label={type1}
            status={areaInjuryType.includes(type1) ? "checked" : "unchecked"}
            onPress={() => handleCheckboxToggle1(type1)}
            key={type1}
            labelStyle={{ color: theme === 'dark' ? 'white' : 'black' }}
          />
        ))}
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Other (If Any)</Text>
        <TextInput 
        value={other1}
        placeholder="Enter any additional details"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'} 
        onChangeText={setOther1} 
        style={[styles.input, {color: theme === 'dark' ? '#000' : '#000', 
        backgroundColor: theme === 'dark' ? '#333' : '#fff'}]}  />

        
        <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>Treatment and Referral</Text>
        {treatmentTypes.map((type2) => (
          <RadioButton.Item
            label={type2}
            status={treatmentType === type2 ? "checked" : "unchecked"}
            onPress={() => handleCheckboxToggle2(type2)}
            key={type2}
            labelStyle={{ color: theme === 'dark' ? 'white' : 'black' }}
          />
        ))}
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Other (If Any)</Text>
        <TextInput 
        value={other2} 
        placeholder="Enter any additional details"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'} 
        onChangeText={setOther2} 
        style={[styles.input, {color: theme === 'dark' ? '#000' : '#000',
        backgroundColor: theme === 'dark' ? '#333' : '#fff'}]}  />

        <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>Referral Required:</Text>
        {reffaralTypes.map((type3) => (
          <RadioButton.Item
            label={type3}
            status={reffaralType === type3 ? "checked" : "unchecked"}
            onPress={() => handleCheckboxToggle3(type3)}
            key={type3}
            labelStyle={{ color: theme === 'dark' ? 'white' : 'black' }}
          />
        ))}
        
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>If YES, Please specify Refferred to:</Text>
        <TextInput 
        value={other3} 
        placeholder="Enter referred person's name or department"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        onChangeText={setOther3} 
        style={[styles.input, {color: theme === 'dark' ? '#000' : '#000',
          backgroundColor: theme === 'dark' ? '#333' : '#fff'}]}  />
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>First Aid Attendant:</Text>
        <TextInput 
        value={firstaid} 
        placeholder="Enter first aid attendant's name"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'} 
        onChangeText={setFirstAid}
        style={[styles.input, {color: theme === 'dark' ? '#000' : '#000',
        backgroundColor: theme === 'dark' ? '#333' : '#fff'}]}  />
      

        <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000', marginBottom:5}]}>Upload Documents (If any)</Text>

        <TouchableOpacity onPress={handleDocumentPick} style={styles.uploadButton}>
         <Text 
         style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000',
          backgroundColor: theme === 'dark' ? '#333' : '#fff'}]} >
          Upload File</Text>
         {documentFile && documentFile.name && (
           <Text style={{ marginTop: 10, color: '#000' }}> 
             Selected File: {documentFile.name}
           </Text>
           )}
        </TouchableOpacity> 

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Suggestions for improvement:</Text>
        <TextInput 
        value={suggestion} 
        placeholder="Enter any suggestions for improvement"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        onChangeText={setSuggestion} 
        style={[styles.input, {color: theme === 'dark' ? '#000' : '#000',
          backgroundColor: theme === 'dark' ? '#333' : '#fff'}]}  />

        <Button mode="contained" onPress={handleSubmit} style={[styles.button,{marginBottom:140}]}>
          <Text style={{fontWeight:'bold', fontSize:16}} >Submit</Text>  
        </Button> 
      </ScrollView>
    </Provider>
  );
};

const styles = {
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#ccc",
    borderColor: '#55CBF5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor:'#55CBF5'
  },
};

export default IncidentForm;
