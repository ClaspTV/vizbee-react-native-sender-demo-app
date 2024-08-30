import React, { useEffect } from "react";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import {
  VizbeeCastButton,
  VizbeeManager,
  //@ts-ignore
} from "react-native-vizbee-sender-sdk";
import { VideoList } from "../components/VideoList";

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    setTimeout(() => {
      VizbeeManager.smartPrompt();
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="lightblue" barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vizbee</Text>
        <View style={styles.castContainer}>
          <VizbeeCastButton style={styles.castButton} />
        </View>
      </View>
      <VideoList navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#9FA8DA",
    flex: 1,
    width: "100%",
  },
  header: {
    backgroundColor: "lightblue",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    height: 56,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  castContainer: {
    marginRight: 16,
  },
  castButton: {
    width: 32,
    height: 32,
  },
});
