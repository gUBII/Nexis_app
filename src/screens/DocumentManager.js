import {View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ScrollView, Dimensions} from 'react-native';
import React, { useState, useRef } from 'react';
import { components } from '../components';
import { useTheme } from '../constants/ThemeContext';
import BottomTabBar from './tabs/BottomTabBar';
import ViewCategory from './ViewCategory';
import AddCategory from './AddCategory';
import AddDocument from './AddDocument';
  
const { width } = Dimensions.get('window');
  
  const DocumentManager = () => {    
    const { theme } = useTheme();
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedAction, setSelectedAction] = useState('View Category');
    const [dropdownTop, setDropdownTop] = useState(0);
    const dropdownButtonRef = useRef(null);
    const [status, setStatus] = useState('');
    const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);

  
    const renderHeader = () => (
      <components.Header
        logo={false}
        goBack={true}
        creditCard={true}
      />
    );
  
    const handlePress = (label) => {
      setSelectedAction(label);
      setShowDropdown(false);
    };
  
    const toggleDropdown = () => {
      dropdownButtonRef.current?.measure((fx, fy, w, h, px, py) => {
        setDropdownTop(py + h);
        setShowDropdown(!showDropdown);
      });
    };
  
    const Content = () => (
      <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
        <ScrollView contentContainerStyle={[styles.contentContainer, { paddingBottom: 120 }]}>
          <View style={styles.actionRow}>
            {/* Left: Selected Action Button */}
           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.actionButtonDisabled} disabled>
              <Text style={[styles.actionButtonText1, { color: theme === 'dark' ? '#fff' : '#000', }]}>{selectedAction}</Text>
            </TouchableOpacity>

            {selectedAction === 'View Category' && (
              <TouchableOpacity
                style={[styles.actionButton, ]}
                onPress={() => setStatusDropdownVisible(!statusDropdownVisible)}
              >
                <Text style={styles.actionButtonText}>
                  {status === '' ? 'Status ▼' : (status === '1' ? 'Active ▼' : 'Inactive ▼')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

  
            {/* Right: Dropdown Toggle */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={toggleDropdown}
              ref={dropdownButtonRef}
            >
              <Text style={styles.actionButtonText}>Select Action ▼</Text>
            </TouchableOpacity> 
          </View>
  
          {/* Render Selected Form */}
          {selectedAction === 'View Category' && <ViewCategory theme={theme}
            status={status} setStatus={setStatus} showStatusDropdown={statusDropdownVisible} />}
          {selectedAction === 'Add Category' && <AddCategory theme={theme} />}
          {selectedAction === 'Add Document' && <AddDocument theme={theme} />}
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  
    return (
      <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5' }}>
        {renderHeader()}
        {Content()}
        {/* Absolute Dropdown */}
        {showDropdown && (
          <View style={[styles.dropdown, { top: dropdownTop, right: 14,  backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePress('View Category')}>
              <Text style={[styles.dropdownItemText, {color: theme === 'dark' ? '#fff' : '#000'}]}>View Category</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePress('Add Category')}>
              <Text style={[styles.dropdownItemText, {color: theme === 'dark' ? '#fff' : '#000'}]}>Add Category</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePress('Add Document')}>
              <Text style={[styles.dropdownItemText, {color: theme === 'dark' ? '#fff' : '#000'}]}>Add Document</Text>
            </TouchableOpacity>
          </View>
        )}

           {statusDropdownVisible && selectedAction === 'View Category' && (
          <View style={[styles.dropdowns, { backgroundColor: theme === 'dark' ? '#333' : '#fff', right: 16 }]}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setStatus('1');
                setStatusDropdownVisible(false);
              }}
            >
              <Text style={[styles.dropdownItemText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setStatus('0');
                setStatusDropdownVisible(false);
              }}
            >
              <Text style={[styles.dropdownItemText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Inactive</Text>
            </TouchableOpacity>
          </View>
        )}
        <BottomTabBar />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    contentContainer: {
      padding: 16,
      flexGrow: 1,
    },
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    actionButton: {
      backgroundColor: '#21AFF0',
      paddingVertical: 12,
      paddingHorizontal: 5,
      borderRadius: 8,
      width: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionButtonDisabled: {
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center', 
    },
    actionButtonText1: {
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 14,
    },
    actionButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 12,
    },
    dropdown: {
      position: 'absolute',
      zIndex: 1000,
      backgroundColor: '#fff',
      borderRadius: 8,
      elevation: 5,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      paddingVertical: 8,
      width: 120,
      marginTop:3,
    },
      dropdowns: {
      position: 'absolute',
      zIndex: 1200,
      backgroundColor: '#fff',
      borderRadius: 8,
      elevation: 5,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      paddingVertical: 8,
      width: 100,
      marginRight:120,
      marginTop:108,
    },

    dropdownItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    dropdownItemText: {
      fontSize: 14,
    },
  });
  
  export default DocumentManager;
  