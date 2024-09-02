import React, { useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Video, {
  OnLoadData,
  OnProgressData,
  VideoRef,
} from "react-native-video";
// @ts-ignore
import { VizbeeCastButton } from "react-native-vizbee-sender-sdk";
import { VideoItem } from "../types/VideoItem";
import Icon from "react-native-vector-icons/MaterialIcons";
import Slider from "@react-native-community/slider";

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
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const onLoad = (data: OnLoadData) => {
    setDuration(data.duration);
  };

  const onProgress = (data: OnProgressData) => {
    setCurrentTime(data.currentTime);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const seekTo = (time: number) => {
    videoRef.current?.seek(time);
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: video.streamUrl }}
        style={styles.video}
        resizeMode="contain"
        onLoad={onLoad}
        onProgress={onProgress}
        paused={!isPlaying}
        muted={isMuted}
        controls={false}
        fullscreenAutorotate={true}
      />
      <View style={styles.controls}>
        <TouchableOpacity onPress={togglePlay}>
          <Icon
            name={isPlaying ? "pause" : "play-arrow"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Slider
            style={styles.progressBar}
            minimumValue={0}
            maximumValue={duration}
            value={currentTime}
            onSlidingComplete={seekTo}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="rgba(255, 255, 255, 0.5)"
            thumbTintColor="#FFFFFF"
          />
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
        <TouchableOpacity onPress={toggleMute}>
          <Icon
            name={isMuted ? "volume-off" : "volume-up"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <VizbeeCastButton style={styles.castButton} />
        <TouchableOpacity onPress={toggleFullscreen}>
          <Icon name="fullscreen" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 40,
  },
  timeText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 5,
  },
  castButton: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
});
