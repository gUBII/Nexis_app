// context/UserContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        if (storedToken) {
          setUserToken(storedToken);
        }
      } catch (error) {
        console.error("Error loading token:", error);
      }
    };

    loadToken();
  }, []);

  return (
    <UserContext.Provider value={{ userToken, setUserToken }}>
      {children}
    </UserContext.Provider>
  );
};
