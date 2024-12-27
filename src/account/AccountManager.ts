// src/account/AccountManager.ts
import { Storage } from '../utils/Storage';
import { getDeviceId } from '../utils/DeviceUtils';
import { NetworkService } from '../utils/NetworkService';

export class AccountManager {
    private static LOG_TAG = 'AccountManager';
    private static BASE_URL = 'https://homesso.vizbee.tv/v1';
    private static MAX_RETRIES = 7;
    private static COMMAND_TIMEOUT = 8000;
    private static TOTAL_TIMEOUT = 20000;
    private static SIGN_IN_TOTAL_TIMEOUT = 120000; // 120 seconds for sign in

    /**
     * Sign in user with email and password
     */
    public static async signIn(email: string, password: string): Promise<string> {
        console.log(`${AccountManager.LOG_TAG}: In SignIn`);
        
        const url = `${AccountManager.BASE_URL}/signin`;
        console.log(`${AccountManager.LOG_TAG}: fetch url = ${url}`);

        const body = {
            email,
            pwd: password,
            deviceId: await getDeviceId()
        };

        const headers = {
            'Content-Type': 'application/json'
        };

        try {
            const response = await NetworkService.executeWithRetry(
                () => NetworkService.makeRequest(url, body, headers, AccountManager.COMMAND_TIMEOUT),
                NetworkService.defaultShouldRetry,
                AccountManager.MAX_RETRIES,
                AccountManager.COMMAND_TIMEOUT,
                AccountManager.SIGN_IN_TOTAL_TIMEOUT
            );

            const data = await response.json();
            if (!data.authToken) {
                throw new Error('Invalid auth token received from server');
            }
            return data.authToken;
        } catch (error) {
            console.log(
                `${AccountManager.LOG_TAG}: SignIn failed with error=`,
                error instanceof Error ? error.message : 'UNKNOWN'
            );
            throw error;
        }
    }

    /**
     * Updates the registration code status with exponential backoff retry logic
     */
    public static async updateRegCodeStatus(authToken: string): Promise<void> {
        console.log(`${AccountManager.LOG_TAG}: In RegCode update`);
        
        const regCode = await Storage.getRegCode();
        if (!regCode) {
            throw new Error('RegCode not found');
        }

        const url = `${AccountManager.BASE_URL}/accountregcode/${regCode}/status`;
        console.log(`${AccountManager.LOG_TAG}: fetch url = ${url}`);

        const body = {
            deviceId: await getDeviceId()
        };

        const headers = {
            'Authorization': authToken,
            'Content-Type': 'application/json'
        };

        try {
            await NetworkService.executeWithRetry(
                () => NetworkService.makeRequest(url, body, headers, AccountManager.COMMAND_TIMEOUT),
                NetworkService.defaultShouldRetry,
                AccountManager.MAX_RETRIES,
                AccountManager.COMMAND_TIMEOUT,
                AccountManager.TOTAL_TIMEOUT
            );
            console.log(`${AccountManager.LOG_TAG}: Update Reg code successful`);
        } catch (error) {
            console.log(
                `${AccountManager.LOG_TAG}: Update Reg code failed with error=`,
                error instanceof Error ? error.message : 'UNKNOWN'
            );
            throw error;
        }
    }

    /**
     * Sign out user - continues with local sign out even if server fails
     */
    public static async signOut(authToken: string): Promise<void> {
        console.log(`${AccountManager.LOG_TAG}: In sign out with auth token = ${authToken}`);
        
        const url = `${AccountManager.BASE_URL}/signout`;
        console.log(`${AccountManager.LOG_TAG}: fetch url = ${url}`);

        const headers = {
            'Authorization': authToken,
            'Content-Type': 'application/json'
        };

        const body = {
            deviceId: await getDeviceId()
        };

        try {
            await NetworkService.executeWithRetry(
                () => NetworkService.makeRequest(url, body, headers, AccountManager.COMMAND_TIMEOUT),
                AccountManager.shouldRetrySignOut,
                AccountManager.MAX_RETRIES,
                AccountManager.COMMAND_TIMEOUT,
                AccountManager.TOTAL_TIMEOUT
            );
            console.log(`${AccountManager.LOG_TAG}: Sign out successful`);
        } catch (error) {
            console.log(
                `${AccountManager.LOG_TAG}: Sign out failed with error=`,
                error instanceof Error ? error.message : 'UNKNOWN'
            );
            // Don't throw error for sign out to allow local sign out to proceed
        }
    }

    /**
     * Custom retry strategy for sign out
     */
    private static shouldRetrySignOut(error: Error): boolean {
        if (NetworkService.defaultShouldRetry(error)) {
            // Don't retry on 500 errors for signout
            return !error.message.includes('status: 500');
        }
        return false;
    }
}