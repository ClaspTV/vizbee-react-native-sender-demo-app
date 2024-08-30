import React from "react";
import { View, StyleSheet } from "react-native";
import Video from "react-native-video";
// @ts-ignore
import { VizbeeCastButton } from "react-native-vizbee-sender-sdk";
import { VideoItem } from "../types/VideoItem";

interface VideoPlayerProps {
  video: VideoItem;
  videoRef: any;
  toggleFullscreen: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  videoRef,
  toggleFullscreen,
}) => {
  return (
    <View style={styles.videoInnerContainer}>
      <Video
        ref={videoRef}
        source={{ uri: video.streamUrl }}
        style={styles.video}
        resizeMode="contain"
        controls={true}
        key={video.guid}
        onFullscreenPlayerWillPresent={toggleFullscreen}
        onFullscreenPlayerWillDismiss={toggleFullscreen}
      />
      <View style={styles.videoOverlay}>
        <VizbeeCastButton style={styles.castButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  videoInnerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    flex: 1,
  },
  videoOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  castButton: {
    width: 32,
    height: 32,
  },
});
