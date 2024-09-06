import { useState, useRef, useCallback } from "react";
import { VideoRef } from "react-native-video";
// @ts-ignore
import { VizbeeManager, VizbeeVideo } from "react-native-vizbee-sender-sdk";
import { VideoItem } from "../types/VideoItem";
import { Double } from "react-native/Libraries/Types/CodegenTypes";

export const useVideoPlayer = (
  initialVideo: VideoItem,
  initialResumePosition: number
) => {
  const [currentVideo, setCurrentVideo] = useState(initialVideo);
  const [initialPosition, setInitialPosition] = useState(initialResumePosition);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<VideoRef>(null);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const invokeSmartPlay = useCallback(async (video: VideoItem) => {
    const position = await videoRef.current
      ?.getCurrentPosition()
      .then((position) => position || 0)
      .catch(() => 0);

    const vizbeeVideo = new VizbeeVideo();
    vizbeeVideo.guid = video.guid;
    vizbeeVideo.title = video.title;
    vizbeeVideo.subtitle = video.subtitle;
    vizbeeVideo.imageUrl = video.imageUrl;
    vizbeeVideo.streamUrl = video.streamUrl;
    vizbeeVideo.isLive = video.isLive;
    vizbeeVideo.startPositionInSeconds = position;

    VizbeeManager.smartPlay(
      vizbeeVideo,
      (_: any) => {},
      (_: any) => {
        videoRef.current?.resume();
      }
    );
  }, []);

  const onSelectVideo = useCallback(
    (item: VideoItem) => {
      setCurrentVideo(item);
      invokeSmartPlay(item);
    },
    [invokeSmartPlay]
  );

  return {
    currentVideo,
    isFullscreen,
    videoRef,
    toggleFullscreen,
    invokeSmartPlay,
    onSelectVideo,
    initialPosition,
    setInitialPosition,
  };
};
