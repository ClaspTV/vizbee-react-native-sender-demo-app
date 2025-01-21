import { Alert } from "react-native";
import {
    VizbeeEvent,
    VizbeeEventHandler,
    VizbeeEventManager,
    VizbeeManager,
    //@ts-ignore
} from "react-native-vizbee-sender-sdk";

export class MobileToTVMessager implements VizbeeEventHandler {
    private readonly logTag = 'MobileToTVMessager';
    public readonly kEventName = 'com.vizbee.demo';
    private productId = 0;
    private eventManager: VizbeeEventManager;
    private messageListener?: (event: VizbeeEvent) => void;

    constructor() {
        this.eventManager = new VizbeeEventManager();
    }

    listenForTVConnectionState(): void {
        console.debug(this.logTag, 'Listen for connection');
        
        VizbeeManager.addListener(
            "VZB_SESSION_STATUS",
            this.handleSessionStatusChange
          );
    }

    private handleSessionStatusChange = (sessionStatus: any) => {
        const currentState = sessionStatus?.connectionState;
    
        if (currentState === "CONNECTED") {
          this.handleConnectedState();
        } else {
          console.debug(this.logTag, `connection state: ${currentState}`);
        }
    };
    
    private handleConnectedState(): void {
        console.debug(this.logTag, 'Mobile is now connected to the TV.');
        this.eventManager.registerForEvent(this.kEventName, this);

        this.send(
            this.kEventName,
            this.getMessage()
        );
    }

    async isConnectedToTV(): Promise<boolean> {
        const state = await VizbeeManager.getSessionState();
        return state === 'CONNECTED';
    }

    send(eventName: string, data: Record<string, any>): void {
        console.debug(
            this.logTag,
            `Sending event '${eventName}' with data: ${JSON.stringify(data)}`
        );

        const event = new VizbeeEvent(eventName, data);
        this.eventManager.sendEvent(event);
    }

    getMessage(): Record<string, any> {
        this.productId += 1;
        return {
            message: {
                productId: this.productId
            }
        };
    }

    onEvent(event: VizbeeEvent): void {
        console.debug(this.logTag, `Received event: ${JSON.stringify(event)}`);
        setTimeout(() => {
            Alert.alert(
                'Message Received', 
                `event: ${JSON.stringify(event)}`
            );
        }, 3000);
        
    }
}