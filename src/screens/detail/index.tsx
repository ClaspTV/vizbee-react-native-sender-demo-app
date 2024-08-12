import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import {
  VizbeeManager,
  VizbeeVideo,
  VizbeeCastButton,
  //@ts-ignore
} from 'react-native-vizbee-sender-sdk';
import Video from 'react-native-video';

const DetailScreen = ({route, navigation}: {route: any; navigation: any}) => {
  const {video} = route.params;
  const [isPlaying, setIsPlaying] = useState(false);

  const onWatchPress = () => {
    const vizbeeVideo = new VizbeeVideo();
    vizbeeVideo.guid = video.guid;
    vizbeeVideo.title = video.title;
    vizbeeVideo.subtitle = video.subtitle;
    vizbeeVideo.imageUrl = video.imageUrl;
    vizbeeVideo.streamUrl = video.streamUrl;
    vizbeeVideo.isLive = video.isLive;

    VizbeeManager.smartPlay(
      vizbeeVideo,
      (vizbeeConnectedDeviceInfo: any) => {
        console.info(
          `DetailScreen::onWatchPress - SmartPlay playing on TV  ${vizbeeConnectedDeviceInfo.connectedDeviceFriendlyName}`,
        );
      },
      (playOnPhoneReason: any) => {
        console.info(
          `DetailScreen::onWatchPress - SmartPlay play on phone with reason ${playOnPhoneReason}`,
        );
        setIsPlaying(true);
      },
    );
  };

  return (
    <View style={styles.container}>
      {isPlaying ? (
        <View style={styles.videoContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setIsPlaying(false)}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Video
            source={{uri: video.streamUrl}}
            style={styles.fullScreenVideo}
            controls={true}
            resizeMode="contain"
          />
        </View>
      ) : (
        <>
          <StatusBar backgroundColor="lightblue" barStyle="dark-content" />
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.pop()}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Video Details</Text>
            <View style={styles.castContainer}>
              <VizbeeCastButton style={styles.castButton} />
            </View>
          </View>
          <Image source={{uri: video.imageUrl}} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{video.title}</Text>
            <Text style={styles.subtitle}>{video.subtitle}</Text>
            {video.genre && <Text style={styles.genre}>{video.genre}</Text>}
          </View>
          <TouchableOpacity style={styles.watchButton} onPress={onWatchPress}>
            <Text style={styles.watchButtonText}>Watch</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#9FA8DA',
    width: '100%',
  },
  header: {
    backgroundColor: 'lightblue',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    height: 56,
    width: '100%',
  },
  headerTitle: {
    marginLeft: 70,
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  castContainer: {
    marginRight: 16,
  },
  castButton: {
    width: 32,
    height: 32,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  genre: {
    fontSize: 14,
    color: '#888',
  },
  watchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  watchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  fullScreenVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 8,
    left: 10,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default DetailScreen;
