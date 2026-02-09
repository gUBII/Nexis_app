import React, { useEffect, useState,  useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ViewLead= ({ theme }) => {
  const [leads, setLeads] = useState([]);
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);
  const [actionMenuIndex, setActionMenuIndex] = useState(null);
  const navigation = useNavigation();
  

   useFocusEffect(
    useCallback(() => {
      const fetchLeads = async () => {
        const ref_db = await AsyncStorage.getItem("ref_db");
        const userid = await AsyncStorage.getItem("secondaryId");
  
        if (!ref_db || !userid) return;
  
        try {
          const response = await axios.get("https://app.nexis365.com/api/get-leads", {
            params: { ref_db, userid }
          });
  
          if (response.data.success) {
            setLeads(response.data.data);
          }
        } catch (error) {
          console.error("Failed to fetch campaigns:", error);
        }
      };
  
      fetchLeads();
    }, [])
  );

  const toggleExpandRow = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedRowIndex(prev => (prev === index ? null : index));
    setActionMenuIndex(null); // close action menu if open
  }; 

  const toggleActionMenu = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActionMenuIndex(prev => (prev === index ? null : index));
  };

  const handleEdit = (item) => {
    navigation.navigate('EditLeadForm', { leads: item });
  };

  const handleCall = (item) => {
    navigation.navigate('Call', { leads: item });
  };

  const handleEmail = (item) => {
    navigation.navigate('Email', { leads: item });
  };

  const handleMinutes = (item) => {
    navigation.navigate('Minutes', { leads: item });
  };

  const handleCases = (item) => {
    navigation.navigate('Cases', { leads: item });
  };

  const handleQuotes = (item) => {
    navigation.navigate('Quote', { leads: item });
  };

  
  const handleDeals = (item) => {
    navigation.navigate('Deal', { leads: item });
  };

  const handleOnboards = (item) => {
    navigation.navigate('Onboard', { leads: item });
  };
  
  const handleContracts = (item) => {
    navigation.navigate('Contract', { leads: item });
  };

  const handleSuspend = async (item) => {
    const ref_db = await AsyncStorage.getItem("ref_db");
  
    const newStatus = item.status === "1" ? "0" : "1";
  
    try {
      const response = await axios.post("https://app.nexis365.com/api/update-leads-status", {
        ref_db,
        leadId: item.id,
        newStatus, 
      });
  
      if (response.data.success) { 
        // Update local state
        const updatedLeads = leads.map((lead) =>
          lead.id === item.id ? { ...lead, status: newStatus } : lead
        );
        setLeads(updatedLeads);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };


  return (
    <ScrollView>
      <View style={[styles.table, { backgroundColor: theme === 'dark' ? '#222' : '#fff' }]}>
        <View style={styles.tableHeader}>
          {['Lead Name', 'Name', 'Status', ''].map((heading, index) => (
            <Text key={index} style={[styles.headerText, index === 3 && { flex: 0.5 }, {color: theme === 'dark' ? '#fff' : '#000'}]}>{heading}</Text>
          ))}
        </View>

        {leads.map((item, index) => (
          <View key={index}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => toggleExpandRow(index)} 
              style={styles.tableRow}
            >
              <Text style={[styles.cell, {color: theme === 'dark' ? '#fff' : '#000'}]}>{item.lead_name}</Text>
              <Text style={[styles.cell, {color: theme === 'dark' ? '#fff' : '#000'}]}>{item.name}</Text>
              <Text style={[styles.cell, {color: theme === 'dark' ? '#fff' : '#000'}]}>{item.status === "1" ? "ON" : "OFF"}</Text>

              <TouchableOpacity
                onPress={() => toggleExpandRow(index)}
                style={styles.moreIconCell}
              >
                <Icon name="more-vert" size={22} style={{ color: theme === 'dark' ? '#fff' : '#000' }} />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Dropdown Detail */}
            {expandedRowIndex === index && (
              <View style={[styles.dropdownContainer, {backgroundColor: theme === 'dark' ? '#222' : '#fff'}]}>
                <Text style={[styles.dropdownItem, {color: theme === 'dark' ? '#fff' : '#000'}]}><Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Employeeid:</Text> {item.username} {item.username2}</Text> 
                <Text style={[styles.dropdownItem, {color: theme === 'dark' ? '#fff' : '#000'}]}><Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Campaign:</Text> {item.campaign_name}</Text>
                <Text style={[styles.dropdownItem, {color: theme === 'dark' ? '#fff' : '#000'}]}><Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Surname:</Text> {item.surname}</Text>
                <Text style={[styles.dropdownItem, {color: theme === 'dark' ? '#fff' : '#000'}]}><Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Appointment Date:</Text>{moment.unix(item.appointment_date).format('DD-MM-YYYY')}</Text>
                <Text style={[styles.dropdownItem, {color: theme === 'dark' ? '#fff' : '#000'}]}><Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Followup Date:</Text>{moment.unix(item.followup_date).format('DD-MM-YYYY')}</Text>
                <Text style={[styles.dropdownItem, {color: theme === 'dark' ? '#fff' : '#000'}]}><Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Target Date:</Text> {moment.unix(item.target_date).format('DD-MM-YYYY')}</Text>
                <Text style={[styles.dropdownItem, {color: theme === 'dark' ? '#fff' : '#000'}]}><Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Preferred Name:</Text> {item.preferred_name}</Text>
                <Text style={[styles.dropdownItem, {color: theme === 'dark' ? '#fff' : '#000'}]}><Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Address:</Text> {item.address}</Text>
                <Text style={[styles.dropdownItem, {color: theme === 'dark' ? '#fff' : '#000'}]}><Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>City:</Text> {item.ccity}</Text>
                <Text style={[styles.dropdownItem, {color: theme === 'dark' ? '#fff' : '#000'}]}><Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Email:</Text> {item.email}</Text>
                <Text style={[styles.dropdownItem, {color: theme === 'dark' ? '#fff' : '#000'}]}><Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Contact Number:</Text> {item.rphone}</Text>
                <Text style={[styles.dropdownItem, {color: theme === 'dark' ? '#fff' : '#000'}]}><Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Date of Birth:</Text> {moment.unix(item.cdob).format('DD-MM-YYYY')}</Text>
              

              <View style={styles.menuActionsRow}>
                <TouchableOpacity style={[styles.buttonEdits,{backgroundColor: '#00b4d8',}]}
                onPress={() => handleCall(item)}>
                  <Text style={styles.buttonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonEdits,{backgroundColor: '#0077b6',}]}
                 onPress={() => handleEmail(item)}>
                  <Text style={styles.buttonText}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonEdits,{backgroundColor: '#4cc9f0',}]}
                onPress={() => handleMinutes(item)}>
                  <Text style={styles.buttonText}>Minutes</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.menuActionsRow}>
                <TouchableOpacity style={[styles.buttonEdits,{backgroundColor: '#00b4d8',}]}
                 onPress={() => handleCases(item)}>
                  <Text style={styles.buttonText}>Cases</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonEdits,{backgroundColor: '#00b4d8',}]}
                 onPress={() => handleQuotes(item)}>
                  <Text style={styles.buttonText}>Quote</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonEdits,{backgroundColor: '#f9c74f',}]}
                 onPress={() => handleDeals(item)}>
                  <Text style={styles.buttonText}>Deal</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.menuActionsRow}>

                <TouchableOpacity style={[styles.buttonEdits,{backgroundColor: '#52b788',}]}
                 onPress={() => handleContracts(item)}>
                  <Text style={styles.buttonText}>Contract</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonEdit} onPress={() => handleEdit(item)}>
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                  style={item.status === "1" ? styles.buttonSuspend : styles.buttonEdit}
                  onPress={() => handleSuspend(item)} 
                  >
                  <Text style={styles.buttonText}>{item.status === "1" ? "Suspend" : "Active"}</Text>
                </TouchableOpacity>
               </View>

              <View style={styles.menuActionsRow}>
                <TouchableOpacity style={[styles.buttonEdits,{backgroundColor: '#00b4d8',}]}
                // onPress={() => handleOnboards(item)}
                >
                  <Text style={styles.buttonText}>Onboard This Client</Text>
                </TouchableOpacity>
               
              </View>
              </View>
            )}
          </View> 
        ))}
      </View>
    </ScrollView>
  );
};

export default ViewLead;

const styles = StyleSheet.create({
  table: {
    flex: 1,
    padding: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    marginBottom: 4,
    borderColor: '#ccc',
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    color: '#333',
  },
  moreIconCell: {
    flex: 0.5,
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    paddingLeft: 15,
    borderLeftWidth: 3,
    borderColor: '#21AFF0',
    marginBottom: 10,
  },
  dropdownItem: {
    marginBottom: 6,
    fontSize: 14,
    color: '#444',
  },
  label: {
    fontWeight: 'bold',
  },
  menuActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    marginTop: 10,
    gap: 10, 
  },
  buttonEdit: {
    backgroundColor: '#21AFF0',
    padding: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  buttonEdits: {
    padding: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  buttonSuspend: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
