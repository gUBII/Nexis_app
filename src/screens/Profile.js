import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import FitImage from 'react-native-fit-image';

import {components} from '../components';
import {theme} from '../constants';
import {svg} from '../assets/svg';
import {useTheme} from '../constants/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { height } from 'deprecated-react-native-prop-types/DeprecatedImagePropType';

const Profile = ({navigation}) => {
  const {theme, toggleTheme} = useTheme();
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [designation, setDesignation] = useState('');
  const [address, setAddress] = useState('');
  const [department, setDepartment] = useState('');
  const [employeeid, setEmployeeid] = useState('');
  const [jointime, setJointime] = useState('');
  const [nationality, setNationality] = useState('');
  const [maritalstatus, setMaritalStatus] = useState('');
  const [drivinglicence, setDrivinglicence] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const [abn, setAbn] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [bankname, setBankname] = useState('');
  const [acname, setAcname] = useState('');
  const [acnumber, setAcnumber] = useState('');
  const [bsb, setBsb] = useState('');
  const [person1, setPerson1] = useState('');
  const [person2, setPerson2] = useState('');
  const [relation1, setRelation1] = useState('');
  const [relation2, setRelation2] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [email1, setEmail1] = useState('');
  const [email2, setEmail2] = useState('');
  const [image, setImage] = useState('');

  const fetchProfileData = async () => {
    try {
      const ref_db = await AsyncStorage.getItem("ref_db");
      const userid = await AsyncStorage.getItem("secondaryId");

      if (!ref_db || !userid) {
        console.warn("Missing ref_db or userid.");
        return;
      }

      const response = await fetch(`https://app.nexis365.com/api/get-profile?ref_db=${ref_db}&userid=${userid}`);
      
      if (!response.ok) {
        console.error("Server error:", response.status, response.statusText);
        return;
      }

      const text = await response.text();  

      try {
        const data = JSON.parse(text);

        if (data.success) {
          setDesignation(data.profile.designation_name || '');
          setAddress(data.profile.address || '');
          setDepartment(data.profile.department || '');
          setEmployeeid(data.profile.id || '');
          setJointime(data.profile.jointime || '');
          setNationality(data.profile.nationality || '');
          setMaritalStatus(data.profile.marital_status || '');
          setDrivinglicence(data.profile.driving_licence_no || '');
          setAddress2(data.profile.address2 || '');
          setCity(data.profile.city || '');
          setState(data.profile.area || '');
          setZip(data.profile.zip || '');
          setCountry(data.profile.country || '');
          setAbn(data.profile.abn || '');
          setEmail(data.profile.email || '');
          setGender(data.profile.gender || '');
          setDob(data.profile.dob || '');
          setBankname(data.profile.bank_name || '');
          setAcname(data.profile.account_name || '');
          setAcnumber(data.profile.account_number || '');
          setBsb(data.profile.bsb || '');
          setPerson1(data.profile.emergency_contact_1 || '');
          setPerson2(data.profile.emergency_contact_2 || '');
          setRelation1(data.profile.emergency_relation_1 || '');
          setRelation2(data.profile.emergency_relation_2 || '');
          setPhone1(data.profile.emergency_phone_1 || '');
          setPhone2(data.profile.emergency_phone_2 || '');
          setEmail1(data.profile.emergency_email_1 || '');
          setEmail2(data.profile.emergency_email_2 || '');
          // setImage(data.profile.images || '');

           // Assuming the database returns only the image path (e.g., "uploads/profile1.jpg")
        const imagePath = data.profile.images || ''; 

        // Construct full image URL
        const fullImageUrl = imagePath 
          ? `https://www.nexis365.com/saas/${imagePath}` 
          : ''; 
        setImage(fullImageUrl); // Set the image URL

          await AsyncStorage.setItem("designation", data.profile.designation_name );

        } else {
          console.error("Failed to fetch profile data:", data.message);
        }
      } catch (jsonError) {
        console.error("Invalid JSON response, cannot parse:", text);
      }
      
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
};

  

  useEffect(() => {
    fetchProfileData();
    const unsubscribe = navigation.addListener('focus', fetchProfileData);
    return unsubscribe;
  }, [navigation]);


  useFocusEffect(
    React.useCallback(() => {
      const fetchUsername = async () => {
        try {
          const storedUsername = await AsyncStorage.getItem("secondaryUsername2");
          if (storedUsername) {
            setUsername(storedUsername);
          }
        } catch (error) {
          console.error("Failed to fetch username:", error);
        }
      };

      fetchUsername();
    }, []) 
  );

    const fetchAsyncStorageData = async () => {
      try {
        const storedPhone = await AsyncStorage.getItem("phone");
        if (storedPhone) setPhone(storedPhone); 
      } catch (error) {
        console.error("Error fetching data from AsyncStorageData:", error);
      }
    };

    useEffect(() => {
      fetchAsyncStorageData();
      const unsubscribe = navigation.addListener('focus', () => {
        fetchAsyncStorageData(); 
      });
  
      return unsubscribe;
    }, [navigation]);


  const renderHeader = () => {
    return <components.Header goBack logo={false} showToggleTheme={true} />;
  };

  const renderContent = () => {
    return (
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20,  backgroundColor: theme === 'dark' ? '#333' : '#fff',}}>
        <TouchableOpacity
          style={{
            marginTop:20,
          }}
          onPress={() => {
            navigation.navigate('EditPersonalInfo');
          }}
        >
          <View style={{flex:1, justifyContent:'center', alignItems:'center'}} >
          <Image
          source={image ? { uri: image } : require('../assets/profile/profile.png')} 
          style={{ width: 60, height: 60, borderRadius: 30 }} 
            />
          </View>

        </TouchableOpacity>
        <Text
          style={{
            textAlign: 'center',
            textTransform: 'capitalize',
            fontSize:18,
            marginTop:5,
            color: theme === 'dark' ? '#fff' : '#757575',
          }}
        >
           {username || "User"}
        </Text>

        <Text 
        style={{
          textAlign: 'center',
          color: theme === 'dark' ? '#fff' : '#757575',
          fontSize: 16,
          marginBottom: 4,
           }}
            >
               {designation}
          </Text>

        <Text
          style={{
            textAlign: 'center',
            color: theme === 'dark' ? '#fff' : '#757575',
            fontSize: 14,
            marginBottom:5
          }}
        >
          {address}
        </Text>

        {/* <Text
          style={{
            textAlign: 'center',
            color: theme === 'dark' ? '#fff' : '#444',
            fontSize:16,
          }}
        >
           {phone}
        </Text> */}
        <TouchableOpacity
          style={{
            backgroundColor: '#21AFF0',
            borderRadius: 10,
            paddingLeft: 10,
            paddingVertical: 10,
            paddingRight: 20,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
          onPress={() => navigation.navigate('EditPersonalInfo')}
        >
          <components.Image
            source={require('../assets/icons/user.png')}
            style={{
              width: responsiveHeight(5),
              aspectRatio: 1,
              marginRight: 10,
            }}
          />
          <Text
            style={{
              color: theme === 'dark' ? '#fff' : '#fff',
              textTransform: 'capitalize',
              marginRight: 'auto',
            }}
            numberOfLines={1}
          >
            Edit Personal Info
          </Text>
          <svg.RightArrowSvg />
        </TouchableOpacity>
        <View style={{ marginTop:10 }}>
         <View style={{ marginBottom: 10 }}>
         <View
          style={{
            width: "100%",
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 10,
            borderLeftWidth: 4,
            borderLeftColor: "#21AFF0",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
          }}
        >
             <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme === 'dark' ? '#757575' : '#757575', }}>Personal Information</Text>
            </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 5,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold",color: theme === 'dark' ? '#757575' : '#757575', }}>Department:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold",color: theme === 'dark' ? '#757575' : '#757575', }}>{department || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Employee ID:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{employeeid || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Join Date:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}> {jointime ? new Date(jointime * 1000).toLocaleDateString() : 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Nationality:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{nationality || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Marital Status:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{maritalstatus || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Driving Licence No:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{drivinglicence || 'N/A'}</Text>
          </View>
        </View>
      </View>
        </View>

        <View style={{ marginTop:10 }}>
         <View style={{ marginBottom: 10 }}>
         <View
          style={{
            width: "100%",
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 10,
            borderLeftWidth: 4,
            borderLeftColor: "#21AFF0",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
          }}
        >
           <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme === 'dark' ? '#757575' : '#757575', }}>Address</Text>
            </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 5,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Address:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{address || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Address2:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{address2 || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>City:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}> {city ||'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>State:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{state || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Zip:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{zip || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Country:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{country || 'N/A'}</Text>
          </View>
        </View>
      </View>
        </View>

        <View style={{ marginTop:10 }}>
         <View style={{ marginBottom: 10 }}>
         <View
          style={{
            width: "100%",
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 10,
            borderLeftWidth: 4,
            borderLeftColor: "#21AFF0",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
          }}
        >
           <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme === 'dark' ? '#757575' : '#757575', }}>Other Info</Text>
            </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 5,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>ABN:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{abn || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Email:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{email || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Gender:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}> {gender || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>DOB:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{dob || 'N/A'}</Text>
          </View>
        </View>
      </View>
        </View>

        <View style={{ marginTop:10 }}>
         <View style={{ marginBottom: 10 }}>
         <View
          style={{
            width: "100%",
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 10,
            borderLeftWidth: 4,
            borderLeftColor: "#21AFF0",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
          }}
        >
           <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme === 'dark' ? '#757575' : '#757575', }}>Bank Info</Text>
            </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 5,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Bank Name:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{bankname || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>A/C Name:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{acname || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>A/C Number:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}> {acnumber || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>BSB:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{bsb || 'N/A'}</Text>
          </View>
        </View>
      </View>
        </View>

        <View style={{ marginTop:10 }}>
         <View style={{ marginBottom: 10 }}>
         <View
          style={{
            width: "100%",
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 10,
            borderLeftWidth: 4,
            borderLeftColor: "#21AFF0",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
          }}
        >
           <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme === 'dark' ? '#757575' : '#757575', }}>Emergency Contact 1</Text>
            </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 5,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Person Name1:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{person1 || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Relation1:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{relation1 || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Phone1:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}> {phone1 || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Email1:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{email1 || 'N/A'}</Text>
          </View>
        </View>
      </View>
        </View>

        <View style={{ marginTop:10 }}>
         <View style={{ marginBottom: 10 }}>
         <View
          style={{
            width: "100%",
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 10,
            borderLeftWidth: 4,
            borderLeftColor: "#21AFF0",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
          }}
        >
           <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme === 'dark' ? '#757575' : '#757575', }}>Emergency Contact 2</Text>
            </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 5,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Person Name2:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{person2 || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Relation2:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{relation2 || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Phone2:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}> {phone2 || 'N/A'}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>Email2:</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: theme === 'dark' ? '#757575' : '#757575', }}>{email2 || 'N/A'}</Text>
          </View>
        </View>
      </View>
        </View>



      </ScrollView>
    );
  };

  const handleLogout = async () => {
    try {
        await AsyncStorage.multiRemove([
            'email',
            'ref_db',
            'application',
            'secondaryId',
            'secondaryEmail',
            'secondaryUsername2',
            'userToken',
        ]);

        // Verify if the data is cleared
        const email = await AsyncStorage.getItem('email');
        const ref_db = await AsyncStorage.getItem('ref_db');
        const application = await AsyncStorage.getItem('application');
        const secondaryId = await AsyncStorage.getItem('secondaryId');
        const secondaryEmail = await AsyncStorage.getItem('secondaryEmail');
        const secondaryUsername2 = await AsyncStorage.getItem('secondaryUsername2');
        const userToken = await AsyncStorage.getItem('userToken');

        // Log the values to check if they are null (data cleared)
        console.log('Data after logout:');
        console.log('email:', email);
        console.log('ref_db:', ref_db); 
        console.log('application:', application); 
        console.log('secondaryId:', secondaryId); 
        console.log('secondaryEmail:', secondaryEmail); 
        console.log('secondaryUsername2:', secondaryUsername2);
        console.log('userToken:', userToken); 

        // Navigate to the login page
        navigation.navigate('SignIn'); 
    } catch (error) {
        console.error('Failed to clear AsyncStorage:', error);
        Alert.alert('Error', 'Failed to logout. Please try again.');
    }
};


  const renderButton = () => {
    return (
      <components.Button
        title='Log out'
        lightShade={true}
        containerStyle={{padding: 20,}}
        onPress={handleLogout}
      />
    );
  };

  return (
    <components.SafeAreaView>
      {renderHeader()}
      {renderContent()}
      {renderButton()}
    </components.SafeAreaView>
  );
};

export default Profile;
