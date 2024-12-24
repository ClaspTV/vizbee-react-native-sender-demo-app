import React, { useEffect } from "react";
import { StyleSheet, Text, View, StatusBar } from "react-native";
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

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  const { castingState } = useVizbeeSession();
  const { castingPosition, lastCastingGuid } = useVizbeeMedia();

  useEffect(() => {

    const manager = VizbeeHomeSSOManager.getInstance();
    manager.start(new RNDemoAppVizbeeHomeSSODelegate());

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
