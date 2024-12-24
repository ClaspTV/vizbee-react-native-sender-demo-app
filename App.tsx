import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  VizbeeCastBar,
  //@ts-ignore
} from "react-native-vizbee-sender-sdk";
import { HomeScreen } from "./src/screens/HomeScreen";
import { PlayerScreen } from "./src/screens/PlayerScreen";
import { LoginScreen } from "./src/screens/LoginScreen";  // Make sure LoginScreen is properly exported
import { navigationRef } from "./src/utils/NavigationService";

export type RootStackParamList = {
  Home: undefined;
  Player: undefined;
  Login: {
    isFromTVSignIn?: boolean;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Player"
              component={PlayerScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ 
                headerShown: false,
                presentation: 'modal'
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <VizbeeCastBar />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;