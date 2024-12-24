import {VizbeeHomeSSODelegate, VizbeeHomeSSOSignInInfo, VizbeeHomeSSOTVSignInStatus } from 'react-native-vizbee-homesso-sender-sdk';

import { storage } from './storage';
import { AccountManager } from './AccountManager';
import { NavigationService } from '../utils/NavigationService';

export class RNDemoAppVizbeeHomeSSODelegate implements VizbeeHomeSSODelegate {

    public async getSignedInInfo(): Promise<VizbeeHomeSSOSignInInfo[]> {
        try {
          console.log(`Getting signed-in info`);
          
          const authToken = await storage.getAuthToken();
          const testcase = await storage.getHomeSSOTestcase();
          
          const signInInfo: VizbeeHomeSSOSignInInfo = {
            signInType: 'MVPD',
            isSignedIn: Boolean(authToken),
            customData: { 'test-key1': 'test-val1' }
          };
    
          if (testcase === 'Start video and delay signin') {
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
    
          return [signInInfo];
        } catch (error) {
          console.error(`Error getting sign-in info:`, error);
          // Return a default state in case of error
          return [{
            signInType: 'MVPD',
            isSignedIn: false,
            customData: {}
          }];
        }
      }
    
      public async onReceiveTVSignInStatus(status: VizbeeHomeSSOTVSignInStatus): Promise<void> {
        try {
          console.log(`Received TV sign-in status:`, status);
    
          if (status.signInState === 'SIGN_IN_IN_PROGRESS' && status.signInType === 'MVPD') {
            const regCode = status.customData?.regcode;
    
            if (regCode) {
              await storage.setRegCode(regCode);
              const authToken = await storage.getAuthToken();
    
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
