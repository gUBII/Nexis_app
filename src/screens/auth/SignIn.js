import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Alert, useColorScheme, BackHandler } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ParsedText from 'react-native-parsed-text';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { components } from '../../components';
import { theme } from '../../constants';
import { svg } from '../../assets/svg';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from 'react-native-vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';
// import { v4 as uuidv4 } from 'uuid';
import uuid from 'react-native-uuid';
import { UserContext } from '../../constants/UserContext';


const SignIn = ({ navigation }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [unbox, setUnbox] = useState("");
  const [passbox, setPassbox] = useState(""); 
  const [themeMode, setThemeMode] = useState('light');

  const { userToken } = useContext(UserContext);
  console.log("User Token in Signin:", userToken);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
  };

  const colors = {
    background: themeMode === 'dark' ? '#000000' : '#FFFFFF',
    textPrimary: themeMode === 'dark' ? '#ADD8E6' : '#000000',
    textSecondary: themeMode === 'dark' ? '#B4B4C6' : '#333333',
    buttonBackground: '#1EA8E7',
    dotActive: themeMode === 'dark' ? '#FFFFFF' : '#000000',
    dotInactive: themeMode === 'dark' ? '#888888' : '#CCCCCC',
  };



  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const fetchSolutions = async (ref_db) => {
    try {
      console.log('Fetching solutions using ref_db:', ref_db);

      const response = await fetch(`https://app.nexis365.com/api/solutions?ref_db=${ref_db}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      const names = data.map((item) => item.name);

      // Save the 'name' data in AsyncStorage
      await AsyncStorage.setItem('application', JSON.stringify(names));

      console.log('Fetched solutions:', names);
    } catch (error) {
      console.error('Error fetching solutions:', error);
      Alert.alert('Error', 'Failed to fetch solutions. Please try again later.');
    }
  };


  const handleSignIn = async () => {
    if (!unbox || !passbox) {
      Alert.alert("Validation Error", "User and password are required.");
      return;
    }

    try {
      const response = await axios.post("https://app.nexis365.com/api/signin", {
        unbox,
        passbox,
      });

      if (response.status === 200) {
        const { saas, secondary } = response.data;

        console.log("Main database data:", saas);
        console.log("Secondary database data:", secondary);

        // Save data in AsyncStorage ok
        await AsyncStorage.setItem("saasid", saas.id.toString());
        await AsyncStorage.setItem("unbox", saas.unbox);
        await AsyncStorage.setItem("ref_db", saas.ref_db);
        await AsyncStorage.setItem("secondaryId", secondary.id.toString());
        await AsyncStorage.setItem("secondaryUnbox", secondary.unbox);
        await AsyncStorage.setItem("secondaryUsername2", secondary.username);
        await AsyncStorage.setItem("secondaryUsername", secondary.username2);
        await AsyncStorage.setItem("secondaryEmail", secondary.email);
        await AsyncStorage.setItem("secondaryPhone", secondary.phone);

        console.log("Data saved in AsyncStorage:", {
          saasid: saas.id,
          unbox: saas.unbox,
          ref_db: saas.ref_db,
          secondaryId: secondary.id,
          secondaryUnbox: secondary.unbox,
          secondaryUsername2: secondary.username, 
          secondaryUsername: secondary.username2, 
          secondaryEmail: secondary.email, 
          secondaryPhone: secondary.phone, 
        });

      const userToken = uuid.v4();
      await AsyncStorage.setItem('userToken', userToken.toString());
      console.log('User token saved:', userToken);
 

         await fetchSolutions(saas.ref_db);
        navigation.replace("TabNavigator");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("API Error:", error.response.data);
        Alert.alert("Error", error.response.data.message);
      } else {
        console.error("Unexpected Error:", error);
        Alert.alert("Error", "Something went wrong.");
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        return true; 
      };

      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () => BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    }, [])
  );

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          justifyContent: 'center',
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={require('../../assets/login/login.jpg')}
            style={{ width: '100%', height: 230, borderRadius:10, marginBottom:20 }}
          />
        </View>

        <components.InputField
          emailIcon={true}
          placeholder='example@gmail.com'
          containerStyle={{
            marginBottom: theme.sizes.marginBottom_20,
          }}
          checkIcon={true}
          value={unbox}
          onChangeText={setUnbox}
        />
        <components.InputField
          placeholder='Password'
          containerStyle={{
            marginBottom: theme.sizes.marginBottom_20,
          }}
          secureTextEntry={passwordVisible} 
          onToggleSecureEntry={togglePasswordVisibility}
          value={passbox}
          onChangeText={setPassbox}
          eyeOffIcon
          eyeOnIcon
          keyIcon
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.sizes.marginBottom_30,
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: '#55CBF5',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.colors.white,
                marginLeft: 12,
              }}
            >
              {rememberMe && <svg.ActiveCheckSvg />}
            </View>
            <Text
              style={{
                marginLeft: 10,
                ...theme.fonts.SourceSansPro_Regular_16,
                lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
                color: colors.textPrimary,
                
              }}
            >
              Remember me
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginLeft: 'auto' }}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text
              style={{
                ...theme.fonts.SourceSansPro_Regular_16,
                lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
            
                color: colors.textPrimary,
              }}
            >
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>

        <components.Button
          title='Log In'
          containerStyle={{ marginBottom: theme.sizes.marginBottom_30 }}
          onPress={handleSignIn}
        />

        {/* <ParsedText
          style={{
            textAlign: 'center',
            ...theme.fonts.SourceSansPro_Regular_16,
            lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
            color: colors.textPrimary,
            marginBottom: 22,
          }}
          parse={[
            {
              pattern: /Register now/,
              style: { color: '#1EA8E7' },
              onPress: () => navigation.navigate('SignUp'),
            },
          ]}
        >
          No account? Register now
        </ParsedText> */} 
      </KeyboardAwareScrollView>
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
      <SafeAreaView  style={{ flex: 1, backgroundColor: colors.background }}>
        {renderToggleButton()}
        {renderContent()}
      </SafeAreaView>
  );
};

export default SignIn;
