import { useState, useEffect, useRef } from "react";
// @ts-ignore
import { VizbeeManager } from "react-native-vizbee-sender-sdk";

export const useVizbeeSession = () => {
  const [isCasting, setIsCasting] = useState(false);
  const [castingDevice, setCastingDevice] = useState("");
  const [castingState, setCastingState] = useState("");

  const previousSessionStateRef = useRef<string | null>(null);
  const listenerRef = useRef<any>(null);

  const handleSessionStatusChange = (sessionStatus: any) => {
    const currentState = sessionStatus?.connectionState;

    if (currentState === previousSessionStateRef.current) {
      return;
    }

    previousSessionStateRef.current = currentState;
    setCastingState(currentState);
    if (currentState === "CONNECTED") {
      VizbeeManager.getSessionConnectedDevice()
        .then((connectedDeviceInfo: any) => {
          setIsCasting(true);
          setCastingDevice(
            connectedDeviceInfo?.connectedDeviceFriendlyName || "TV"
          );
        })
        .catch(() => {
          console.warn(`Failed to get connected receiver info`);
          setIsCasting(true);
          setCastingDevice("TV");
        });
    } else {
      setIsCasting(false);
      setCastingDevice("");
    }
  };

  useEffect(() => {
    const setupListener = async () => {
      if (!listenerRef.current) {
        listenerRef.current = VizbeeManager.addListener(
          "VZB_SESSION_STATUS",
          handleSessionStatusChange
        );
      }

      try {
        const sessionState = await VizbeeManager.getSessionState();
        handleSessionStatusChange({ connectionState: sessionState });
      } catch (error) {
        console.warn(`Failed to get Vizbee sessionState`, error);
      }
    };

    setupListener();

    return () => {
      if (listenerRef.current) {
        VizbeeManager.removeListener("VZB_SESSION_STATUS", listenerRef.current);
        listenerRef.current = null;
      }
    };
  }, []);

  return { isCasting, castingDevice, castingState };
};
