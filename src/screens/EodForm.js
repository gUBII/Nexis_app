import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { RadioButton, Checkbox, Button, Menu, Provider } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import {components} from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useTheme } from "../constants/ThemeContext";

const EodForm = ({theme}) => {
  const [userId, setUserId] = useState([]);
    const [refDb, setRefDb] = useState([]);
  const [eodType, setEodType] = useState([]);  
  const [challenge, setChallenge] = useState("");  
  const [other, setOther] = useState("");
  const [communication1, setCommunication1] = useState("");
  const [wellbeing1, setWellbeing1] = useState("");
  const [socialize1, setSocialize1] = useState("");
  const [learn2, setLearn2] = useState("");
  const [staff1, setStaff1] = useState("");
  const [engagement1, setEngagement1] = useState("");
  const [manage1, setManage1] = useState("");
  const [risk1, setRisk1] = useState("");
  const [documentation1, setDocumentation1] = useState("");
  const [documentation2, setDocumentation2] = useState("");
  const [summary1, setSummary1] = useState("");
  const [summary2, setSummary2] = useState("");
  const [projectTeams, setProjectTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const [formData, setFormData] = useState({
    clientid:'',
    email:'',
    phone:'',
    username:'',
    username2:'',
    employeeName:'',
    shift: '',
    behave:'',
    challenge1:'',
    communication:'',
    communication2:'',
    wellbeing:'',
    wellbeing2:'',
    socialize2:'',
    learn1:'',
    staff:'',
    staff2:'',
    engagement2:'',
    manage:'',
    manage2:'',
    risk:'',
    risk2:'',
    documentation:'',
  });


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


  const clientOptions = projectTeams.map((item) => ({
    label: `${item.username} ${item.username2}`,
    value: String(item.clientid),
  }));  


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
    }, [])


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

  const eodTypes = [
    "Life Skills Center",
    "Group Community Access",
    "1:1 Community Access",
    "In-Home care (aged care, nursing home)",
    "Respite",
    "Other",
  ];

  const handleCheckboxToggle = (type) => {
    setEodType((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
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

  const handleSubmit = async () => {
      if (!userId || !refDb) {
        Alert.alert("Error", "User ID or Ref DB missing");
        return;
      }
    
      const eodTypeString = eodType.join(", ");
    
      try {
        const response = await axios.get("https://app.nexis365.com/api/insert-eod", {
          params: {
            ref_db: refDb,
            userid: userId,
            date: Math.floor(date.getTime() / 1000),
            clientid: formData.clientid,
            shift:formData.shift,
            type: eodTypeString,
            other,
            behave:formData.behave,
            challenge,
            challenge1:formData.challenge1,
            communication:formData.communication,
            communication1,
            communication2:formData.communication2,
            wellbeing:formData.wellbeing,
            wellbeing1,
            wellbeing2:formData.wellbeing2,
            socialize1,
            socialize2:formData.socialize2,
            learn1:formData.learn1,
            learn2,
            staff:formData.staff,
            staff1,
            staff2:formData.staff2,
            engagement1,
            engagement2:formData.engagement2,
            manage:formData.manage,
            manage1,
            manage2:formData.manage2,
            risk:formData.risk,
            risk1,
            risk2:formData.risk2,
            documentation:formData.documentation,
            documentation1,
            documentation2,
            summary1,
            summary2,
            status:1,
          },
        });
    
        console.log("Sending EOD data:", {
          ref_db: refDb,
          userid: userId,
          date: Math.floor(date.getTime() / 1000),
          clientid: formData.clientid,
          shift:formData.shift,
          type: eodTypeString,
          other,
          behave:formData.behave,
          challenge,
          challenge1:formData.challenge1,
          communication:formData.communication,
          communication1,
          communication2:formData.communication2,
          wellbeing:formData.wellbeing,
          wellbeing1,
          wellbeing2:formData.wellbeing2,
          socialize1,
          socialize2:formData.socialize2,
          learn1:formData.learn1,
          learn2,
          staff:formData.staff,
          staff1,
          staff2:formData.staff2,
          engagement1,
          engagement2:formData.engagement2,
          manage:formData.manage,
          manage1,
          manage2:formData.manage2,
          risk:formData.risk,
          risk1,
          risk2:formData.risk2,
          documentation:formData.documentation,
          documentation1,
          documentation2,
          summary1,
          summary2,
          status:1,
        });   
    
        if (response.data.success) {
          Alert.alert("Success", "EOD record submit successfully!");
        } else {
          Alert.alert("Error", "Failed to update EOD record.");
        }
      } catch (error) {
        console.error("Error inserting EOD:", error);
        Alert.alert("Error", "Something went wrong!");
      }
    };


  return (
    <Provider>
      <ScrollView style={{ padding: 20, backgroundColor: theme === 'dark' ? '#333' : '#fff',  }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, color: theme === 'dark' ? '#fff' : '#000' }}>EOD Reporting</Text>

          {/* Date Picker */}
          <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Date:</Text>
        <TouchableOpacity onPress={showPicker} style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000', backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
          <Text style={{
           color: theme === 'dark' ? '#fff' : '#000',
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

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Email Address:</Text>
        <components.InputField
          value={formData.email}
          placeholder=""
          editable={false}
          containerStyle={{ marginBottom: 10,  backgroundColor: theme === 'dark' ? '#333' : '#fff' }}
          textStyle={{ color: theme === 'dark' ? 'white' : 'black' }}
          />

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Employee Name:</Text>
         <components.InputField
          placeholder=''
          value={`${formData.username} ${formData.username2}`}
          onChangeText={(text) =>
            setFormData({ ...formData, employeeName: text })
          }
          containerStyle={{ marginBottom: 10,  backgroundColor: theme === 'dark' ? '#333' : '#fff' }}
          placeholderTextColor='gray'
          textStyle={{ color: theme === 'dark' ? 'white' : 'black' }}
          />

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Phone:</Text>
         <components.InputField
          placeholder=''
          value={formData.phone}
          keyboardType="phone-pad"
          onChangeText={(text) =>
            setFormData({ ...formData, phone: text })
          }
          containerStyle={{ marginBottom: 10, backgroundColor: theme === 'dark' ? '#333' : '#fff'  }}
          placeholderTextColor='gray'
          textStyle={{ color: theme === 'dark' ? 'white' : 'black' }}
          />

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Client Name:</Text>
        <components.Dropdown
          items={[{ label: 'Select Client', value: '' }, ...clientOptions]}
          selectedValue={formData.clientid}
          onValueChange={(value) =>
            setFormData((prevData) => ({ ...prevData, clientid: value }))
          }
          style={{ flex: 1, marginRight: 10 }}
         />

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Shift Status:</Text>
        <components.Dropdown
          items={[
            { label: 'Select Shift', value: '' },
            { label: 'DAY', value: 'day' },
            { label: 'EVENING', value: 'evening' },
            { label: 'NIGHT', value: 'night' },
          ]}
          selectedValue={formData.shift}
          onValueChange={(value) =>
            setFormData({ ...formData, shift: value })
          }
          style={{ flex: 1, marginRight: 10 }}
        />

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Activity: Select the key activities you engaged in with the clients today:</Text>
        {eodTypes.map((type) => (
          <RadioButton.Item
            label={type}
            value={type}
            status={eodType.includes(type) ? "checked" : "unchecked"}
            onPress={() => handleCheckboxToggle(type)}
            key={type}
            labelStyle={{ color: theme === 'dark' ? 'white' : 'black' }}
          /> 
        ))}

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >If Other, Please Specify:</Text>
        <TextInput value={other}
        onChangeText={setOther}
        placeholder="Enter other reason"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}  />

        <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>Behavior</Text>
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Challenges in behavior today.</Text>

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Is there any notable changes in the behavior of the clients today?</Text>
        <components.Dropdown
          items={[
            { label: 'Select Option', value: '' },
            { label: 'YES', value: 'yes' },
            { label: 'NO', value: 'no' },
          ]}
          selectedValue={formData.behave}
          onValueChange={(value) =>
            setFormData({ ...formData, behave: value })
          }
          style={{ flex: 1, marginRight: 10 }}
        />

       <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >And what challenges did you encounter during your shift today?</Text>
       <Text 
       style={{color: theme === 'dark' ? '#fff' : '#000'}}
        >Eating, Walking, Personal Care, Listening/Comprehending (If Required)</Text>
       <TextInput 
        value={challenge}
        placeholder="Describe your challenges here..."
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'} 
        onChangeText={setChallenge}
        style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}  />

       <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >How challenging was their activity? (On a rating of 1 to 10).</Text>
        <components.Dropdown
          items={[
            { label: '1 - Less Challenge', value: '1' },
            { label: '2 -', value: '2' },
            { label: '3 -', value: '3' },
            { label: '4 -', value: '4' },
            { label: '5 - Average Challenge', value: '5' },
            { label: '6 -', value: '6' },
            { label: '7 -', value: '7' },
            { label: '8 -', value: '8' },
            { label: '9 -', value: '9' },
            { label: '10 - Most Challenge', value: '10' },
          ]}
          selectedValue={formData.challenge1}
          onValueChange={(value) =>
            setFormData({ ...formData, challenge1: value })
          }
          style={{ flex: 1, marginRight: 10 }}
        />
       <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>Communication</Text>
         <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Did the client communicate effectively with other people and yourself today?</Text>
         <components.Dropdown
          items={[
            { label: 'Select Option', value: '' },
            { label: 'YES', value: 'yes' },
            { label: 'NO', value: 'no' },
          ]}
          selectedValue={formData.communication}
          onValueChange={(value) =>
            setFormData({ ...formData, communication: value })
          }
          style={{ flex: 1, marginRight: 10 }}
        />
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Communication is how they communicate, do they use verbal, sign, or body language. Is their speech clear and understandable? If they communicate through text, is it legible? Was their speech slurred or hard to understand?</Text>
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Please specify any communication challenges you faced: (if any)</Text>
        <TextInput
        value={communication1}
        placeholder="Describe any communication challenges faced..."
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        onChangeText={setCommunication1}
        style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}  />

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >How effective was their communication? (On a rating of 1 to 10)..</Text>
        <components.Dropdown
          items={[
            { label: '1 - Less Effective', value: '1' },
            { label: '2 -', value: '2' },
            { label: '3 -', value: '3' },
            { label: '4 -', value: '4' },
            { label: '5 - Average Effective', value: '5' },
            { label: '6 -', value: '6' },
            { label: '7 -', value: '7' },
            { label: '8 -', value: '8' },
            { label: '9 -', value: '9' },
            { label: '10 - Most Effective', value: '10' },
          ]}
          selectedValue={formData.communication2}
          onValueChange={(value) =>
            setFormData({ ...formData, communication2: value })
          }
          style={{ flex: 1, marginRight: 10 }}
        />

        
        <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>Well-being (Mobility)</Text>
         <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Do you have any concerns about the mobility of the participant?</Text>
         <components.Dropdown
          items={[
            { label: 'Select Option', value: '' },
            { label: 'YES', value: 'yes' },
            { label: 'NO', value: 'no' },
          ]}
          selectedValue={formData.wellbeing}
          onValueChange={(value) =>
            setFormData({ ...formData, wellbeing: value })
          }
          style={{ flex: 1, marginRight: 10 }}
        />
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >A mobility impairment is a disability that affects movement ranging from gross motor skills, such as walking, to fine motor movement, involving manipulation of objects by hand.</Text>
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >If yes, please provide details and any actions taken: (if any)</Text>
        <TextInput
        value={wellbeing1}
        placeholder="Describe mobility challenges and actions taken..."
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'} 
        onChangeText={setWellbeing1}
        style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}  />

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >how effective was their movement? (On a rating of 1 to 10).</Text>
        <components.Dropdown
          items={[
            { label: '1 - Less Effective', value: '1' },
            { label: '2 -', value: '2' },
            { label: '3 -', value: '3' },
            { label: '4 -', value: '4' },
            { label: '5 - Average Effective', value: '5' },
            { label: '6 -', value: '6' },
            { label: '7 -', value: '7' },
            { label: '8 -', value: '8' },
            { label: '9 -', value: '9' },
            { label: '10 - Most Effective', value: '10' },
          ]}
          selectedValue={formData.wellbeing2}
          onValueChange={(value) =>
            setFormData({ ...formData, wellbeing2: value })
          }
          style={{ flex: 1, marginRight: 10 }}
        />

        <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>Socialize</Text>
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Please keep in mind that socializing also refers to the participants ability to engage and disengage in conversation respectfully. Are they able to maintain a conversation? are they able to direct and redirect their attention or are they easily distracted? do they follow common courtesy and use pleasantries like `excuse me` or `sorry to cut you off` etc.:</Text>
        <TextInput
        value={socialize1}
        placeholder="Describe the participant's socializing abilities..."
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        onChangeText={setSocialize1}
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}  />
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >how effective was their movement? (On a rating of 1 to 10).</Text>
        <components.Dropdown
          items={[
            { label: '1 - Less Socialize', value: '1' },
            { label: '2 -', value: '2' },
            { label: '3 -', value: '3' },
            { label: '4 -', value: '4' },
            { label: '5 - Average Socialize', value: '5' },
            { label: '6 -', value: '6' },
            { label: '7 -', value: '7' },
            { label: '8 -', value: '8' },
            { label: '9 -', value: '9' },
            { label: '10 - Most Socialize', value: '10' },
          ]}
          selectedValue={formData.socialize2}
          onValueChange={(value) =>
            setFormData({ ...formData, socialize2: value })
          }
          style={{ flex: 1, marginRight: 10 }}
        />

         <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>Learning new things</Text>
         <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Were there any particular successes or positive moments? What did they enjoy participating in today?</Text>
         <components.Dropdown
          items={[
            { label: 'Select Option', value: '' },
            { label: 'YES', value: 'yes' },
            { label: 'NO', value: 'no' },
          ]}
          selectedValue={formData.learn1}
          onValueChange={(value) =>
            setFormData({ ...formData, learn1: value })
          }
          style={{ flex: 1, marginRight: 10 }}
        />
         <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >If yes, please provide details:</Text>
         <TextInput 
         value={learn2}
         placeholder="provide the details..."
         placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
         onChangeText={setLearn2}
         style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000', backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}  />


         <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>Staff Notification</Text>
         <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Did they notify you before going to the Toilet, Backyard, Kitchen etc.?</Text>
         <components.Dropdown
          items={[
            { label: 'Select Option', value: '' },
            { label: 'YES', value: 'yes' },
            { label: 'NO', value: 'no' },
          ]}
          selectedValue={formData.staff}
          onValueChange={(value) =>
            setFormData({ ...formData, staff: value })
          }
          style={{ flex: 1, marginRight: 10 }}
        />
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >If yes, please provide details: (if required)</Text>
        <TextInput
         value={staff1} 
         placeholder="provide the details..."
         placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
         onChangeText={setStaff1} 
         style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000', 
         backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}  />

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >how was the notification activities? (On a rating of 1 to 10).</Text>
        <components.Dropdown
          items={[
            { label: '1 - Less Notification', value: '1' },
            { label: '2 -', value: '2' },
            { label: '3 -', value: '3' },
            { label: '4 -', value: '4' },
            { label: '5 - Average Notification', value: '5' },
            { label: '6 -', value: '6' },
            { label: '7 -', value: '7' },
            { label: '8 -', value: '8' },
            { label: '9 -', value: '9' },
            { label: '10 - Most Notification', value: '10' },
          ]}
          selectedValue={formData.staff2}
          onValueChange={(value) =>
            setFormData({ ...formData, staff2: value })
          }
          style={{ flex: 1, marginRight: 10 }}
        />

        <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>Engagement</Text>
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >What are the key activities you engaged in with the clients today? Describe in key points</Text>
        <TextInput 
        value={engagement1} 
        placeholder="Key activities with client today..."
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        onChangeText={setEngagement1} 
        style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000', 
        backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}  />
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >how did they engage? (On a rating of 1 to 10).</Text>
        <components.Dropdown
          items={[
            { label: '1 - Less Engaged', value: '1' },
            { label: '2 -', value: '2' },
            { label: '3 -', value: '3' },
            { label: '4 -', value: '4' },
            { label: '5 - Average Engaged', value: '5' },
            { label: '6 -', value: '6' },
            { label: '7 -', value: '7' },
            { label: '8 -', value: '8' },
            { label: '9 -', value: '9' },
            { label: '10 - Most Engaged', value: '10' },
          ]}
          selectedValue={formData.engagement2}
          onValueChange={(value) =>
            setFormData({ ...formData, engagement2: value })
          }
          style={{ flex: 1, marginRight: 10 }}
        />

        <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>Self Manage</Text>
         <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Was the participant capable of taking self care/management?</Text>
         <components.Dropdown
          items={[
            { label: 'Select Option', value: '' },
            { label: 'YES', value: 'yes' },
            { label: 'NO', value: 'no' },
          ]}
          selectedValue={formData.manage}
          onValueChange={(value) =>
            setFormData({ ...formData, manage: value })
          }
          style={{ flex: 1, marginRight: 10 }}
        />
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >If NO, please describe in key notes why?</Text>
        <TextInput 
        value={manage1} 
        placeholder="Describe why, in key notes..."
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        onChangeText={setManage1} 
        style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000', 
        backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}  />

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >how did they self manage? (On a rating of 1 to 10).</Text>
        <components.Dropdown
          items={[
            { label: '1 - Less Managed', value: '1' },
            { label: '2 -', value: '2' },
            { label: '3 -', value: '3' },
            { label: '4 -', value: '4' },
            { label: '5 - Average Managed', value: '5' },
            { label: '6 -', value: '6' },
            { label: '7 -', value: '7' },
            { label: '8 -', value: '8' },
            { label: '9 -', value: '9' },
            { label: '10 - Most Managed', value: '10' },
          ]}
          selectedValue={formData.manage2}
          onValueChange={(value) =>
            setFormData({ ...formData, manage2: value })
          }
          style={{ flex: 1, marginRight: 10 }}
        />

         <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>Risk Event</Text>
         <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Were there any reportable incidents today?</Text>
         <components.Dropdown
          items={[
            { label: 'Select Option', value: '' },
            { label: 'YES', value: 'yes' },
            { label: 'NO', value: 'no' },
          ]}
          selectedValue={formData.risk}
          onValueChange={(value) =>
            setFormData({ ...formData, risk: value })
          }
          style={{ flex: 1, marginRight: 10 }}
        />
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >If YES, please briefly explain:</Text>
        <TextInput 
        value={risk1}  
        placeholder="Briefly explain..."
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        onChangeText={setRisk1} 
        style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000', 
        backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}  />

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >how severe was the incident? (On a rating of 1 to 10).</Text>
        <components.Dropdown
          items={[
            { label: '1 - Less Severe', value: '1' },
            { label: '2 -', value: '2' },
            { label: '3 -', value: '3' },
            { label: '4 -', value: '4' },
            { label: '5 - Average Severe', value: '5' },
            { label: '6 -', value: '6' },
            { label: '7 -', value: '7' },
            { label: '8 -', value: '8' },
            { label: '9 -', value: '9' },
            { label: '10 - Most Severe', value: '10' },
          ]}
          selectedValue={formData.risk2}
          onValueChange={(value) =>
            setFormData({ ...formData, risk2: value })
          }
          style={{ flex: 1, marginRight: 10 }}
        />

        <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>Documentation</Text>
         <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Were you able to complete all required documentation for the day?</Text>
         <components.Dropdown
          items={[
            { label: 'Select Option', value: '' },
            { label: 'YES', value: 'yes' },
            { label: 'NO', value: 'no' },
          ]}
          selectedValue={formData.documentation}
          onValueChange={(value) =>
            setFormData({ ...formData, documentation: value })
          }
          style={{ flex: 1, marginRight: 10 }}
        />
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >If NO, please specify any challenges you faced in documentation:</Text>
        <TextInput 
        value={documentation1}
        placeholder="Specify any challenges faced..."
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'} 
        onChangeText={setDocumentation1} 
        style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}  />
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Suggestions for improvement: Do you have any suggestions for improving the support provided or any process within the team?</Text>
        <TextInput 
        value={documentation2} 
        placeholder="Provide your suggestions for improvement..."
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        onChangeText={setDocumentation2} 
        style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}  />


        <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>Self-Reflection (Summary)</Text>
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >How do you feel about your performance today?</Text>
        <TextInput 
        value={summary1} 
        placeholder="Share your thoughts on your performance today..."
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        onChangeText={setSummary1} 
        style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}  /> 
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Suggestions for improvement:</Text>
        <TextInput 
        value={summary2} 
        placeholder="What improvements would you suggest?"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        onChangeText={setSummary2} 
        style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}  />

        <Button mode="contained" onPress={handleSubmit} style={[styles.button,{marginBottom:140, color: theme === 'dark' ? '#fff' : '#000'}]}>
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

export default EodForm;
