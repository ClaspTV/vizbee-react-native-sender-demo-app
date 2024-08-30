import { useState, useEffect, useCallback, useRef } from "react";
// @ts-ignore
import { VizbeeManager } from "react-native-vizbee-sender-sdk";

export const useVizbeeSession = () => {
  const [isCasting, setIsCasting] = useState(false);
  const [castingDevice, setCastingDevice] = useState("");
  const [castingState, setCastingState] = useState("");

  const previousSessionStateRef = useRef<string | null>(null);

  const handleSessionStatusChange = (sessionStatus: any) => {
    const currentState = sessionStatus?.connectionState;

    // If the current state is the same as the previous state, don't execute the implementation
    if (currentState === previousSessionStateRef.current) {
      return;
    }

    // Update the previous state ref
    previousSessionStateRef.current = currentState;
    setCastingState(currentState);
    if (currentState === "CONNECTED") {
      VizbeeManager.getSessionConnectedDevice()
        .then((connectedDeviceInfo: any) => {
          setIsCasting(true);
          setCastingDevice(
            connectedDeviceInfo?.connectedDeviceFriendlyName || "TV"
          );
          setCastingState(currentState);
        })
        .catch(() => {
          console.warn(`Failed to get connected receiver info`);
          setIsCasting(true);
          setCastingDevice("TV");
          setCastingState(currentState);
        });
    } else {
      setIsCasting(false);
      setCastingDevice("");
    }
  };

  useEffect(() => {
    const listenForSessionStatus = () => {
      VizbeeManager.addListener(
        "VZB_SESSION_STATUS",
        handleSessionStatusChange
      );
      VizbeeManager.getSessionState()
        .then((sessionState: any) => {
          handleSessionStatusChange({ connectionState: sessionState });
        })
        .catch(() => {
          console.warn(`Failed to get Vizbee sessionState`);
        });
    };

    listenForSessionStatus();

    return () => {
      VizbeeManager.removeAllListeners("VZB_SESSION_STATUS");
    };
  }, []);

  return { isCasting, castingDevice, castingState };
};
