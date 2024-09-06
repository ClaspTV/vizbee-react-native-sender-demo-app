import { useRef, useEffect, useCallback } from "react";
// @ts-ignore
import { VizbeeManager } from "react-native-vizbee-sender-sdk";

export const useVizbeeMedia = () => {
  const castingPosition = useRef(0);
  const lastCastingGuid = useRef("");
  const listenerRef = useRef<any>(null);

  const resetLastCastingGuidAndCastingPosition = useCallback(() => {
    lastCastingGuid.current = "";
    castingPosition.current = 0;
  }, []);

  useEffect(() => {
    const handleMediaStatusChange = (mediaStatus: any) => {
      if (mediaStatus?.position && mediaStatus?.guid) {
        castingPosition.current = mediaStatus.position / 1000; // Convert milliseconds to seconds
        lastCastingGuid.current = mediaStatus.guid;
      }
    };

    if (!listenerRef.current) {
      listenerRef.current = VizbeeManager.addListener(
        "VZB_MEDIA_STATUS",
        handleMediaStatusChange
      );
    }

    return () => {
      if (listenerRef.current) {
        VizbeeManager.removeListener("VZB_MEDIA_STATUS", listenerRef.current);
        listenerRef.current = null;
      }
    };
  }, []);

  return {
    castingPosition: castingPosition.current,
    lastCastingGuid: lastCastingGuid.current,
    resetLastCastingGuidAndCastingPosition,
  };
};
