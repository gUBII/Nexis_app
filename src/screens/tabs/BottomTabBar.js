import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { useSelector, useDispatch } from 'react-redux';
import { setScreen } from '../../store/tabSlice'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { svg } from '../../assets/svg';
import { useTheme } from '../../constants/ThemeContext';

const BottomTabBar = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const currentTabScreen = useSelector((state) => state.tab.screen);
  const insets = useSafeAreaInsets();
  const homeIndicatorHeight = insets.bottom;

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const tabs = [
    { name: 'Tasks', icon: svg.TaskSvg },
    { name: 'Jobs', icon: svg.WatchSvg },
    { name: 'Home', icon: svg.PercentageSvg },
    { name: 'Documents', icon: svg.DocumentSvg },
    { name: 'Timesheet', icon: svg.DashboardSvg }, 
  ];

  // 👇 Do not render BottomTabBar if keyboard is visible
  if (keyboardVisible) return null;

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
        shadowRadius: 8,
        elevation: 5,
      }}
    >
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={{
            paddingHorizontal: 16,
            height: '100%',
            justifyContent: 'center',
          }}
          onPress={() => {
            dispatch(setScreen(tab.name)); 
            navigation.navigate('TabNavigator', { screen: tab.name });
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <tab.icon
              color={
                theme === 'dark' 
                  ? (currentTabScreen === tab.name ? '#21AFF0' : '#2C3E50') 
                  : (currentTabScreen === tab.name ? '#21AFF0' : '#FFFFFF')
              }
            />
            <Text
              style={{
                marginTop: 4,
                fontSize: 12,
                color:
                  theme === 'dark'
                    ? (currentTabScreen === tab.name ? '#000' : '#3F5870')
                    : (currentTabScreen === tab.name ? '#FFF' : '#FFF'),
                fontWeight: currentTabScreen === tab.name ? 'bold' : 'normal',
              }}
            >
              {tab.name}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomTabBar;
