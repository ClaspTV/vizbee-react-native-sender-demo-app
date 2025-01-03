import React, { useEffect } from "react";
import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from "react-native";
import {
  VizbeeCastButton,
  VizbeeManager,
  //@ts-ignore
} from "react-native-vizbee-sender-sdk";
import { VizbeeHomeSSOManager } from "react-native-vizbee-homesso-sender-sdk";
import { RNDemoAppVizbeeHomeSSODelegate } from "../homesso/RNDemoAppVizbeeHomeSSODelegate";
import { VideoList } from "../components/VideoList";
import { useVizbeeSession } from "../hooks/useVizbeeSession";
import { useVizbeeMedia } from "../hooks/useVizbeeMedia";
import { videos } from "../constants/VideoListContent";
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../constants/Colors';

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  const { castingState } = useVizbeeSession();
  const { castingPosition, lastCastingGuid } = useVizbeeMedia();

  useEffect(() => {
    const manager = VizbeeHomeSSOManager.getInstance();
    manager.enableLogging(true);
    manager.initialize(new RNDemoAppVizbeeHomeSSODelegate());

    setTimeout(() => {
      VizbeeManager.smartPrompt();
    }, 2000);
  }, []);

  useEffect(() => {
    if (castingState === "NOT_CONNECTED" && lastCastingGuid) {
      const videoItem = videos.find((video) => video.guid === lastCastingGuid);

      if (videoItem) {
        navigation.navigate("Player", {
          video: videoItem,
          resumePosition: castingPosition,
        });
      }
    }
  }, [castingState, lastCastingGuid, castingPosition, navigation]);

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="lightblue" barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vizbee</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
          <View style={styles.castContainer}>
            <VizbeeCastButton style={styles.castButton} />
          </View>
        </View>
      </View>
      <VideoList navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    width: "100%",
  },
  header: {
    backgroundColor: Colors.headerBackground,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    height: 56,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsButton: {
    marginRight: 16,
    padding: 4,
    width: 32,
    height: 32,
  },
  settingsIcon: {
    fontSize: 20,
  },
  castContainer: {
    marginRight: 16,
  },
  castButton: {
    width: 32,
    height: 32,
  },
});