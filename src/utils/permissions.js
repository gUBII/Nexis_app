import { Platform } from 'react-native';
import RNLocation from 'react-native-location';

export async function requestLocationPermission() {
  if (Platform.OS === 'ios') {
    const granted = await RNLocation.requestPermission({
      ios: 'whenInUse',
      android: { detail: 'fine' },
    });
    return !!granted;
  }

  const granted = await RNLocation.requestPermission({
    ios: 'whenInUse',
    android: { detail: 'fine' },
  });
  return !!granted;
}
