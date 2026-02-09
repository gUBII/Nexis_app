import { request, PERMISSIONS } from 'react-native-permissions';
import { Platform } from 'react-native';

export async function requestLocationPermission() {
  const permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  const result = await request(permission);
  return result === 'granted';
}
