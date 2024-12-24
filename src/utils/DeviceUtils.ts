import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

const DEVICE_ID_KEY = 'device_id';

export async function getDeviceId(): Promise<string> {
    try {
        // Try to get cached device ID
        let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
        
        if (!deviceId) {
            // If no cached ID, generate a new one using device info
            deviceId = `${Platform.OS}-${await DeviceInfo.getUniqueId()}`;
            await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
        }
        
        return deviceId;
    } catch (error) {
        console.error('Error getting device ID:', error);
        // Fallback to a timestamp-based ID if everything fails
        return `${Platform.OS}-${Date.now()}`;
    }
}