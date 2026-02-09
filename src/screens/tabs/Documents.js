import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTheme } from '../../constants/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export default function Documents() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const handleLeadNavigation = () => {
    navigation.navigate('Lead');
  };


  const handleManagerNavigation = () => {
    navigation.navigate('DocumentManager');
  };

  const buttons = [
    { name: 'EOD', route: 'EodForm', type: 'eod' },
    { name: 'BOC', route: 'BocForm', type: 'boc' },
    { name: 'INCIDENT', route: 'IncidentForm', type: 'incident' },
  ];
  
  const handleNavigation = (button) => { 
    console.log('Navigating to Screen:', button.route);
    navigation.navigate('Webview', { component: button.route, type: button.type });
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#000', marginBottom: 20 }}>
        My Documents
      </Text>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleNavigation(button)}
          style={{
            backgroundColor: '#21AFF0',
            paddingVertical: 14,
            paddingHorizontal: 10,
            marginBottom: 12,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 3,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
            {button.name}
          </Text>

        
        </TouchableOpacity>
      ))}
           <TouchableOpacity
        onPress={handleLeadNavigation}
        style={{
          backgroundColor: '#21AFF0',
          paddingVertical: 14,
          paddingHorizontal: 10,
          marginBottom: 12,
          borderRadius: 10, 
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 3,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
          LEAD
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleManagerNavigation}
        style={{
          backgroundColor: '#21AFF0',
          paddingVertical: 14,
          paddingHorizontal: 10,
          marginBottom: 12,
          borderRadius: 10, 
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 3,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
          DOCUMENT MANAGER
        </Text>
      </TouchableOpacity>  
    </View>
  );
}
