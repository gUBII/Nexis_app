import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, useColorScheme } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { WebView } from 'react-native-webview';
import Icons from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { components } from '../../components'; 
import ParsedText from 'react-native-parsed-text';
import {svg} from '../../assets/svg';

const SignUp = ({navigation}) => {
  const [isConnected1, setIsConnected1] = React.useState(true);
  const colorScheme = useColorScheme(); 
  const [themeMode, setThemeMode] = useState(colorScheme || 'light');

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
  };

  const colors = {
    background: themeMode === 'dark' ? '#1D1D1D' : '#333',
    textPrimary: themeMode === 'dark' ? '#ADD8E6' : '#000000',
    textSecondary: themeMode === 'dark' ? '#B4B4C6' : '#333333',
    buttonBackground: '#1EA8E7',
    dotActive: themeMode === 'dark' ? '#FFFFFF' : '#000000',
    dotInactive: themeMode === 'dark' ? '#888888' : '#CCCCCC',
  };

  const handleWebViewMessage = async (event) => {
    try {
      // Parse the message sent from the WebView
      const messageData = JSON.parse(event.nativeEvent.data);

      if (messageData.type === 'signup_success') {
        const { userId, ref_db, userName } = messageData;

         // Save the data to AsyncStorage
         await AsyncStorage.setItem('secondaryId', userId);
         await AsyncStorage.setItem('ref_db', ref_db);
         await AsyncStorage.setItem('secondaryUsername2', userName);
 
         console.log('User data saved in AsyncStorage');
         console.log('User ID:', userId);
         console.log('Username:', userName);
         console.log('RefDB:', ref_db);
 

        // Navigate to the Home screen (example)
        navigation.navigate('TabNavigator', { userId });
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const renderGoBack = () => {
    return (
      <View style={styles.goBackContainer}>
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
          <svg.GoBackSvg />
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        
        }}
        enableOnAndroid={true}
      >

        {/* WebView Container */}
        <View style={styles.webViewContainer}>
          {isConnected1 ? (
            <View style={styles.webViewWrapper}>
              <WebView
                source={{
                  uri: 'https://www.nexis365.com/saas/register.php?sourcefrom=APP',
                }}
                onMessage={handleWebViewMessage}
                style={[styles.webView, { flex: 1, backgroundColor:'#1D1D1D' }]}
              />
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Check your connection and try again
              </Text>
            </View>
          )}
         {/* <ParsedText
           style={{
            backgroundColor: '#1D1D1D',
            color: 'white',
            paddingVertical: '5%', 
            textAlign: 'center',
            fontSize:18,
            }}
           parse={[
           {
           pattern: /Let's Login/,
          style: { color: '#1EA8E7' }, 
          onPress: () => navigation.navigate('SignIn'), 
          },
          ]}
          >
          Already have an account? Let's Login.
         </ParsedText> */}

        </View>
      </KeyboardAwareScrollView>
    );
  };

  const { height: screenHeight } = Dimensions.get('window');

  const styles = StyleSheet.create({

    goBackContainer: {
      position: 'absolute',
      left: 10,
      top: 20,
      zIndex: 100,
    },
    goBackButton: {
      padding: 8,
      borderColor: 'rgba(255, 255, 255, 0.5)',
      borderWidth: 2,
      borderRadius: 15,
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      width: '100%',
      justifyContent: 'center',
      alignItems:'center',
    },
    logo: {
      width: 120,
      height: 40,
      marginBottom: 20,
    },
    signUpButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    webViewContainer: {
      flex: 1,
      width: '100%',
      height: screenHeight * 0.7,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
    },
    webViewWrapper: {
      flex: 1,
      overflow: 'hidden',
    },
    webView: {
      flex: 1,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      color: 'red',
      fontSize: 16,
      textAlign: 'center',
    },
  });

  //  const renderHeader = () => {
  //     return <components.Header logo={false}
  //      showToggleTheme={false}  more={false} userhead={false}  goBack={true} creditCard={false} />;
  //   };

  const renderToggleButton = () => {
    const icon = themeMode === 'dark' ? 'sun' : 'moon';

    return (
      <TouchableOpacity
        style={{
          marginTop: 35,
          marginLeft: 350,
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
      {/* <View style={{marginTop:20 }} >
      {renderHeader()}
      </View> */}
      {renderGoBack()}
      {renderContent()}
    </View>
  );
};

export default SignUp;
