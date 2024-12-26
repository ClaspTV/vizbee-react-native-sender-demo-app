import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigationService } from '../utils/NavigationService';
import { Storage } from '../utils/Storage';
import { AccountManager } from '../account/AccountManager';
import { RootStackParamList } from '../../App';
import { headerStyles } from '../styles/HeaderStyles';

type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const authToken = await Storage.getAuthToken();
    setIsSignedIn(Boolean(authToken));
  };

  const handleSignInPress = () => {
    navigation.navigate('Login', { 
      isFromTVSignIn: false,
      onSignInComplete: () => {
        checkAuthStatus();
        navigation.goBack();
      }
    });
  };

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
          <ActivityIndicator size="small" color="#666666" />
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: 'lightblue',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    height: 56,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  backArrow: {
    fontSize: 24,
    color: '#000000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  menuText: {
    fontSize: 16,
    color: '#000000',
  },
  chevron: {
    fontSize: 24,
    color: '#666666',
  }
});