import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const MySidebarComponent = () => {
  const [sideMenuData, setSideMenuData] = useState([]);
  const [modulesData, setModulesData] = useState([]);
  const [modulesPData, setModulesPData] = useState([]);
  const [modulesPSData, setModulesPSData] = useState([]); // New state for the third layer
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);
  const [expandedSubModule, setExpandedSubModule] = useState(null); // New state for the sub-submenu

  const fetchSideMenuData = async () => {
    try {
      const response = await axios.get(
        'http://192.168.1.105:3000/api/sidebarmenu',
      );
      setSideMenuData(response.data);
    } catch (err) {
      console.error('Fetch Error:', err);
    }
  };

  const fetchModulesData = async () => {
    try {
      const response = await axios.get(
        'http://192.168.1.105:3000/api/modulesmenu',
      );
      setModulesData(response.data);
    } catch (err) {
      console.error('Fetch Error:', err);
    }
  };

  const fetchModulesPData = async () => {
    try {
      const response = await axios.get(
        'http://192.168.1.105:3000/api/modulespmenu',
      );
      setModulesPData(response.data);
    } catch (err) {
      console.error('Fetch Error:', err);
    }
  };

  const fetchModulesPSData = async () => {
    // New function to fetch the third layer
    try {
      const response = await axios.get(
        'http://192.168.1.105:3000/api/modulespsmenu',
      );
      setModulesPSData(response.data);
    } catch (err) {
      console.error('Fetch Error:', err);
    }
  };

  useEffect(() => {
    fetchSideMenuData();
    fetchModulesData();
    fetchModulesPData();
    fetchModulesPSData();
  }, []);

  const toggleMenu = (id) => {
    setExpandedMenu(expandedMenu === id ? null : id);
  };

  const toggleSubMenu = (id) => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  const toggleSubSubMenu = (id) => {
    // New function to toggle the third layer
    setExpandedSubModule(expandedSubModule === id ? null : id);
  };

  return (
    <View style={styles.sidebarContainer}>
      <ScrollView
        style={styles.scrollableView}
        contentContainerStyle={styles.scrollContent}
      >
        {sideMenuData.map((item) => {
          // Check if this item has corresponding submodules
          const hasSubMenu = modulesData.some(
            (module) => module.parent === item.id,
          );

          return (
            <View key={item.id}>
              <TouchableOpacity
                onPress={() => toggleMenu(item.id)}
                style={styles.menuItem}
              >
                <Text style={styles.title}>{item.name}</Text>
                {hasSubMenu && (
                  <Icon
                    name={
                      expandedMenu === item.id ? 'chevron-up' : 'chevron-down'
                    }
                    size={20}
                    color='#ffffff'
                    style={styles.chevronIcon}
                  />
                )}
              </TouchableOpacity>
              {expandedMenu === item.id && (
                <View style={styles.dropdown}>
                  {modulesData
                    .filter((module) => module.parent === item.id)
                    .map((module) => {
                      // Check if this module has corresponding sub-submodules
                      const hasSubSubMenu = modulesPData.some(
                        (subModule) => subModule.parent === module.id,
                      );

                      return (
                        <View key={module.id}>
                          <TouchableOpacity
                            onPress={() => toggleSubMenu(module.id)}
                            style={styles.subMenuItem}
                          >
                            <Text style={styles.moduleItem}>{module.name}</Text>
                            {hasSubSubMenu && (
                              <Icon
                                name={
                                  expandedModule === module.id
                                    ? 'chevron-up'
                                    : 'chevron-down'
                                }
                                size={20}
                                color='#ffffff'
                                style={styles.chevronIcon}
                              />
                            )}
                          </TouchableOpacity>

                          {expandedModule === module.id && (
                            <View style={styles.dropdown}>
                              {modulesPData
                                .filter(
                                  (subModule) => subModule.parent === module.id,
                                )
                                .map((subModule) => {
                                  // Check if this submodule has corresponding sub-submodules
                                  const hasSubSubSubMenu = modulesPSData.some(
                                    (subSubModule) =>
                                      subSubModule.parent === subModule.id,
                                  );

                                  return (
                                    <View key={subModule.id}>
                                      <TouchableOpacity
                                        onPress={() =>
                                          toggleSubSubMenu(subModule.id)
                                        }
                                        style={styles.subSubMenuItem}
                                      >
                                        <Text style={styles.subModuleItem}>
                                          {subModule.name}{' '}
                                        </Text>
                                        {hasSubSubSubMenu && (
                                          <Icon
                                            name={
                                              expandedSubModule === subModule.id
                                                ? 'chevron-up'
                                                : 'chevron-down'
                                            }
                                            size={20}
                                            color='#ffffff'
                                            style={styles.chevronIcon}
                                          />
                                        )}
                                      </TouchableOpacity>

                                      {expandedSubModule === subModule.id && (
                                        <View style={styles.dropdown}>
                                          {modulesPSData
                                            .filter(
                                              (subSubModule) =>
                                                subSubModule.parent ===
                                                subModule.id,
                                            )
                                            .map((subSubModule) => (
                                              <Text
                                                key={subSubModule.id}
                                                style={styles.subSubModuleItem}
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
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    flex: 1,
    width: 250,
    backgroundColor: '#333',
    paddingVertical: 16,
    paddingLeft: 10,
  },
  scrollableView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#444',
    borderBottomWidth: 1,
    borderColor: '#555',
    justifyContent: 'space-between',
  },
  subMenuItem: {
    padding: 8,
    backgroundColor: '#555',
    borderBottomWidth: 1,
    borderColor: '#666',
    paddingLeft: 20,
  },
  subSubMenuItem: {
    padding: 8,
    backgroundColor: '#666',
    borderBottomWidth: 1,
    borderColor: '#777',
    paddingLeft: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dropdown: {
    paddingLeft: 10,
  },
  iconStyle: {
    marginRight: 10,
  },
  chevronIcon: {
    marginLeft: 'auto',
  },
  moduleItem: {
    fontSize: 16,
    color: '#ffffff',
  },
  subModuleItem: {
    fontSize: 14,
    color: '#ffffff',
  },
  subSubModuleItem: {
    fontSize: 12,
    color: '#ffffff',
  },
});

export default MySidebarComponent;
