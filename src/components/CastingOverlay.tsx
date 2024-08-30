import React from "react";
import { Image, Text, StyleSheet, View } from "react-native";

interface CastingOverlayProps {
  castingDevice: string;
  thumbnail: string;
}

export const CastingOverlay: React.FC<CastingOverlayProps> = ({
  castingDevice,
  thumbnail,
}) => {
  return (
    <View style={styles.castingOverlay}>
      <Image
        source={{ uri: thumbnail }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <Text style={styles.castingText}>Casting to {castingDevice}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  castingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  thumbnail: {
    height: "100%",
    width: "100%",
    backgroundColor: "red",
  },
  castingText: {
    position: "absolute",
    zIndex: 10,
    color: "#FFFFFF",
    fontSize: 14,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: "center",
    textAlignVertical: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
