import React, { useState, useEffect } from "react";
import {  Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { components } from "../components";
import { theme } from "../constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../constants/ThemeContext";

const EditPersonalInfo = ({ navigation }) => {
  const { theme: themes } = useTheme();
  const [username, setUsername] = useState("");
  const [username2, setUsername2] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [refDb, setRefDb] = useState(""); 
  const [secondaryId, setSecondaryId] = useState(""); 

  useEffect(() => {
    const fetchAsyncStorageData = async () => {
      try {
        const storedRefDb = await AsyncStorage.getItem("ref_db");
        const storedSecondaryId = await AsyncStorage.getItem("secondaryId");
        const storedUsername = await AsyncStorage.getItem("username2");
        const storedPhone = await AsyncStorage.getItem("phone");

        if (storedRefDb) setRefDb(storedRefDb);
        if (storedSecondaryId) setSecondaryId(storedSecondaryId);
        if (storedUsername) setUsername2(storedUsername); 
        if (storedPhone) setPhone(storedPhone); 
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error);
      }
    };

    fetchAsyncStorageData();
  }, []);


  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("secondaryUsername2");
        if (storedUsername) setUsername2(storedUsername);
      } catch (error) {
        console.error("Failed to fetch username:", error);
      }
    };

    fetchUsername();
  }, []);


  const handleSave = async () => {
    if (!username || !username2 || !phone || !address || !city || !country) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    try {
      if (!refDb || !secondaryId) {
        Alert.alert("Error", "Missing database reference or user ID.");
        console.log("Missing ref_db or secondaryId:", { refDb, secondaryId });
        return;
      }
      const apiUrl = `https://app.nexis365.com/api/update-user-info?ref_db=${refDb}`;

      console.log("Sending data to API:", {
        id: secondaryId,
        username,
        username2,
        phone,
        address,
        city,
        country,
      });

      const response = await axios.post(apiUrl, {
        id: secondaryId,
        username,
        username2,
        phone,
        address,
        city,
        country,
      });

      await AsyncStorage.setItem('secondaryUsername2', username2);
      await AsyncStorage.setItem('phone', phone);

      if (response.data.success) {
        Alert.alert("Success", "Information updated successfully.");
        console.log("Update successful:", response.data);
        navigation.navigate("Profile");
      } else {
        Alert.alert("Update Failed", response.data.message || "Please try again.");
        console.log("Update failed:", response.data);
      }
    } catch (error) {
      console.error("Error updating user info:", error);
      Alert.alert("Error", "An error occurred while saving your information.");
    }
  };

  const renderHeader = () => <components.Header goBack logo={false} />;

  const renderContent = () => (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingBottom: theme.sizes.paddingBottom_20,
        backgroundColor: themes === 'dark' ? '#333' : '#fff',
        paddingTop:60,
      }}
      enableOnAndroid={true}
      showsVerticalScrollIndicator={false}
    >
      <components.InputField
        placeholder="Enter Your First Name"
        value={username}
        onChangeText={setUsername}
        containerStyle={{ marginBottom: theme.sizes.marginBottom_20 }}
        userIcon={true}
      />
       <components.InputField
        placeholder="Enter Your Last Name"
        value={username2}
        onChangeText={setUsername2}
        containerStyle={{ marginBottom: theme.sizes.marginBottom_20 }}
        userIcon={true}
      />
       <components.InputField
        placeholder="Enter Your Phone Number"
        value={phone}
        onChangeText={setPhone}
        containerStyle={{ marginBottom: theme.sizes.marginBottom_20 }}
        userIcon={true}
      />
      <components.InputField
        placeholder="Enter Your Address"
        value={address}
        onChangeText={setAddress}
        containerStyle={{ marginBottom: theme.sizes.marginBottom_20 }}
        locationIcon={true}
      />
      <components.InputField
        placeholder="Enter Your City"
        value={city}
        onChangeText={setCity}
        containerStyle={{ marginBottom: theme.sizes.marginBottom_20 }}
        cityIcon={true}
      />
      <components.InputField
        placeholder="Enter Your Country"
        value={country}
        onChangeText={setCountry}
        containerStyle={{ marginBottom: theme.sizes.marginBottom_20 }}
        flagIcon={true}
      />
      <components.Button
        title="Save"
        onPress={handleSave}
        containerStyle={{ marginTop: theme.sizes.marginTop_10, marginBottom:'100%' }}
      />
    </KeyboardAwareScrollView>
  );

  return (
    <components.SafeAreaView>
      {renderHeader()}
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default EditPersonalInfo;
