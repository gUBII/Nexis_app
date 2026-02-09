import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { components } from '../components'; // Assuming components includes the Header
import { useTheme } from '../constants/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import {svg} from '../assets/svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {setScreen} from '../store/tabSlice';
import BottomTabBar from './tabs/BottomTabBar';

const Modules = ({ route, navigation }) => {
  const { itemId, itemName } = route.params; // Access the itemId passed from the Dashboard component
  const { theme } = useTheme();

  const [modulesData, setModulesData] = useState([]);
  const [modulesPData, setModulesPData] = useState([]);
  const [modulesPSData, setModulesPSData] = useState([]); // New state for modulesPSData
  const [expandedModule, setExpandedModule] = useState(null);
  const dispatch = useDispatch();
  const currentTabScreen = useSelector((state) => state.tab.screen);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const email = await AsyncStorage.getItem('secondaryUnbox');
        const ref_db = await AsyncStorage.getItem('ref_db');
        const application = await AsyncStorage.getItem('application');

        if (email && ref_db && application) {
          const [modulesResponse, modulesPResponse, modulesPSResponse] = await Promise.all([
            axios.post('https://app.nexis365.com/api/modulesmenu', { email, ref_db, application }),
            axios.post('https://app.nexis365.com/api/modulespmenu', { email, ref_db, application }),
            axios.post('https://app.nexis365.com/api/modulespsmenu', { email, ref_db, application }), // Added the missing API call
          ]);

          setModulesData(modulesResponse.data);
          setModulesPData(modulesPResponse.data);
          setModulesPSData(modulesPSResponse.data); // Setting data for modulesPS
        } else {
          console.error("Unbox, ref_db, or application not found in AsyncStorage.");
        }
      } catch (error) {
        console.error('Failed to fetch menu data:', error);
      }
    };
    fetchMenuData();
  }, []);

  const renderHeader = () => {
    return <components.Header logo={false} goBack={true} creditCard={false} />;
  };

  // Filter the modules based on the passed itemId
  const filteredModulesData = modulesData.filter(module => module.parent === itemId);
  const filteredSubModulesData = modulesPData.filter(subModule => subModule.parent === itemId);

  const handleModuleClick = (moduleId) => {
    const hasSubModules = modulesPData.some(subModule => subModule.parent === moduleId);
    if (hasSubModules) {
      setExpandedModule(moduleId); // Expand the module
    } else {
      navigateToWebView(moduleId);
    }
  };

  const handleSubModuleClick = (subModuleId) => {
    const hasSubSubModules = modulesPSData.some(subSubModule => subSubModule.parent === subModuleId);
    if (hasSubSubModules) {
      setExpandedModule(subModuleId); // Expand the submodule
    } else {
      navigateToWebView(subModuleId);
    }
  };

  const navigateToWebView = (moduleId) => {
    const module = [...filteredModulesData, ...filteredSubModulesData, ...modulesPSData].find(m => m.id === moduleId);
    const formattedName = module.name.toLowerCase().replace(' ', '_');
    const url = `https://www.nexis365.com/saas/index.php?url=${formattedName}.php&id=${module.id}&sourcefrom=APP`;
    console.log('Navigating to URL:', url);
    navigation.navigate('Webview', { url });
  };

  const subModulesToShow = modulesPData.filter(subModule => subModule.parent === expandedModule);
  const subSubModulesToShow = modulesPSData.filter(subSubModule => subSubModule.parent === expandedModule);

  return (
    <View style={{ flex: 1,  backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5', }}>
      {renderHeader()}

       {/* Display itemName at the top */}
       <View style={{ padding: 16,
        //  backgroundColor: '#EFEFEF'
        
 backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
          }}>
        <Text style={{ fontSize: 18,
           fontWeight: 'bold',
            // color:'black'
            color: theme === 'dark' ? '#f5f5f5' : '#000',
             }}>{itemName}</Text>
      </View>

      <ScrollView style={{ marginTop: 20,  backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5', }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 10,  }}>
          {expandedModule === null ? (
            filteredModulesData.map((module) => {
              const hasSubModules = modulesPData.some(subModule => subModule.parent === module.id);

              return (
                <TouchableOpacity
                  key={module.id}
                  onPress={() => handleModuleClick(module.id)}
                  style={{
                    width: responsiveWidth(43),
                    backgroundColor: '#21AFF0',
                    marginBottom: 10,
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: responsiveWidth(3.4),
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 16, color: theme === 'dark' ? '#fff' : '#000', }}>{module.name}</Text>
                    {hasSubModules && (
                      <Ionicons name="chevron-forward" size={20} style={{ color: theme === 'dark' ? '#fff' : '#000' }} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            subModulesToShow.map((subModule) => (
              <View
                key={subModule.id}
                style={{
                  width: responsiveWidth(43),
                  backgroundColor: '#21AFF0',
                  marginBottom: 10,
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: responsiveWidth(3.4),
                  elevation: 2,
                }}
              >
                <TouchableOpacity
                  onPress={() => handleSubModuleClick(subModule.id)}
                  style={{ width: '100%' }}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: theme === 'dark' ? '#fff' : '#000', }}>{subModule.name}</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
          {expandedModule !== null && subSubModulesToShow.length > 0 && (
            subSubModulesToShow.map((subSubModule) => (
              <View
                key={subSubModule.id}
                style={{
                  width: responsiveWidth(43),
                  backgroundColor: '#21AFF0',
                  marginBottom: 10,
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: responsiveWidth(3.4),
                  elevation: 2,
                }}
              >
                <TouchableOpacity
                  onPress={() => navigateToWebView(subSubModule.id)}
                  style={{ width: '100%' }}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: theme === 'dark' ? '#fff' : '#000', }}>{subSubModule.name}</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
        {expandedModule !== null && (
          <TouchableOpacity
            onPress={() => setExpandedModule(null)}
            style={{ marginTop: 10, alignSelf: 'center', padding: 10, backgroundColor: '#21AFF0', borderRadius: 5 }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#000', }}>Back</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      {/* {renderBottomTab()} */}
      <BottomTabBar/>
    </View>
  );
};

export default Modules;
