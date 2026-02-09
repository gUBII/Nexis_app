import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import { useTheme } from '../constants/ThemeContext';

const ViewCategory = ({ status, setStatus, showStatusDropdown }) => {
  const { theme } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [dropdownVisible, setDropdownVisible] = useState(false);

  

  useEffect(() => {
    fetchCategories(status);
  }, [status]);

  const fetchCategories = async (status = '') => {
    setLoading(true);
    try {
      const ref_db = await AsyncStorage.getItem('ref_db'); 
      const userid = await AsyncStorage.getItem('secondaryId');
      if (!ref_db || !userid) return alert('Missing data');

      const response = await axios.get('https://app.nexis365.com/api/view-category', {
        params: { ref_db, userid, status },
      });

      if (response.data.success) {
        setCategories(response.data.data);
        setActiveFilter(status);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render different views based on selection
  if (selectedCategory) {
    return (
      <ScrollView contentContainerStyle={styles.centered}>
        <Text style={[styles.categoryName, {color: theme === 'dark' ? '#fff' : '#000'}]}>Category: {selectedCategory.name}</Text>

        {selectedCategory.documents && selectedCategory.documents.length > 0 ? (
          selectedCategory.documents.map((doc, index) => { 
            const fileUrl = `https://app.nexis365.com/${doc.location}`;
            console.log("File URL:", fileUrl);
            const fileExtension = doc.location?.split('.').pop().toLowerCase();

            return (
              <View key={index} style={[styles.documentContainer, { backgroundColor: theme === 'dark' ? '#444' : '#fff' }]}>
                <Text style={[styles.categoryName, {color: theme === 'dark' ? '#fff' : '#000'}]}>Document Name: {doc.document_name}</Text>
                <Text style={[styles.categoryName, {color: theme === 'dark' ? '#fff' : '#000'}]}>Card Number: {doc.card_number || 'N/A'}</Text>
                <Text style={[styles.categoryName, {color: theme === 'dark' ? '#fff' : '#000'}]}>
                  Expire Date: {moment.unix(doc.expire_date).format('DD-MM-YYYY')}
                </Text>

                {doc.location ? (
                <TouchableOpacity onPress={() => Linking.openURL(fileUrl)}>
                  <Text style={[styles.categoryName, { color: '#21AFF0' }]}>
                    Download File ({fileExtension.toUpperCase()})
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={[styles.categoryName, {color: theme === 'dark' ? '#fff' : '#000'}]}>Location: N/A</Text>
              )}


              </View>
            );
          })
        ) : (
          <Text style={[styles.categoryName,{color: theme === 'dark' ? '#fff' : '#000'}]}>No documents found</Text>
        )}

        <TouchableOpacity onPress={() => setSelectedCategory(null)} style={styles.backButton}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  } 

  return (
    <ScrollView contentContainerStyle={styles.container}> 
      {loading ? ( 
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#21AFF0" /> 
        </View>
      ) : (
        categories.map((item, index) => (
          <TouchableOpacity
            key={index.toString()}
            style={styles.item}
            onPress={() => setSelectedCategory(item)} 
          >
            <Text style={[styles.name, {color: theme === 'dark' ? '#fff' : '#000'}]}>{item.name}</Text>
            <View style={styles.circle}>
              <Text style={styles.circleText}>{item.document_count}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 0, },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#21AFF0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#007ACC',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centered: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    width: '100%',
  },
  backButton: {
    backgroundColor: '#007ACC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
  },
  name: {
    padding:10,
    fontSize: 16,
    fontWeight: '600',
    width: '80%',
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#21AFF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    color: '#fff',
    fontWeight: 'bold', 
    fontSize: 14,
  }, 
  documentContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 300, 
    alignSelf: 'center',
  },



  dropdownContainer: {
  alignSelf: 'flex-end',
  marginLeft:50,
  marginBottom: 16,
  width: 160,
  
},
dropdownButton: {
  borderRadius: 8,
  paddingVertical: 12,
  paddingHorizontal: 16,
  backgroundColor: '#21AFF0',
},
dropdownOptions: {
  borderRadius: 8,
  marginTop: 8,
  overflow: 'hidden',
},
dropdownOption: {
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderBottomWidth: 1, 
  borderBottomColor: '#ccc',
},

});

export default ViewCategory;
