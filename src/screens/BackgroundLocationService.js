import BackgroundFetch from "react-native-background-fetch";
import Geolocation from "@react-native-community/geolocation";
import { PermissionsAndroid, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Keep stage in memory (not AsyncStorage)
let locationStage = 1; // 👈 starts at 1

// Request location permissions
export async function requestLocationPermission() {
  if (Platform.OS === "android") {
    try {
      const fine = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (fine !== PermissionsAndroid.RESULTS.GRANTED) return false;

      if (Platform.Version >= 29) {
        const background = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
        );
        if (background !== PermissionsAndroid.RESULTS.GRANTED) return false;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
}

// Send location to your save-location API
async function sendLocation() {
  try {
    const ref_db = await AsyncStorage.getItem("ref_db");
    let schedule_id = await AsyncStorage.getItem("currentJobId");

    console.log("🔎 ref_db from storage:", ref_db);
    console.log("🔎 schedule_id from storage:", schedule_id);

    if (!ref_db || !schedule_id) {
      console.log("❌ Missing data for background location, skipping");
      return;
    }

    schedule_id = Number(schedule_id);

    Geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        await axios.post("https://app.nexis365.com/api/save-location", {
          ref_db,
          schedule_id,
          latitude,
          longitude,
          stage: locationStage, // 👈 send current stage
        });

        console.log("📡 Background location sent:", {
          latitude,
          longitude,
          stage: locationStage,
        });

        // Increment stage after successful send
        locationStage += 1;
      },
      (err) => console.log("❌ Background location error:", err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  } catch (error) {
    console.log("❌ Error in background location:", error.message);
  }
}

// Initialize BackgroundFetch
export async function initBackgroundLocationTracking() {
  const permission = await requestLocationPermission();
  if (!permission) {
    console.log("❌ Location permission denied");
    return;
  }

  // Send location immediately when started
  sendLocation();

  const onEvent = async (taskId) => {
    console.log("[BackgroundFetch] event:", taskId);
    sendLocation();
    BackgroundFetch.finish(taskId);
  };

  const onTimeout = async (taskId) => {
    console.log("[BackgroundFetch] TIMEOUT:", taskId);
    BackgroundFetch.finish(taskId);
  };

  const status = await BackgroundFetch.configure(
    {
      minimumFetchInterval: 15, // runs every ~15 min
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
    },
    onEvent,
    onTimeout
  );

  console.log("[BackgroundFetch] configured, status:", status);
}

// Optional helper to reset stage (call this on clock-out)
export function resetLocationStage() {
  locationStage = 1;
  console.log("🔄 Location stage reset to 1");
}
