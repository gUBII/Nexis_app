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
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ViewCampaign= ({ theme }) => {
  const navigation = useNavigation();
  const [campaigns, setCampaigns] = useState([]);
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);
  const [actionMenuIndex, setActionMenuIndex] = useState(null);

  useFocusEffect(
    useCallback(() => {
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
    navigation.navigate('EditCampaignForm', { campaign: item });
  };

  const handleSuspend = async (item) => {
    const ref_db = await AsyncStorage.getItem("ref_db");
  
    const newStatus = item.status === "ON" ? "OFF" : "ON"; 
  
    try {
      const response = await axios.post("https://app.nexis365.com/api/update-campaign-status", {
        ref_db,
        campaignId: item.id,
        newStatus, 
      });
  
      if (response.data.success) {
        // Update local state
        const updatedCampaigns = campaigns.map((camp) =>
          camp.id === item.id ? { ...camp, status: newStatus } : camp
        );
        setCampaigns(updatedCampaigns);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };
  


  return (
    <ScrollView>
      <View style={[styles.table, { backgroundColor: theme === 'dark' ? '#222' : '#fff' }]}>
        <View style={styles.tableHeader}>
          {['Campaign Name', 'Plan', 'Priority', 'Status', ''].map((heading, index) => (
            <Text key={index} style={[styles.headerText, index === 4 && { flex: 0.5 }, {color: theme === 'dark' ? '#fff' : '#000'}]}>{heading}</Text>
          ))}
        </View>

        {campaigns.map((item, index) => (
          <View key={index}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => toggleExpandRow(index)}
              style={styles.tableRow}
            >
              <Text style={[styles.cell, {color: theme === 'dark' ? '#fff' : '#000'}]}>{item.campaign_name}</Text>
              <Text style={[styles.cell, {color: theme === 'dark' ? '#fff' : '#000'}]}>{item.plan}</Text>
              <Text style={[styles.cell, {color: theme === 'dark' ? '#fff' : '#000'}]}>{item.priority}</Text>
              <Text style={[styles.cell, {color: theme === 'dark' ? '#fff' : '#000'}]}>{item.status}</Text>

              <TouchableOpacity
                 onPress={() => toggleExpandRow(index)} 
                style={styles.moreIconCell}
              >
                <Icon name="more-vert" size={22} style={{ color: theme === 'dark' ? '#fff' : '#000' }} />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Action Menu */}
          
 
            {/* Dropdown Detail */}
            {expandedRowIndex === index && (
              <View style={[styles.dropdownContainer, { backgroundColor: theme === 'dark' ? '#222' : '#fff' }]}>
                <Text style={[styles.dropdownItem, {color: theme === 'dark' ? '#fff' : '#000'}]}><Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Manager:</Text>  {item.username} {item.username2}</Text>
                <Text style={[styles.dropdownItem, {color: theme === 'dark' ? '#fff' : '#000'}]}><Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Start Date:</Text> {moment.unix(item.start_date).format('DD-MM-YYYY')}</Text>
                <Text style={[styles.dropdownItem, {color: theme === 'dark' ? '#fff' : '#000'}]}><Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Possibility:</Text> {item.possibility}</Text>
                <Text style={[styles.dropdownItem, {color: theme === 'dark' ? '#fff' : '#000'}]}><Text style={[styles.label, {color: theme === 'dark' ? '#fff' : '#000'}]}>Opportunity:</Text> {item.opportunity}</Text>
                <View style={styles.menuActions}>
                <TouchableOpacity style={styles.buttonEdit} onPress={() => handleEdit(item)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={item.status === "ON" ? styles.buttonSuspend : styles.buttonEdit}
                onPress={() => handleSuspend(item)}
                >
                <Text style={styles.buttonText}>{item.status === "ON" ? "Suspend" : "Active"}</Text>
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

export default ViewCampaign;

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
  menuActions: {
    flexDirection: 'row',
    paddingLeft: 10,
    marginBottom: 10,
    gap: 10,
  },
  buttonEdit: {
    backgroundColor: '#21AFF0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonSuspend: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
