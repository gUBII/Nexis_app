import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {components} from '../components';
import { useTheme } from '../constants/ThemeContext';
import BottomTabBar from './tabs/BottomTabBar';

const EditCampaignForm = ({ route, navigation }) => {
  const { campaign } = route.params;
   const {theme} = useTheme();

  const [campaignName, setCampaignName] = useState(campaign.campaign_name);
  const [plan, setPlan] = useState(campaign.plan);
  const [priority, setPriority] = useState(campaign.priority);
  const [possibility, setPossibility] = useState(campaign.possibility);
  const [opportunity, setOpportunity] = useState(campaign.opportunity);
  // const [manager, setManager] = useState(
  //   `${campaign.username || ''}${campaign.username2 ? ', ' + campaign.username2 : ''}`
  // );

  const [userOptions, setUserOptions] = useState([]);
// const [managerid, setManagerid] = useState(String(campaign.manager)); 
const [managerid, setManagerid] = useState(
  `${campaign.username || ''}${campaign.username2 ? ', ' + campaign.username2 : ''}`
);



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

        // setUserOptions([{ label: 'Select Manager', value: '' }, ...options]);
        // const updatedOptions = [{ label: managerid, value: managerid }, ...options];
        const updatedOptions = [{ label: 'Select Manager', value: managerid }, ...options];
        setUserOptions(updatedOptions);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  fetchUsers();
}, []);

  

  const handleUpdate = async () => {
    const ref_db = await AsyncStorage.getItem('ref_db'); 
    const userid = await AsyncStorage.getItem('secondaryId');

    try {
      const response = await axios.post('https://app.nexis365.com/api/update-campaign', {
        id: campaign.id, // campaign id to identify the record
        campaignName,
        plan,
        priority,
        possibility,
        opportunity, 
        managerid,
        ref_db,
        userid 
      });

      if (response.data.success) {
        Alert.alert("Updated", "Campaign updated successfully");
        navigation.goBack();
      } else {
        Alert.alert("Error", response.data.message || "Failed to update campaign");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

    const renderHeader = () => {
      return <components.Header
       logo={false}
       goBack={true}
       creditCard={true} />;
    };

  return (
    <View style={{backgroundColor: theme === 'dark' ? '#333' : '#fff', flex:1}} > 
       <ScrollView contentContainerStyle={styles.scrollContent}>
       {renderHeader()}
       <ScrollView style={[styles.container]}>
      <Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Campaign Name:</Text>
      <TextInput style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000'}]} value={campaignName} onChangeText={setCampaignName} />

      <Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Plan:</Text>
      <TextInput style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000'}]} value={plan} onChangeText={setPlan} />

      <Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Priority:</Text>
      {/* <TextInput style={styles.input} value={priority} onChangeText={setPriority} /> */}
      <components.Dropdown
        items={[
          { label: 'Select Priority', value: '' },
          { label: 'High', value: 'High' },
          { label: 'Medium', value: 'Medium' },
          { label: 'Low', value: 'Low' },
        ]}
        selectedValue={priority}
        onValueChange={(value) => setPriority(value)}
        style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000'}]}
      />

      <Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Manager:</Text>
      {/* <TextInput
        style={styles.input}
        value={manager}
        onChangeText={setManager}
        placeholder="Enter manager(s)"
      /> */}

      <components.Dropdown
        items={userOptions}
        selectedValue={managerid}
        onValueChange={(value) => setManagerid(value)}
        style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000'}]}
      />

      <Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Possibility:</Text>
      <TextInput style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000'}]} value={possibility} onChangeText={setPossibility} />

      <Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Opportunity:</Text>
      <TextInput style={[styles.input,{marginBottom:20, color: theme === 'dark' ? '#fff' : '#000'}]} value={opportunity} onChangeText={setOpportunity} />

      <Button title="Update Campaign" onPress={handleUpdate} style={{ padding:5 }} />
    </ScrollView>
       </ScrollView>
     <BottomTabBar/>
    </View>
  );
};

export default EditCampaignForm;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100, 
  },
  container: { padding: 20},
  label: { fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 2, borderColor: '#ccc', borderColor: '#55CBF5', borderRadius: 10, padding: 10, marginTop: 5 }
});
