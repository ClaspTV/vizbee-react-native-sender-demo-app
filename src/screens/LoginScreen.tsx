import React, { FC, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  Platform,
  Alert
} from 'react-native';
import { storage } from '../homesso/storage';
import { AccountManager } from '../homesso/AccountManager';
import { NavigationService } from '../utils/NavigationService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: FC<LoginScreenProps> = ({ route, navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const LOG_TAG = 'LoginScreen';

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      Alert.alert('', message);
    }
  };

  const handleSubmit = async () => {
    try {
      const trimmedUsername = username.trim().toLowerCase();
      const trimmedPassword = password.trim();

      const authToken = await AccountManager.signIn(trimmedUsername, trimmedPassword);
      console.log(`${LOG_TAG}: SignIn successful authToken = ${authToken}`);
      
      showToast('Welcome!');
      await storage.setAuthToken(authToken);
      await AccountManager.updateRegCodeStatus(authToken);
      
      navigation.goBack();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'UNKNOWN';
      console.log(`${LOG_TAG}: SignIn failed with error = ${errorMessage}`);
      showToast(`SignIn failed with error = ${errorMessage}`);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
        <Text style={styles.title}>Vizbee Login</Text>

        <View style={styles.spacing} />

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.spacing} />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.spacing} />

        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00649B',
    padding: 16,
  },
  loginBox: {
    width: '100%',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  spacing: {
    height: 8,
  },
  input: {
    height: 48,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    color: 'white',
    paddingHorizontal: 8,
  },
  button: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: '#005C91',
    marginTop: 16,
  },
  submitButton: {
    backgroundColor: '#005C91',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});