import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

const DEVICE_ID_KEY = 'device_id';

export async function getDeviceId(): Promise<string> {
    try {
        // Try to get cached device ID
        let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
        
        if (!deviceId) {
            // Generate new ID
            const newDeviceId = `${Platform.OS}-${await DeviceInfo.getUniqueId()}`;
            
            // Store it atomically - if this fails, we don't want to return the unstored ID
            await AsyncStorage.setItem(DEVICE_ID_KEY, newDeviceId);
            
            // Only after successful storage, assign it to deviceId
            deviceId = newDeviceId;
        }
        
        return deviceId;
    } catch (error) {
        console.error('Error in getDeviceId:', error);
        // Fallback for complete failure of both storage and retrieval
        const fallbackId = `${Platform.OS}-${Date.now()}`;
        try {
            await AsyncStorage.setItem(DEVICE_ID_KEY, fallbackId);
            return fallbackId;
        } catch (storageError) {
            console.error('Failed to store fallback device ID:', storageError);
            throw new Error('Could not generate or store device ID');
        }
    }
}