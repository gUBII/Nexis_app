import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  Modal,
  Text,
  Switch,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { responsiveWidth} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {components} from '../components';
import {svg} from '../assets/svg';
import Icon from 'react-native-vector-icons/Feather'; 
import {useTheme} from '../constants/ThemeContext'; 
import Loader from './Loader';
import { useMenu } from '../constants/MenuContext';
import { useFocusEffect } from '@react-navigation/native';

const Header = ({
  goBack,
  creditCard,
  logo = true,
  favicon = true,
  user: propUser,
  title,
  userhead = true,
  containerStyle,
  titleStyle,
  goBackColor,
  file,
  more = true,
  notification = true,
  showToggleTheme = true,
}) => {
  const { refreshToggle, toggleRefresh } = useMenu(); 
  const navigation = useNavigation();
  const {theme, toggleTheme} = useTheme();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const sidebarTranslateX = useRef(new Animated.Value(300)).current;
  const [sideMenuData, setSideMenuData] = useState([]);
  const [modulesData, setModulesData] = useState([]);
  const [modulesPData, setModulesPData] = useState([]);
  const [modulesPSData, setModulesPSData] = useState([]); 
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);
  const [expandedSubModule, setExpandedSubModule] = useState(null); 
  const [selectedButton, setSelectedButton] = useState('active'); 
  const [menuData, setMenuData] = useState([]);
  const [toggleStates, setToggleStates] = useState({});
  const [moduleData, setModuleData] = useState([]);
  const [toggleState, setToggleState] = useState({});
  const [toggleChanged, setToggleChanged] = useState(false); 
  const [initialFetch, setInitialFetch] = useState(true);
  const [user, setUser] = useState({ images: ''});
  const [username, setUsername] = useState("");
  const [username2, setUsername2] = useState("");
   const [loading, setLoading] = useState(false);  
  
  useFocusEffect(
    React.useCallback(() => {
      const fetchUsername = async () => {
        try {
          const storedUsername = await AsyncStorage.getItem("secondaryUsername2");
          const storedUsername2 = await AsyncStorage.getItem("secondaryUsername");
          if (storedUsername) {
            setUsername(storedUsername);
          }
          if (storedUsername2) {
            setUsername2(storedUsername2);
          }
        } catch (error) {
          console.error("Failed to fetch username:", error);
        }
      };

      fetchUsername();
    }, []) 
  );


    // Fetch user data from AsyncStorage
    useEffect(() => {
      const fetchUserData = async () => {
        const images = await AsyncStorage.getItem('images');
        setUser({
            images });
      };
  
      fetchUserData();
    }, []);

useEffect(() => {
  const fetchModuleData = async () => {
    try {
      // Retrieve stored data from AsyncStorage
      const email = await AsyncStorage.getItem('secondaryUnbox');
      const ref_db = await AsyncStorage.getItem('ref_db');
      const application = await AsyncStorage.getItem('application');

      if (email && ref_db && application) {
        // Make an API call to fetch sidebar menu data
        const response = await axios.post('https://app.nexis365.com/api/modu', {
          email,
          ref_db,
          application,
        });

        if (response.data && Array.isArray(response.data)) {
          const moduleItems = response.data;
          const initialToggleStates = {};

          // Set toggle states based on dashboard property
          moduleItems.forEach((item) => {
            initialToggleStates[item.id] = item.dashboard === 1;
          });

          setModuleData(moduleItems); 
          setToggleState(initialToggleStates); 
        } else {
          console.error('Invalid response format from /api/modu:', response.data);
        }
      } else {
        console.error("Unbox, ref_db, or application not found in AsyncStorage.");
      }
    } catch (error) {
      console.error('Failed to fetch module data:', error.response.data);
    }
  };

  fetchModuleData();
}, []);


// Handle toggle switch
const handleToggles = async (itemId) => {
  const ref_db = await AsyncStorage.getItem('ref_db');
  const updatedValue = !toggleStates[itemId]; 

  // Update the toggle state locally
  setToggleState((prevState) => ({
    ...prevState,
    [itemId]: updatedValue,
  }));

  try {
    // Send the updated toggle state to the server
    await axios.post('https://app.nexis365.com/api/updateToggles', {
      ref_db,
      itemId,
      dashboard: updatedValue ? 1 : 0, // Send 1 for ON, 0 for OFF
    });
    // Trigger loading by marking toggleChanged as true
    setToggleChanged(true);

  } catch (error) {
    console.error('Failed to update dashboard value:', error);
  }
};

  // Fetch stored data and sidebar menu data
