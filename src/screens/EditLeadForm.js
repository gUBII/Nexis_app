import { View, Text, StyleSheet, ScrollView, TextInput, Button, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react'
import BottomTabBar from './tabs/BottomTabBar'
import {components} from '../components';
import { useTheme } from '../constants/ThemeContext';
import axios from 'axios';

const EditLeadForm = ({ route, navigation }) => {
  const {theme} = useTheme();
  const { leads } = route.params;
  const [address, setAddress] = useState(leads.address);
  const [surname, setSurname] = useState(leads.surname);
  const [leadname, setLeadName] = useState(leads.lead_name);
  const [name, setName] = useState(leads.name);

  const handleUpdate = async () => {
    const ref_db = await AsyncStorage.getItem('ref_db'); 
    const userid = await AsyncStorage.getItem('secondaryId');

    try {
      const response = await axios.post('https://app.nexis365.com/api/update-lead', {
        id: leads.id, // campaign id to identify the record
        address,
        surname,
        leadname,
        name,
        ref_db,
        userid 
      }); 


      if (response.data.success) {
        Alert.alert("Updated", "Lead updated successfully");
        navigation.goBack();
      } else {
        Alert.alert("Error", response.data.message || "Failed to update Lead");
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

             <Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>LeadName:</Text>
             <TextInput style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000'}]} value={leadname} onChangeText={setLeadName} />

             <Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Name:</Text>
             <TextInput style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000'}]} value={name} onChangeText={setName} />

             <Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Address:</Text>
             <TextInput style={[styles.input, {color: theme === 'dark' ? '#fff' : '#000'}]} value={address} onChangeText={setAddress} />
       
             <Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Surname:</Text>
             <TextInput style={[styles.input,{marginBottom:20, color: theme === 'dark' ? '#fff' : '#000'}]} value={surname} onChangeText={setSurname} />
       
             <Button title="Update Lead"
              onPress={handleUpdate}
               style={{ padding:5 }} />
      </ScrollView>
    </ScrollView>
     <BottomTabBar/>
    </View>
  )
}

export default EditLeadForm;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100, 
  },
  container: { padding: 20},
  label: { fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 2, borderColor: '#ccc', borderColor: '#55CBF5', borderRadius: 10, padding: 10, marginTop: 5 }
});