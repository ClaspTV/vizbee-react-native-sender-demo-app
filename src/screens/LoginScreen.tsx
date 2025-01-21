import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../constants/Colors';
import { RootStackParamList } from '../../App';
import { AccountManager } from '../account/AccountManager';
import { headerStyles } from '../styles/HeaderStyles';
import { Storage } from '../utils/Storage';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: FC<LoginScreenProps> = ({ navigation, route }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      Alert.alert('', message);
    }
  };

  const handleSubmit = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);
    try {
      const trimmedUsername = username.trim().toLowerCase();
      const trimmedPassword = password.trim();

      const authToken = await AccountManager.signIn(trimmedUsername, trimmedPassword);
      if (!authToken) {
        throw new Error('Failed to get valid auth token');
      }
      
      console.log('SignIn successful authToken = ', authToken);
      showToast(`Successfully signed in as ${trimmedUsername}`);
      await Storage.setAuthToken(authToken);
      
      if (route.params.isFromTVSignIn) {
        await AccountManager.updateRegCodeStatus(authToken);
      }
      
      if (route.params?.onSignInComplete) {
        route.params.onSignInComplete();
      }
      
      navigation.goBack();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'UNKNOWN';
      console.log('SignIn failed with error = ', errorMessage);
      showToast(`SignIn failed with error = ${errorMessage}`);
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
        <Text style={headerStyles.headerTitle}>Vizbee Login</Text>
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.primary,
    },
    content: {
      padding: 16,
    },
    input: {
      height: 48,
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: Colors.text.white,
      color: Colors.text.white,
      marginBottom: 16,
      paddingHorizontal: 8,
    },
    button: {
      height: 48,
      backgroundColor: Colors.primaryDark,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      marginTop: 16,
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    buttonText: {
      color: Colors.text.white,
      fontSize: 16,
      fontWeight: '600',
    },
  });