useEffect(() => {
  const fetchMenuData = async () => {
    try {
      // Retrieve stored data from AsyncStorage
      const email = await AsyncStorage.getItem('secondaryUnbox');
      const ref_db = await AsyncStorage.getItem('ref_db');
      const application = await AsyncStorage.getItem('application');

      if (email && ref_db && application) {
       
        const response = await axios.post('https://app.nexis365.com/api/sidebarmenus', {
          email,
          ref_db,
          application,
        });

        const menuItems = response.data;

        
        const initialToggleStates = {};
        menuItems.forEach((item) => {
          initialToggleStates[item.id] = item.dashboard === 1;
        });
        
        setMenuData(menuItems);
        setToggleStates(initialToggleStates);
      } else {
        console.error("Unbox, ref_db, or application not found in AsyncStorage.");
      }
    } catch (error) {
      console.error('Failed to fetch menu data:', error.response.data);
    }
  };
  fetchMenuData();
}, [refreshToggle]);

// Handle toggle switch
const handleToggle = async (itemId) => {
  const ref_db = await AsyncStorage.getItem('ref_db');
  const updatedValue = !toggleStates[itemId]; // Get the new value after toggle

  // Update the toggle state locally
  setToggleStates((prevState) => ({
    ...prevState,
    [itemId]: updatedValue,
  }));

  try {
    // Send the updated toggle state to the server
    await axios.post('https://app.nexis365.com/api/updateToggle', {
      ref_db,
      itemId,
      dashboard: updatedValue ? 1 : 0, 
    });
    toggleRefresh();
    setToggleChanged(true);
 
  } catch (error) {
    console.error('Failed to update dashboard value:', error);
  }
};

// Fetch stock data when toggle changes or sidebar is shown
  
const fetchStockData = async (showLoading = false) => {
  if (showLoading) startLoading(); 
  
  try {
    const email = await AsyncStorage.getItem('email');
    const ref_db = await AsyncStorage.getItem('ref_db');
    const application = await AsyncStorage.getItem('application');

    if (email && ref_db && application) {
      const [sideMenuResponse, modulesResponse, modulesPResponse, modulesPSResponse] = await Promise.all([
        axios.post('https://app.nexis365.com/api/sidebarmenu', {
          email,
          ref_db,
          application,
        }),
        axios.post('https://app.nexis365.com/api/modulesmenu', {
          email,
          ref_db,
          application,
        }),
        axios.post('https://app.nexis365.com/api/modulespmenu', {
          email,
          ref_db,
          application,
        }),
        axios.post('https://app.nexis365.com/api/modulespsmenu', {
          email,
          ref_db,
          application,
        }),
      ]);

      setSideMenuData(sideMenuResponse.data);
      setModulesData(modulesResponse.data);
      setModulesPData(modulesPResponse.data);
      setModulesPSData(modulesPSResponse.data);
    }
  } catch (err) {
    console.error('Fetch Error:', err);
  } finally {
    if (showLoading) stopLoading(); 
  }
}


useEffect(() => {
// Initial fetch without loading spinner
if (toggleChanged) {
  fetchStockData(true); 
  setToggleChanged(false);
}
}, [toggleChanged]);

  // Define loading functions
  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

 

