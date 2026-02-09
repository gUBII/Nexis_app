import { View, Text, ScrollView, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '../../constants/ThemeContext';
import { svg } from '../../assets/svg'; 
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Chatbot = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [prevQuestion, setPrevQuestion] = useState("");

  const handleTextChange = (text) => {
    if (text.length < prevQuestion.length) {
      setAnswer("");
    }
    setPrevQuestion(text);
    setQuestion(text);
  };

  const fetchAnswer = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    const customQA = {
      "create invoice": "Creating Invoice For You...",
      "create roster": "Creating Roster For You....",
      "create project": "Creating Project For You....",
      "create task": "Creating Task For You....",
      "create payslip": "Creating Payslip For You....",
      "create forms": "Creating Forms For You....",
      "create complains": "Creating Complains For You....",
      "create employee": "Creating Employee For You....",
      "create client": "Creating Client For You....",
      "create receipt": "Creating Receipt For You....",
      "create payment": "Creating Payment For You....",
      "create expense": "Creating Expense For You....",
      "create attendance": "Creating Attendance For You....",
      "Edit settings": "Handle Your Settings....",
      "Where is your company located?": "We are based in New York, USA. Check out our location on Google Maps: https://goo.gl/maps/xyz.",
      "How can I contact support?": "You can contact support at support@yourcompany.com.",
      "What is your refund policy?": "Our refund policy can be found at our website under the 'Terms and Conditions' section.",
      "What payment methods do you accept?": "We accept credit/debit cards, PayPal, and bank transfers.",
    };

    const normalizedQuestion = question.trim().toLowerCase();

    if (customQA[normalizedQuestion]) {
      const customAnswer = customQA[normalizedQuestion];
      setAnswer(customAnswer);
      if (normalizedQuestion === "create invoice") {
        const url = `https://www.nexis365.com/saas/index.php?url=create_invoice.php&id=5161&sourcefrom=APP`;
        navigation.navigate("Webview", { url });
      }
      if (normalizedQuestion === "create roster") {
        const url = `https://www.nexis365.com/saas/index.php?url=schedule.php&id=48&sourcefrom=APP`;
        navigation.navigate("Webview", { url });
      }
      if (normalizedQuestion === "create project") {
        const url = `https://www.nexis365.com/saas/index.php?url=projects.php&id=5229&pstat=1&stat=&sourcefrom=APP`;
        navigation.navigate("Webview", { url });
      }
      if (normalizedQuestion === "create task") {
        const url = `https://www.nexis365.com/saas/index.php?url=task_manager.php&id=5228&sourcefrom=APP`;
        navigation.navigate("Webview", { url });
      }
      if (normalizedQuestion === "create payslip") {
        const url = `https://www.nexis365.com/saas/index.php?url=pay_slip.php&id=51&sourcefrom=APP`;
        navigation.navigate("Webview", { url });
      }
      if (normalizedQuestion === "create forms") {
        const url = `https://www.nexis365.com/saas/index.php?url=general_forms.php&id=5205&sourcefrom=APP`;
        navigation.navigate("Webview", { url });
      }
      if (normalizedQuestion === "create employee") {
        const url = `https://www.nexis365.com/saas/index.php?url=employees.php&id=59&sourcefrom=APP`;
        navigation.navigate("Webview", { url });
      }
      if (normalizedQuestion === "create client") {
        const url = `https://www.nexis365.com/saas/index.php?url=clients.php&id=5226&sourcefrom=APP`;
        navigation.navigate("Webview", { url });
      }
      if (normalizedQuestion === "create receipt") {
        const url = `https://www.nexis365.com/saas/index.php?url=receipt_voucher.php&id=5155&sourcefrom=APP`;
        navigation.navigate("Webview", { url });
      }
      if (normalizedQuestion === "create payment") {
        const url = `https://www.nexis365.com/saas/index.php?url=payment_voucher.php&id=5156&sourcefrom=APP`;
        navigation.navigate("Webview", { url });
      }
      if (normalizedQuestion === "create expense") {
        const url = `https://www.nexis365.com/saas/index.php?url=office_expenses.php&id=5158&sourcefrom=APP`;
        navigation.navigate("Webview", { url });
      }
      if (normalizedQuestion === "create attendance") {
        const url = `https://www.nexis365.com/saas/index.php?url=attendance.php&id=44&sourcefrom=APP`;
        navigation.navigate("Webview", { url });
      }
      if (normalizedQuestion === "edit settings") {
        const url = `https://www.nexis365.com/saas/index.php?url=settings.php&id=5173&sourcefrom=APP`;
        navigation.navigate("Webview", { url });
      }
      if (normalizedQuestion === "create complains") {
        const url = `https://www.nexis365.com/saas/index.php?url=complaints.php&id=5204&sourcefrom=APP`;
        navigation.navigate("Webview", { url });
      }
      setLoading(false);
    } else {
      try {
        const response = await axios.post("https://app.nexis365.com/api/qa", { question });
        setAnswer(response.data.answer);
      } catch (error) {
        console.error("Error fetching answer:", error);
        setAnswer("Sorry, I couldn't find an answer.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.nativeEvent.key === 'Enter') {
      fetchAnswer();
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme === "dark" ? "#333" : "#fff",
        paddingHorizontal: 20,
        paddingVertical: 20,
      }}
    >
      {/* Centered Title */}
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", color: theme === "dark" ? "#fff" : "#000", marginBottom: 20 }}>
        Nexis Chatbot
      </Text>
      
      <View style={{ width: "100%", padding: 20, borderRadius: 10, marginTop: 30 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: theme === 'dark' ? '#fff' : '#000', marginBottom: 5 }}>How may I help you? :</Text>
        <View style={{ position: "relative", width: "100%" }}>
          <TextInput
            style={{
              borderWidth: 1,
              padding: 10,
              paddingRight: 50,
              marginBottom: 10,
              borderRadius: 5,
              borderColor: "#fff",
              color: theme === 'dark' ? '#fff' : '#fff',
              backgroundColor: 'black',
              zIndex: 1000,
            }}
            value={question}
            onChangeText={handleTextChange}
            placeholder="Type your query..."
            placeholderTextColor={theme === "dark" ? "#fff" : "#fff"}
            onKeyPress={handleKeyPress}
          />
          <Image source={require("../../assets/favicon/icon-1.png")} style={{ position: "absolute", right: -5, top: -65, width: 80, height: 80 }} />
          <TouchableOpacity style={{ position: "absolute", right: 10, padding: 10, color: '#fff', zIndex: 1000, marginTop: 2 }} onPress={fetchAnswer}>
            <svg.SearchSvg width={24} height={24} fill="white" />
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <Text style={{ marginTop: 20, fontSize: 18, fontWeight: "bold", color: theme === 'dark' ? '#fff' : '#000', textAlign: "center" }}>{answer}</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Chatbot;
