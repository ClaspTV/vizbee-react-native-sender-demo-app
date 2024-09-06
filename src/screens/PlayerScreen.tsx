import React, { useEffect, useCallback } from "react";
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

export const PlayerScreen = ({ route, navigation }: any) => {
  const { video: initialVideo, resumePosition: initialResumePosition } =
    route.params;

  const {
    currentVideo,
    isFullscreen,
    videoRef,
    toggleFullscreen,
    invokeSmartPlay,
    onSelectVideo,
    initialPosition,
    setInitialPosition,
  } = useVideoPlayer(initialVideo, initialResumePosition);

  const {
    castingPosition,
    lastCastingGuid,
    resetLastCastingGuidAndCastingPosition,
  } = useVizbeeMedia();
  const { isCasting, castingDevice, castingState } = useVizbeeSession();

  useEffect(() => {
    if (castingState === "CONNECTED") {
      invokeSmartPlay(currentVideo);
    } else if (castingState === "NOT_CONNECTED" && videoRef.current) {
      videoRef.current.resume();
    }
  }, [castingState, videoRef.current, currentVideo, invokeSmartPlay]);

  useEffect(() => {
    if (lastCastingGuid === currentVideo.guid) {
      setInitialPosition(initialResumePosition || castingPosition);
    }
  }, [lastCastingGuid, castingPosition, currentVideo.guid]);

  useEffect(() => {
    if (!initialResumePosition) {
      invokeSmartPlay(currentVideo);
    }
  }, []);

  useEffect(() => {
    if (isCasting) {
      videoRef.current?.pause();
    }
  }, [isCasting]);

  const filteredVideos = videos.filter((v) => v.guid !== currentVideo.guid);

  const resetInitialVideoPosition = () => {
    setInitialPosition(0);
    resetLastCastingGuidAndCastingPosition();
  };

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
            key={currentVideo.guid}
            toggleFullscreen={toggleFullscreen}
            startPosition={initialPosition}
            resetInitialVideoPosition={resetInitialVideoPosition}
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
