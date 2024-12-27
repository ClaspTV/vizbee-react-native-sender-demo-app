import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Storage } from '../utils/Storage';
import { AccountManager } from '../account/AccountManager';
import { RootStackParamList } from '../../App';
import { headerStyles } from '../styles/HeaderStyles';
import { Colors } from '../constants/Colors';

type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    const authToken = await Storage.getAuthToken();
    setIsSignedIn(Boolean(authToken));
  }, []);

  const onSignInComplete = useCallback(() => {
    checkAuthStatus();
    navigation.goBack();
  }, [navigation]);

  const handleSignInPress = useCallback(() => {
    navigation.navigate('Login', { 
      isFromTVSignIn: false,
      onSignInComplete 
    });
  }, [navigation, onSignInComplete]);

  const handleSignOutPress = async () => {
    setIsLoading(true);
    try {
      const authToken = await Storage.getAuthToken();
      if (authToken) {
        await AccountManager.signOut(authToken);
        await Storage.setAuthToken('');
        setIsSignedIn(false);
        Alert.alert('Success', 'Successfully signed out');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={headerStyles.backButton}>
          <Text style={headerStyles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={headerStyles.headerTitle}>Settings</Text>
      </View>
      
      <TouchableOpacity
        style={styles.menuItem}
        onPress={isSignedIn ? handleSignOutPress : handleSignInPress}
        disabled={isLoading}
      >
        <Text style={styles.menuText}>
          {isSignedIn ? 'Sign Out' : 'Sign In'}
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.text.secondary} />
        ) : (
          <Text style={styles.chevron}>›</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceBackground,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  chevron: {
    fontSize: 24,
    color: Colors.text.secondary,
  },
});