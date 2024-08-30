import React, { useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { useVizbeeSession } from "../hooks/useVizbeeSession";
import { useVizbeeMedia } from "../hooks/useVizbeeMedia";
import { useVideoPlayer } from "../hooks/useVideoPlayer";
import { VideoPlayer } from "../components/VideoPlayer";
import { CastingOverlay } from "../components/CastingOverlay";
import { VideoListItem } from "../components/VideoListItem";
import { videos } from "../constants/VideoListContent";

const Back = require("../../assets/back.png");

export const DetailScreen = ({ route, navigation }: any) => {
  const { video: initialVideo } = route.params;
  const {
    currentVideo,
    isFullscreen,
    videoRef,
    toggleFullscreen,
    invokeSmartPlay,
    onSelectVideo,
  } = useVideoPlayer(initialVideo);

  var { castingPosition, lastCastingGuid } = useVizbeeMedia();

  const { isCasting, castingDevice, castingState } = useVizbeeSession();

  const onConnected = () => {
    invokeSmartPlay(currentVideo);
  };

  const onDisconnected = () => {
    if (currentVideo.guid == lastCastingGuid) {
      videoRef.current?.seek(castingPosition);
    }
    videoRef.current?.resume();
    castingPosition = 0;
  };

  useEffect(() => {
    if (castingState === "CONNECTED") {
      onConnected();
    } else if (castingState === "NOT_CONNECTED" && videoRef.current) {
      onDisconnected();
    }
  }, [castingState, videoRef.current]);

  useEffect(() => {
    invokeSmartPlay(currentVideo);
  }, []);

  useEffect(() => {
    if (isCasting) {
      videoRef.current?.pause();
    }
  }, [isCasting]);

  const filteredVideos = videos.filter((v) => v.guid !== currentVideo.guid);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="lightblue"
        barStyle="dark-content"
        hidden={isFullscreen}
      />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={Back} style={styles.backButton} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vizbee</Text>
        </View>
      </View>
      <View
        style={[styles.videoContainer, isFullscreen && styles.fullscreenVideo]}
      >
        {isCasting ? (
          <CastingOverlay
            castingDevice={castingDevice}
            thumbnail={currentVideo.imageUrl}
          />
        ) : (
          <VideoPlayer
            video={currentVideo}
            videoRef={videoRef}
            toggleFullscreen={toggleFullscreen}
          />
        )}
      </View>
      {!isFullscreen && (
        <FlatList
          data={filteredVideos}
          renderItem={({ item }) => (
            <VideoListItem item={item} onPress={() => onSelectVideo(item)} />
          )}
          keyExtractor={(item) => item.guid}
          style={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9FA8DA",
  },
  header: {
    backgroundColor: "lightblue",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    height: 56,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    paddingLeft: 10,
  },
  backButton: {
    width: 24,
    height: 24,
    paddingHorizontal: 10,
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  fullscreenVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  listContainer: {
    flex: 1,
    padding: 10,
  },
});
