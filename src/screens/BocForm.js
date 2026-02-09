import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { RadioButton, Checkbox, Button, Menu, Provider } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {components} from '../components';
import axios from "axios";
import { useTheme } from "../constants/ThemeContext";

const BocForm = ({theme}) => {
  const [userId, setUserId] = useState([]);
  const [refDb, setRefDb] = useState([]);
  const [bocType, setBocType] = useState([]);
  const [bocFrequency, setBocFrequency] = useState("");
  const [bocDuration, setBocDuration] = useState("");
  const [earlyWarningex, setEarlyWarningex] = useState("");
  const [preBoc, setPreBoc] = useState("");
  const [bocParticipant, setBocParticipant] = useState("");
  const [reinforcement, setReinforcement] = useState("");
  const [suggestion, setSuggestion] = useState("");  
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [other, setOther] = useState("");
  const [other1, setOther1] = useState("");
  const [other2, setOther2] = useState("");
  const [other3, setOther3] = useState("");
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
    clientName:'',
    menstrualCycle: '',
    earlyWarning: '',
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
      setShowDatePicker(Platform.OS === "ios"); 
    };

  const bocTypes = [
    "Absconding/Wandering",
    "Binge eating",
    "Verbal aggression",
    "Physical aggression",
    "Property Damage",
    "Sleeping issues",
    "Social isolation",
    "Refusing to engage",
    "Other",
  ];

  const handleCheckboxToggle = (type) => {
    setBocType((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  const handleFrequencyChange = (freq) => {
    setBocFrequency(freq);
  };  

  const clientOptions = projectTeams.map((item) => ({
    label: `${item.username} ${item.username2}`,
    value: String(item.clientid),
  }));

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
  
    const bocTypeString = bocType.join(", ");
  
    try {
      const response = await axios.get("https://app.nexis365.com/api/insert-boc", {
        params: {
          userid: userId,
          ref_db: refDb,
          type: bocTypeString,
          freq: bocFrequency,
          date: Math.floor(date.getTime() / 1000),
          other,
          other1,
          dur:bocDuration,
          other3,
          earlywining:formData.earlyWarning,
          earlyWarningex,
          bocParticipant,
          preBoc, 
          reinforcement,
          information:formData.menstrualCycle,
          additionalInfo,
          suggestion,
          clientid:formData.clientid,
          status:1
        },
      });
  
      console.log("Sending BOC data:", {
        userid: userId,
        ref_db: refDb,
        type: bocTypeString,
        freq: bocFrequency,
        date: Math.floor(date.getTime() / 1000),
        other,
        other1,
        dur:bocDuration,
        other3,
        earlywining:formData.earlyWarning,
        earlyWarningex,
        bocParticipant,
        preBoc,  
        reinforcement,
        information:formData.menstrualCycle,
        additionalInfo,
        suggestion,
        clientid:formData.clientid,
        status,
      });  
  
      if (response.data.success) {
        Alert.alert("Success", "BOC record submit successfully!");
      } else {
        Alert.alert("Error", "Failed to update BOC record.");
      }
    } catch (error) {
      console.error("Error updating BOC:", error);
      Alert.alert("Error", "Something went wrong!");
    }
  };
  
  


  return (
    <Provider>
      <ScrollView style={{ padding: 20, backgroundColor: theme === 'dark' ? '#333' : '#fff',  }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, color: theme === 'dark' ? '#fff' : '#000', }}>BOC Reporting</Text>

          {/* Date Picker */}
        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>Date:</Text>
        <TouchableOpacity onPress={showPicker}
         style={[styles.input,{color: theme === 'dark' ? '#fff' : '#000',
         backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}>
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

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>Client Name:</Text>
        <components.Dropdown
          items={[{ label: 'Select Client', value: '' }, ...clientOptions]}
          selectedValue={formData.clientid}
          onValueChange={(value) =>
            setFormData((prevData) => ({ ...prevData, clientid: value }))
          }
          style={{ flex: 1, marginRight: 10, }}
        />

        <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>BoC Type</Text>
        {bocTypes.map((type) => (
          <RadioButton.Item
            label={type}
            value={type}
            status={bocType.includes(type) ? "checked" : "unchecked"}
            onPress={() => handleCheckboxToggle(type)}
            key={type}
            labelStyle={{ color: theme === 'dark' ? 'white' : 'black' }}
          />
        ))}

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>If Other, Please Specify:</Text>
        <TextInput value={other} 
        onChangeText={setOther} 
        placeholder="Enter other reason"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        style={[styles.input, {color: theme === 'dark' ? '#000' : '#000',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',
        }]} />

        <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>BoC Frequency</Text>
        {["Once", "Twice", "Three times", "Four times or more", "Other"].map((freq) => (
          <RadioButton.Item
            label={freq}
            value={freq}
            status={bocFrequency === freq ? "checked" : "unchecked"}
            onPress={() => handleFrequencyChange(freq)} 
            key={freq}
            labelStyle={{ color: theme === 'dark' ? 'white' : 'black' }}
          />
        ))}

          <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>If Other, Please Specify:</Text>
          <TextInput 
          value={other1} 
          onChangeText={setOther1} 
          placeholder="Enter other reason"
          placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
          style={[styles.input, {color: theme === 'dark' ? '#000' : '#000',
          backgroundColor: theme === 'dark' ? '#333' : '#fff',
          }]} />

        <Text style={[styles.sectionTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>BoC Duration</Text>
        {["A couple of minutes or less", "5 minutes or less", "10 minutes or less", "30 minutes or less", "An hour or less", "Majority of the day", "Other"].map((dur) => (
          <RadioButton.Item
            label={dur}
            value={dur}
            status={bocDuration === dur ? "checked" : "unchecked"}
            onPress={() => setBocDuration(dur)}
            key={dur}
            labelStyle={{ color: theme === 'dark' ? 'white' : 'black' }}
          />
        ))}

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}}>If Other, Please Specify:</Text>
        <TextInput 
        value={other3} 
        onChangeText={setOther3} 
        placeholder="Enter other reason"
          placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
          style={[styles.input, {color: theme === 'dark' ? '#000' : '#000',
          backgroundColor: theme === 'dark' ? '#333' : '#fff',
          }]} />

        <Text style={[styles.sectionTitle,{marginBottom:10, color: theme === 'dark' ? '#fff' : '#000'}]}>Early Warning Signs</Text>

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Did you see any early warining signs?</Text>
        <components.Dropdown
          items={[
            { label: 'Select Option', value: '' },
            { label: 'YES', value: 'yes' },
            { label: 'NO', value: 'no' },
          ]}
          selectedValue={formData.earlyWarning}
          onValueChange={(value) =>
            setFormData({ ...formData, earlyWarning: value })
          }
          style={{ flex: 1, marginRight: 10 }}
        />

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Please leave blank if the answer is NO, if YES, please explain the early warning signs</Text>
        <TextInput 
        value={earlyWarningex} 
        placeholder="Describe early warning signs (if any)"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'} 
        onChangeText={setEarlyWarningex} 
        style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}  />

        <Text style={[styles.sectionTitle,{marginBottom:10, color: theme === 'dark' ? '#fff' : '#000'}]}>Pre-BoC Situation</Text>

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Participant's Activity Before BoC:</Text>
        <TextInput 
        value={bocParticipant} 
        placeholder="Describe participant's activity before BoC"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        onChangeText={setBocParticipant} 
        style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}  />

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Description of Pre-BoC Situation:</Text>
        <TextInput 
        value={preBoc} 
        placeholder="Briefly describe the situation before BoC"
         placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        onChangeText={setPreBoc} 
        style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}  />

        <Text style={[styles.sectionTitle,{marginBottom:10, color: theme === 'dark' ? '#fff' : '#000'}]}>Reinforcement Factors</Text>

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Possible Reinforcements for BoC:</Text>
        <TextInput 
        value={reinforcement} 
        placeholder="List possible reinforcements for BoC"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        onChangeText={setReinforcement} 
        style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}  />

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Is the participant on their menstrual cycle?</Text>
        <components.Dropdown
          items={[
            { label: 'Select Option', value: '' },
            { label: 'YES', value: 'yes' },
            { label: 'NO', value: 'no' },
          ]}
          selectedValue={formData.menstrualCycle}
          onValueChange={(value) =>
            setFormData({ ...formData, menstrualCycle: value })
          }
          style={{ flex: 1, marginRight: 10 }}
        /> 

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Any Other Information:</Text>
        <TextInput 
        value={additionalInfo} 
        placeholder="Enter any other relevant information"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        onChangeText={setAdditionalInfo} 
        style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',}]}  />

        <Text style={{color: theme === 'dark' ? '#fff' : '#000'}} >Suggestions for improvement:</Text>
        <TextInput 
        value={suggestion} 
        placeholder="Enter your suggestions for improvement"
        placeholderTextColor={theme === 'dark' ? '#fff' : '#000'}
        onChangeText={setSuggestion} 
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

export default BocForm;
