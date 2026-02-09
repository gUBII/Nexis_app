import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  useColorScheme,
} from 'react-native';
import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { components } from '../components';
import { theme } from '../constants';
import { requestLocationPermission } from '../utils/permissions';
import { ActivityIndicator, Button, Icon } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
import Icons from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../constants/UserContext';
// import { Sun, Moon } from 'react-native-feather';

const onboardingData = [
  {
    id: 1,
    title: 'Welcome to Nexis - 365',
    description:
      'lets break limitations and grow like pro! Online training and live onboarding webinars',
    image: require('../assets/favicon/model-1.png'),
  },
  {
    id: 2,
    title: 'Get a new card in a\nfew clicks!',
    description:
      'Labore sunt culpa excepteur culpa ipsum. Labore occaecat ex nisi mollit.',
    image: require('../assets/favicon/model-2.png'),
  },
  {
    id: 3,
    title: 'Easy payments all\nover the world!',
    description:
      'Labore sunt culpa excepteur culpa ipsum. Labore occaecat ex nisi mollit.',
    image: require('../assets/favicon/model-3.png'),
  },
];

const Onboarding = ({ navigation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef();
  const colorScheme = useColorScheme(); // Automatically detects system theme
  const [themeMode, setThemeMode] = useState('dark');

  

  const checkUserStatus = async () => {
    console.log("Checking user status...");
  
    const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
    const userToken = await AsyncStorage.getItem("userToken");
  
    console.log("Onboarding status:", hasSeenOnboarding);
    console.log("User token got:", userToken);
  
    if (!hasSeenOnboarding) {
      // If user is new, show the onboarding screen
      // navigation.replace("Onboarding");
    } else if (userToken) {
      // If the user has logged in before, navigate to the main screen
      navigation.replace("TabNavigator");
    } else {
      // If the user has seen onboarding but is not logged in, go to SignIn screen
      navigation.replace("SignIn");
    }
  };
  
  useEffect(() => {
    checkUserStatus(); 
  }, []);


  const completeOnboarding = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    navigation.replace("SignUp"); 
  };

  const completeOnboardings = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    navigation.replace("SignIn"); // Navigate to login after onboarding
  };

  useEffect(() => {
    async function checkLocationPermission() {
      const granted = await requestLocationPermission();
      if (granted) {
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }
    }

    checkLocationPermission();
  }, []);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
  };

  const colors = {
    background: themeMode === 'dark' ? '#222222' : '#FFFFFF',
    textPrimary: themeMode === 'dark' ? '#ADD8E6' : '#000000',
    textSecondary: themeMode === 'dark' ? '#B4B4C6' : '#333333',
    buttonBackground: '#1EA8E7',
    dotActive: themeMode === 'dark' ? '#FFFFFF' : '#000000',
    dotInactive: themeMode === 'dark' ? '#888888' : '#CCCCCC',
  };

  const updateCurrentSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / theme.sizes.width);
    setCurrentSlideIndex(currentIndex);
  };

  const renderStatusBar = () => {
    return (
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        translucent={true}
        backgroundColor="transparent"
      />
    );
  };

  const renderImageBackground = () => {
    return (
      <components.Image
        source={require('../assets/bg/03.png')}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      />
    );
  };

  const renderSlides = () => {
    return (
      <ScrollView
        ref={ref}
        horizontal={true}
        pagingEnabled={true}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        contentContainerStyle={{
          paddingBottom: responsiveHeight(4),
        }}
        style={{
          flexGrow: 0,
          // marginTop: 120,
        }}
        showsHorizontalScrollIndicator={false}
      >
        {onboardingData.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                width: theme.sizes.width,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <components.Image
                source={item.image}
                style={{
                  width: responsiveWidth(30),
                  height: responsiveHeight(38),
                  alignSelf: 'center',
                }}
                resizeMode={'contain'}
              />

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '95%',
                  alignSelf: 'center',
                  marginTop: -20,
                  // backgroundColor: themeMode === 'dark' ? '#000000' : '#F9F9F9',
                  // borderWidth: 2,
                  // borderColor: '#333333',
                  // borderRadius: 10,
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    color: colors.textPrimary,
                    ...theme.fonts.SourceSansPro_SemiBold_32,
                    lineHeight:
                      theme.fonts.SourceSansPro_SemiBold_32.fontSize * 1.2,
                    textAlign: 'center',
                    marginBottom: 10,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
                    textAlign: 'center',
                    maxWidth: '80%',
                  }}
                >
                  {item.description}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  const renderDots = () => {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {onboardingData.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  width: theme.sizes.width_20,
                  height: 2,
                  margin: 5,
                  backgroundColor:
                    currentSlideIndex === index
                      ? colors.dotActive
                      : colors.dotInactive,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  };

  const renderButton = () => {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          marginBottom: 20,
          paddingBottom: responsiveHeight(2),
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '80%',
          }}
        >
          <TouchableOpacity
            style={{
              width: responsiveWidth(35),
              backgroundColor: colors.buttonBackground,
              paddingVertical: responsiveHeight(1.5),
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: responsiveHeight(1),
            }}
            onPress={() => {completeOnboardings()}}
          >
            <Text
              style={{
                color: 'white',
                ...theme.fonts.SourceSansPro_SemiBold_16,
              }}
            >
              Log In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: responsiveWidth(35),
              backgroundColor: colors.buttonBackground,
              paddingVertical: responsiveHeight(1.5),
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: responsiveHeight(1),
            }}
            // onPress={() => {completeOnboarding()}}
          >
            <Text
              style={{
                color: 'white',
                ...theme.fonts.SourceSansPro_SemiBold_16,
              }}
              
            >
              Get Started For Free
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
 

  const renderToggleButton = () => {
  
    const icon = themeMode === 'dark' ? 'sun' : 'moon';
  
    return (
      <TouchableOpacity
        style={{
          marginTop: 35,
          marginLeft: 320,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={toggleTheme}
      >
        <Icons
            name={icon}
            size={20}
            color={themeMode === 'dark' ? 'yellow' : '#000'}
                  />
      </TouchableOpacity>
    );
  };
  

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {renderToggleButton()}
      <SafeAreaView  style={{ flex: 1 }}>
        {renderStatusBar()}
        {renderSlides()}
        {renderDots()}
        {renderButton()}
      </SafeAreaView>
    </View>
  );
};

export default Onboarding;
