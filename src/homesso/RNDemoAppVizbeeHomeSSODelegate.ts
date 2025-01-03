import {VizbeeHomeSSODelegate, VizbeeHomeSSOSignInInfo, VizbeeHomeSSOSignInState, VizbeeHomeSSOTVSignInStatus } from 'react-native-vizbee-homesso-sender-sdk';

import { Storage } from '../utils/Storage';
import { AccountManager } from '../account/AccountManager';
import { NavigationService } from '../utils/NavigationService';

export class RNDemoAppVizbeeHomeSSODelegate implements VizbeeHomeSSODelegate {

    // public async getSignedInInfo(): Promise<VizbeeHomeSSOSignInInfo[]> {
    //     try {
    //       console.log(`Getting signed-in info`);
          
    //       const authToken = await Storage.getAuthToken();
          
    //       const signInInfo: VizbeeHomeSSOSignInInfo = {
    //         signInType: 'MVPD',
    //         isSignedIn: Boolean(authToken),
    //         customData: { 'test-key1': 'test-val1' }
    //       };
    
    //       return [signInInfo];
    //     } catch (error) {
    //       console.error(`Error getting sign-in info:`, error);
    //       // Return a default state in case of error
    //       return [{
    //         signInType: 'MVPD',
    //         isSignedIn: false,
    //         customData: {}
    //       }];
    //     }
    //   }

    public getSignedInInfo(): Promise<VizbeeHomeSSOSignInInfo[]> {
      return new Promise((resolve, reject) => {
          try {
              // Fetch current authentication state
              console.log(`Getting signed-in info`);
              Storage.getAuthToken()
                  .then(authToken => {
                      // Create sign-in information
                      console.log(`Creating signed-in info`);
                      const signInInfo: VizbeeHomeSSOSignInInfo = {
                          signInType: 'MVPD',
                          isSignedIn: Boolean(authToken),
                          customData: { 'test-key1': 'test-val1', 'test-key2': 'test-val2' }
                      };
                      
                      console.log(`Returning signed-in info:`, signInInfo);
                      resolve([signInInfo]);
                  })
                  .catch(error => {
                      console.error('Failed to get auth token:', error);
                      reject(error);
                  });
          } catch (error) {
              console.error('Error in getSignedInInfo:', error);
              reject(error);
          }
      });
    }
    
    public async onReceiveTVSignInStatus(status: VizbeeHomeSSOTVSignInStatus): Promise<void> {
      try {
        console.log(`Received TV sign-in status:`, status);
  
        console.log(`VizbeeHomeSSOSignInState.IN_PROGRESS:`, VizbeeHomeSSOSignInState.IN_PROGRESS);
        if (status.signInState === VizbeeHomeSSOSignInState.IN_PROGRESS && status.signInType === 'MVPD') {
          const regCode = status.customData?.regcode;
  
          if (regCode) {
            await Storage.setRegCode(regCode);
            const authToken = await Storage.getAuthToken();
  
            if (!authToken) {
              NavigationService.navigate('Login', { isFromTVSignIn: true });
            } else {
              await AccountManager.updateRegCodeStatus(authToken);
            }
          } else {
            console.log(`TV sign-in status received with empty RegCode`);
          }
        }
      } catch (error) {
        console.error(`Error handling TV sign-in status:`, error);
      }
    }
}
