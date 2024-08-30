import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { VideoListItem } from "./VideoListItem";
import { VideoItem } from "../types/VideoItem";
import { videos } from "../constants/VideoListContent";

interface VideoListProps {
  navigation: any;
}

export const VideoList: React.FC<VideoListProps> = ({ navigation }) => {
  const onSelectVideo = (item: VideoItem) => {
    navigation.navigate("DetailScreen", { video: item });
  };

  return (
    <FlatList
      data={videos}
      renderItem={({ item }) => (
        <VideoListItem item={item} onPress={() => onSelectVideo(item)} />
      )}
      keyExtractor={(item) => item.guid}
      ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
    />
  );
};

const styles = StyleSheet.create({
  itemSeparator: {
    backgroundColor: "#FFFFFF",
    height: 1,
  },
});
