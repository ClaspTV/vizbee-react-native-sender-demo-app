import React from "react";
import { TouchableOpacity, Image, View, Text, StyleSheet } from "react-native";
import { VideoItem } from "../types/VideoItem";

interface VideoListItemProps {
  item: VideoItem;
  onPress: () => void;
}

export const VideoListItem: React.FC<VideoListItemProps> = ({
  item,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.videoItem} onPress={onPress}>
      <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{item.title}</Text>
        <Text style={styles.videoSubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  videoItem: {
    flexDirection: "row",
    margin: 10,
    alignItems: "flex-start",
  },
  thumbnail: {
    width: 100,
    height: 56,
    borderRadius: 5,
  },
  videoInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  videoSubtitle: {
    fontSize: 14,
    color: "#666",
  },
});