useEffect(() => {
  // Initial fetch without loading spinner
  if (initialFetch && isSidebarVisible && selectedButton === 'active') {
    fetchStockData(false);
    setInitialFetch(false);
  } else if (toggleChanged) {
    fetchStockData(true); 
    setToggleChanged(false);
  }
}, [isSidebarVisible, selectedButton, toggleChanged, initialFetch]);


  const toggleMenu = (id) => {
    setExpandedMenu(expandedMenu === id ? null : id);
  
  };

  const toggleSubMenu = (id) => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  const toggleSubSubMenu = (id) => {
    setExpandedSubModule(expandedSubModule === id ? null : id);
  };

  const openSidebar = () => {
    setIsSidebarVisible(true);
    Animated.timing(sidebarTranslateX, {
      toValue: 0, 
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(sidebarTranslateX, {
      toValue: 300, 
      duration: 150,
      useNativeDriver: true,
    }).start(() => setIsSidebarVisible(false));
  };

  const renderSidebar = () => {
    return (
      <Modal visible={isSidebarVisible} transparent animationType='none'>
        <TouchableWithoutFeedback onPress={closeSidebar}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={{
            position: 'absolute',
            right: 0,
            width: '80%',
            height: '100%',
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            transform: [{ translateX: sidebarTranslateX }],
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 5,
          }}
        >
          {/* Close Button */}
          <TouchableOpacity onPress={closeSidebar} style={{ alignSelf: 'flex-end' }}>
            <Ionicons name="close" size={24} style={{ color: theme === 'dark' ? '#fff' : '#000' }} />
          </TouchableOpacity>
          {/* {TransactionIcons()} */}
          {/* Sidebar Buttons */}
          <View style={styles.buttonContainer}>
                <TouchableOpacity
                 onPress={() => setSelectedButton('active')}
                     style={[styles.sidebarButton, selectedButton === 'active' && styles.activeButton]}
                       >
                   <Text style={[styles.buttonText, selectedButton === 'active' && styles.activeButtonText,  { color: theme === 'dark' ? '#fff' : '#000' }]}>Active</Text>
               </TouchableOpacity>

               <TouchableOpacity
                     onPress={() => setSelectedButton('solution')}
                  style={[styles.sidebarButton, selectedButton === 'solution' && styles.activeButton]}
                      >
                    <Text style={[styles.buttonText, selectedButton === 'solution' && styles.activeButtonText,  { color: theme === 'dark' ? '#fff' : '#000' }]}>Solution</Text>
                 </TouchableOpacity>

               <TouchableOpacity
                   onPress={() => setSelectedButton('modules')}
                 style={[styles.sidebarButton, selectedButton === 'modules' && styles.activeButton]}
                     >
                <Text style={[styles.buttonText, selectedButton === 'modules' && styles.activeButtonText,  { color: theme === 'dark' ? '#fff' : '#000' }]}>Modules</Text>
                    </TouchableOpacity>
               </View>
          {/* Conditional Content Rendering */}
          {selectedButton === 'active' && (
            
            <ScrollView style={{ marginTop: 20 }}>
                {loading && <Loader />}
              <View style={styles.sidebarContainer}>
                <ScrollView
                  style={styles.scrollableView}
                  contentContainerStyle={styles.scrollContent}
                >
                  {sideMenuData.map((item) => {
                    const hasSubMenu = modulesData.some((module) => module.parent === item.id);

                    return (
                      <View key={item.id}>
                        <TouchableOpacity
                          onPress={() => toggleMenu(item.id)}
                          style={styles.menuItem}
                        >
                          <Text style={styles.title}>{item.name}</Text>
                          {hasSubMenu && (
                            <Ionicons
                              name={expandedMenu === item.id ? 'chevron-up' : 'chevron-down'}
                              size={20}
                              style={[{ color: theme === 'dark' ? '#fff' : '#000' }, styles.chevronIcon]}
                            />
                          )}
                        </TouchableOpacity>
                        {expandedMenu === item.id && (
                          <View style={styles.dropdown}>
                            {modulesData
                              .filter((module) => module.parent === item.id)
                              .map((module) => {
                                const hasSubSubMenu = modulesPData.some(
                                  (subModule) => subModule.parent === module.id
                                );

                                return (
                                  <View key={module.id}>
                                    <TouchableOpacity
                                      onPress={() => toggleSubMenu(module.id)}
                                      style={styles.subMenuItem}
                                    >
                                      <Text style={styles.moduleItem}
                                    onPress={() => {
                                      closeSidebar();
                                      const formattedName = module.name.toLowerCase().replace(' ', '_');
                                      const url = `https://www.nexis365.com/saas/index.php?url=${formattedName}.php&id=${module.id}`;
                                      console.log('Navigating to URL:', url); 
                                      navigation.navigate('Webview', {
                                        url, 
                                      });
                                    }}

                                      >{module.name}</Text>
                                      {hasSubSubMenu && (
                                        <Ionicons
                                          name={expandedModule === module.id ? 'chevron-up' : 'chevron-down'}
                                          size={20}
                                          style={[{ color: theme === 'dark' ? '#fff' : '#000' }, styles.chevronIcon]}
                                        />
                                      )}
                                    </TouchableOpacity>

                                    {expandedModule === module.id && (
                                      <View style={styles.dropdown}>
                                        {modulesPData
                                          .filter((subModule) => subModule.parent === module.id)
                                          .map((subModule) => {
                                            const hasSubSubSubMenu = modulesPSData.some(
                                              (subSubModule) => subSubModule.parent === subModule.id
                                            );

                                            return (
                                              <View key={subModule.id}>
                                                <TouchableOpacity
                                                  onPress={() => toggleSubSubMenu(subModule.id)}
                                                  style={styles.subSubMenuItem}
                                                >
                                                  <Text style={styles.subModuleItem}
                                                   onPress={() => {
                                                    closeSidebar();
                                                    const formattedName = subModule.name.toLowerCase().replace(' ', '_');
                                                    const url = `https://www.nexis365.com/saas/index.php?url=${formattedName}.php&id=${module.id}`;
                                                    console.log('Navigating to URL:', url); // Log the URL
                                                    navigation.navigate('Webview', {
                                                      url, // Pass the URL
                                                    });
                                                  }}
                                                  >{subModule.name}</Text>
                                                  {hasSubSubSubMenu && (
                                                    <Ionicons
                                                      name={expandedSubModule === subModule.id ? 'chevron-up' : 'chevron-down'}
                                                      size={20}
                                                      style={[{ color: theme === 'dark' ? '#fff' : '#000' }, styles.chevronIcon]}
                                                    />
                                                  )}
                                                </TouchableOpacity>

                                                {expandedSubModule === subModule.id && (
                                                  <View style={styles.dropdown}>
                                                    {modulesPSData
                                                      .filter((subSubModule) => subSubModule.parent === subModule.id)
                                                      .map((subSubModule) => (
                                                        <Text key={subSubModule.id}
                                                         style={styles.subSubModuleItem}
                                                         onPress={() => {
                                                          closeSidebar();
                                                          const formattedName = subSubModule.name.toLowerCase().replace(' ', '_');
                                                          const url = `https://www.nexis365.com/saas/index.php?url=${formattedName}.php&id=${module.id}`;
                                                          console.log('Navigating to URL:', url); // Log the URL
                                                          navigation.navigate('Webview', {
                                                            url, 
                                                          });
                                                        }}
                                                         >
                                                          {subSubModule.name}
                                                        </Text>
                                                      ))}
                                                  </View>
                                                )}
                                              </View>
                                            );
                                          })}
                                      </View>
                                    )}
                                  </View>
                                );
                              })}
                          </View>
                        )}
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            
            </ScrollView>
          )}
          {selectedButton === 'solution' && (
           <ScrollView style={styles.container}>
           {menuData.map((item) => (
             <View key={item.id} style={[styles.menuItem, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
               <Text style={styles.itemText}>{item.name}</Text>
               <Switch
                 value={toggleStates[item.id]} 
                 onValueChange={() => handleToggle(item.id)} 
               />
             </View>
           ))}
         </ScrollView>
          )}
          {selectedButton === 'modules' && (
             <ScrollView style={styles.container}>
             {moduleData.map((item) => (
               <View key={item.id} style={[styles.moduleItem, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                 <Text style={styles.itemText}>{item.name}</Text>
                 <Switch
                   value={toggleState[item.id]}  
                   onValueChange={() => handleToggles(item.id)} 
                 />
               </View>
             ))}
           </ScrollView>
          )}
        </Animated.View>
      </Modal>
    );
  };

  const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
    },
    sidebarButton: {
      flex: 1,
      padding: 10,
      marginHorizontal: 5,
      alignItems: 'center',
      borderBottomWidth: 0, 
    },
    activeButton: {
      borderBottomWidth: 1.5, 
      borderBottomColor: '#007BFF', 
    },
    buttonText: {
      fontSize: 12,
      color: '#000',
    },
    activeButtonText: {
      color: '#000', 
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12, 
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      borderBottomWidth: 1,
      borderColor: theme === 'dark' ? '#555' : '#eee', 
      borderRadius: 8, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3, 
      marginBottom: 8, 
    },
    subMenuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: theme === 'dark' ? '#444' : '#f9f9f9',
      borderBottomWidth: 1,
      borderColor: theme === 'dark' ? '#666' : '#eee',
      paddingLeft: 30,
      borderRadius: 6, 
      marginBottom: 5, 
    },
    subSubMenuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      backgroundColor: theme === 'dark' ? '#555' : '#f2f2f2',
      borderBottomWidth: 1,
      borderColor: theme === 'dark' ? '#777' : '#ddd',
      paddingLeft: 40, 
      borderRadius: 6, 
      marginBottom: 4, 
    },
    chevronIcon: {
      marginLeft: 'auto',
      color: theme === 'dark' ? '#bbb' : '#333', 
      transform: [{ rotate: expandedMenu ? '180deg' : '0deg' }], 
    },
    dropdown: {
      paddingLeft: 10,
      backgroundColor: theme === 'dark' ? '#2a2a2a' : '#fafafa', 
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2, 
      marginVertical: 4, 
    },
    sidebarContainer: {
      padding: 10,
      backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5', 
    },
    itemText: {
      fontSize: 14, 
      fontWeight: '500', 
      color: theme === 'dark' ? '#ddd' : '#333', 
      paddingHorizontal: 10, 
      paddingVertical: 5,
      textAlign: 'left', 
    },
    
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#fff' : '#333', 
    },
    moduleItem: {
      fontSize: 16,
      fontWeight: '600',
      color: theme === 'dark' ? '#fff' : '#444',
    },
    subModuleItem: {
      fontSize: 16,
      fontWeight: '500', 
      color: theme === 'dark' ? '#ccc' : '#555',
    },
    subSubModuleItem: {
      fontSize: 15,
      color: theme === 'dark' ? '#bbb' : '#666',
    },
  });
  

  const renderGoBack = () => {
    if (goBack) {
      return (
        <View
          style={{
            position: 'absolute',
            left: 10,
            alignItems: 'center',
            zIndex: 100,
          }}
        >
          <TouchableOpacity
            style={{
              padding: 8, 
              borderColor: 'rgba(255, 255, 255, 0.5)',
              borderWidth: 2, 
              borderRadius: 15, 
              width: 30, 
              height: 30,
              justifyContent: 'center', 
              alignItems: 'center', 
            }}
            onPress={() => navigation.goBack()}
          >
            <svg.GoBackSvg
            />
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };

  const renderTitle = () => {
    if (title) {
      return (
        <Text
          style={{
            color: theme === 'dark' ? '#fff' : '#000',
            ...titleStyle,
          }}
        >
          {title}
        </Text>
      );
    }

    if (!title) {
      return null;
    }
  };

  const renderToggleThemeButton = () => {
    if (showToggleTheme) {
      const icon = theme === 'dark' ? 'sun' : 'moon';
      return (
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 25,
            marginRight: 70,
          }}
          onPress={toggleTheme}
        >
          <Icon
            name={icon}
            size={20}
            color={theme === 'dark' ? 'yellow' : '#000'}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderCreditCard = () => {
    if (creditCard) {
      return (
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 5,
            marginRight: 45,
          }}
          onPress={() => navigation.navigate('CardMenu')}
        >
          <svg.CreditCardSvg />
        </TouchableOpacity>
      );
    }

    if (!creditCard) {
      return null;
    }
  };


  const renderMore = () => {
    if (more) {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute', 
          right: -200,
        }}
        onPress={openSidebar}
      >
        <svg.SidebarSvg  />
      </TouchableOpacity>
    );
  }

  if (!more) {
    return null;
  }
};


const renderNotification = () => {
  // const navigation = useNavigation();
  
  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };
  if (notification) {
  return (
    <TouchableOpacity
      style={{
        position: 'absolute', 
        right: 55,
      }}
      onPress={handleNotifications}
    >
      <svg.NotificationSvg  />
    </TouchableOpacity>
  );
}

if (!notification) {
  return null;
}
};


  const renderLogo = () => {
    if (logo) {
      return (
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 15,
            alignItems: 'center',
            flexDirection: 'row',
          }}
          onPress={() => navigation.navigate('Profile')}
        >
          <components.Image
            source={require('../assets/favicon/favicon.png')}
            style={{
              width: responsiveWidth(7),
              marginRight: 10,
              aspectRatio: 1 / 1,
            }}
            imageStyle={{
              borderRadius: 13,
            }}
          />
        </TouchableOpacity>
      );
    }

    if (!logo) {
      return null;
    }
  };

  const renderFavicon = () => {
    if (favicon) {
    const [favicon, setFavicon] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchFavicon = async () => {
        try {
          // Get ref_db from AsyncStorage
          const refDb = await AsyncStorage.getItem('ref_db');
  
          if (!refDb) {
            setError('No ref_db found');
            return;
          }
  
          // API request to fetch favicon
          const response = await axios.get('https://app.nexis365.com/api/favicon', {
            params: { ref_db: refDb },
          });

        
  
          if (response.data.success) {
            // setFavicon(response.data.favicon);

            const imagePath = response.data.favicon || ''; 
    
            // Construct full image URL
            const fullImageUrl = imagePath 
              ? `https://www.nexis365.com/saas/${imagePath}` 
              : ''; 
              setFavicon(fullImageUrl); // Set the image URL



          } else {
            setError(response.data.message);
          }
        } catch (err) {
          console.error(err);
          setError('Error fetching favicon');
        }
      };
  
      fetchFavicon();
    }, []);
      return (
        <TouchableOpacity
          style={{
            position: 'absolute',
            // left: 15,
            alignItems: 'center',
            flexDirection: 'row',

         
              position: 'absolute',
              right: 12,
              marginRight: -10,
        

          }}
          onPress={() => navigation.navigate('Profile')}
        >
          <components.Image
             source={{ uri: favicon }}
            style={{
              width: responsiveWidth(7),
              marginRight: 10,
              aspectRatio: 1 / 1,
            }}
            imageStyle={{
              borderRadius: 13,
            }}
          />
        </TouchableOpacity>
      );
    }

    if (!favicon) {
      return null;
    }
  };

 

  const renderUser = () => {
    if (userhead) {
    const {images } = user;

    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          left: 25,
          alignItems: 'center',
          flexDirection: 'row',
          marginLeft: 30,
        }}
        onPress={() => navigation.navigate('Profile')}
      >
        {images ? (
          <components.Image
            source={{
              uri: images,
            }}
            style={{
              width: responsiveWidth(7),
              marginRight: 10,
              aspectRatio: 1 / 1,
              color:'#21AFF0',
            }}
            imageStyle={{
              borderRadius: 13,
            }}
          />
        ) : (
          <Ionicons
            name="person-circle-outline" 
            size={responsiveWidth(7)} 
            style={{
              marginRight: 10,
              color:'#21AFF0',
              
            }}
          />
        )}
        <Text
          style={{
            color: theme === 'dark' ? '#fff' : '#000',
            textTransform: 'capitalize',
            fontWeight: 'bold',
          }}
        >
         {username || "User"} {username2}
         
        </Text>
        
      </TouchableOpacity>
    );
  }

  if (!userhead) {
    return null;
  }

  };
  const renderFile = () => {
    if (file) {
      return (
        <View
          style={{
            position: 'absolute',
            right: 0,
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              paddingHorizontal: 20,
            }}
            onPress={() => {}}
          >
            <svg.FileTextSvg />
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };

  const TransactionIcons = () => {
    return (
      <View
      >
        <View
        style={{
          marginTop: 20,
          width: '100%',
          backgroundColor: '#21AFF0',
          borderRadius: 5,
          padding: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
          <svg.SearchSvg />
          <svg.StarSvg />
          <svg.FlagMarkSvg />
          <svg.NotificationSoftSvg />
          <svg.SubscriptionSvg />
      </View>
      </View>
    );
  };
  


  return (
    <View
      style={{
        height: 47,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#999',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',
        ...containerStyle,
      }}
    >
      {renderGoBack()} 
      {renderTitle()}
      {renderLogo()}
      {renderUser()}
      {renderFile()}
      {renderToggleThemeButton()}
      {renderNotification()}
      {renderFavicon()}
      {/* {renderCreditCard()} */}
      {/* {renderMore()} */}
      {renderSidebar()}
    </View>
  );
};

export default Header;
