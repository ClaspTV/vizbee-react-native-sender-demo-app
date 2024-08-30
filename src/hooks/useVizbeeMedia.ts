import { useRef, useEffect } from "react";
// @ts-ignore
import { VizbeeManager } from "react-native-vizbee-sender-sdk";

export const useVizbeeMedia = () => {
  const castingPosition = useRef(0);
  const lastCastingGuid = useRef("");

  useEffect(() => {
    const handleMediaStatusChange = (mediaStatus: any) => {
      if (mediaStatus?.position && mediaStatus?.guid) {
        castingPosition.current = mediaStatus.position / 1000; // Convert milliseconds to seconds
        lastCastingGuid.current = mediaStatus.guid;
      }
    };

    VizbeeManager.addListener("VZB_MEDIA_STATUS", handleMediaStatusChange);

    return () => {
      VizbeeManager.removeAllListeners("VZB_MEDIA_STATUS");
    };
  }, []);

  return {
    castingPosition: castingPosition.current,
    lastCastingGuid: lastCastingGuid.current,
  };
};
