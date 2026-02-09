import {View, TouchableOpacity, StatusBar, Text, Image} from 'react-native';
import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {setScreen} from '../store/tabSlice';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {components} from '../components';
import {svg} from '../assets/svg';

import Dashboard from '../screens/tabs/Dashboard';
import Deposits from '../screens/tabs/Deposits';
import Loans from '../screens/tabs/Faq';
import Notification from '../screens/tabs/Notification';
import Chatbot from '../screens/tabs/Chatbot';
import Timesheet from '../screens/tabs/Timesheet';
import {theme} from '../constants';
import {useTheme} from '../constants/ThemeContext';
import Faq from '../screens/tabs/Faq';
import Documents from '../screens/tabs/Documents';
import Mytask from '../screens/tabs/Mytask';
import Myjob from '../screens/tabs/Myjob';

const TabNavigator = () => {
  const dispatch = useDispatch();
  const currentTabScreen = useSelector((state) => state.tab.screen);
  const insets = useSafeAreaInsets();
  const homeIndicatorHeight = insets.bottom;
  const {theme} = useTheme();

  // Added state to force reloading the screen when the same tab is clicked twice
  const [reloadKey, setReloadKey] = useState(0);
  const [lastTab, setLastTab] = useState(currentTabScreen);

  const tabs = [
    {
      name: 'Tasks',
      icon: svg.TaskSvg,
    },
    {
      name: 'Jobs',
      icon: svg.WatchSvg,
    },
    {
      name: 'Home',
      icon: svg.PercentageSvg,
    },
    {
      name: 'Documents',
      icon: svg.DocumentSvg,
    },
    {
      name: 'Timesheet',
      icon: svg.DashboardSvg,
    },
  ];

  const renderStatusBar = () => {
    return (
      <StatusBar
        barStyle='dark-content'
        backgroundColor={theme === 'dark' ? '#333' : '#FFF'}
      />
    );
  };

  const homeIndicatorSettings = () => {
    if (homeIndicatorHeight !== 0) {
      return homeIndicatorHeight;
    }
    return 20;
  };

  const renderHeader = () => {
    if (['Tasks', 'Documents', 'Jobs', 'Home', 'Timesheet'].includes(currentTabScreen)) {
      return (
        <components.Header
          creditCard={true}
          user={true}
        />
      );
    }
  };

  const renderScreen = () => {
    return (
      <View key={reloadKey} style={{flex: 1}}>
        {currentTabScreen === 'Tasks' && <Mytask />}
        {currentTabScreen === 'Documents' && <Documents />}
        {currentTabScreen === 'Jobs' && <Myjob />}
        {currentTabScreen === 'Home' && <Dashboard />}
        {currentTabScreen === 'Timesheet' && <Timesheet />}
      </View>
    );
  };

  const renderBottomTab = () => {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: homeIndicatorHeight || 0,
          left: 0,
          right: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          backgroundColor: theme === 'dark' ? '#fff' : '#000',
          height: 80,
          paddingTop: 10,
          paddingBottom: insets.bottom || 10, 
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 3,
        }}
      >
        {tabs.map((tab, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={{
                paddingHorizontal: 16,
                height: '100%',
                justifyContent: 'center',
              }}
              onPress={() => {
                if (currentTabScreen === tab.name) {
                  // If clicking the same tab, reload it
                  setReloadKey(prevKey => prevKey + 1);
                } else {
                  dispatch(setScreen(tab.name));
                }
                setLastTab(tab.name);
              }}
            >
              <View style={{alignItems:'center',}} >
                <tab.icon
                  color={theme === 'dark' 
                    ? (currentTabScreen === tab.name ? '#21AFF0' : '#2C3E50') 
                    : (currentTabScreen === tab.name ? '#21AFF0' : '#FFFFFF')}
                  style={tab.name === 'Home' ? { marginTop: 10 } : {}}
                />
                 <Text
                    style={{
                    marginTop: 4,
                    fontSize: 7,
                    color: theme === 'dark' 
                    ? (currentTabScreen === tab.name ? '#000' : '#3F5870') 
                    : (currentTabScreen === tab.name ? '#FFF' : '#FFF'),
                    fontWeight: currentTabScreen === tab.name ? 'bold' : 'normal',
                    }}
                    >
                      {tab.name}
                  </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <components.SafeAreaView>
      {renderStatusBar()}
      {renderHeader()}
      {renderScreen()}
      {renderBottomTab()}
    </components.SafeAreaView>
  );
};

export default TabNavigator;
