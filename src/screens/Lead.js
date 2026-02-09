import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, { useState, useRef } from 'react';
import { components } from '../components';
import { useTheme } from '../constants/ThemeContext';
import BottomTabBar from './tabs/BottomTabBar';
import CampaignForm from './CampaignForm';
import ViewCampaign from './ViewCampaign';
import LeadForm from './LeadForm';
import ViewLead from './ViewLead';

const { width } = Dimensions.get('window');

const Lead = () => {
  const { theme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAction, setSelectedAction] = useState('Create Lead'); // default
  const [dropdownTop, setDropdownTop] = useState(0);
  const dropdownButtonRef = useRef(null);

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
          <TouchableOpacity style={styles.actionButtonDisabled} disabled>
            <Text style={[styles.actionButtonText1, { color: theme === 'dark' ? '#fff' : '#000',}]}>{selectedAction}</Text>
          </TouchableOpacity>

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
        {selectedAction === 'Create Campaign' && <CampaignForm theme={theme} />}
        {selectedAction === 'Create Lead' && <LeadForm theme={theme} />}
        {selectedAction === 'View Campaign' && <ViewCampaign theme={theme} />}
        {selectedAction === 'View Lead' && <ViewLead theme={theme} />}
      </ScrollView>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5' }}>
      {renderHeader()}
      {Content()}
      {/* Absolute Dropdown */}
      {showDropdown && (
        <View style={[styles.dropdown, { top: dropdownTop, right: 16,  backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePress('Create Lead')}>
            <Text style={[styles.dropdownItemText, {color: theme === 'dark' ? '#fff' : '#000'}]}>Create Lead</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePress('Create Campaign')}>
            <Text style={[styles.dropdownItemText, {color: theme === 'dark' ? '#fff' : '#000'}]}>Create Campaign</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePress('View Campaign')}>
            <Text style={[styles.dropdownItemText, {color: theme === 'dark' ? '#fff' : '#000'}]}>View Campaign</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePress('View Lead')}>
            <Text style={[styles.dropdownItemText, {color: theme === 'dark' ? '#fff' : '#000'}]}>View Lead</Text>
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
    paddingHorizontal: 12,
    borderRadius: 8,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDisabled: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  actionButtonText1: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
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
    width: 160,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
  },
});

export default Lead;
