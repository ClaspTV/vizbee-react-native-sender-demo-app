import { Storage } from '../utils/Storage';
import { getDeviceId } from '../utils/DeviceUtils';

// Error codes enum
export const VizbeeErrorCodes = {
    HTTP_4XX_ERROR: 'HTTP_4XX_ERROR'
} as const;

// Error interface
interface VizbeeError extends Error {
    code?: string;
}

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
            const response = await AccountManager.executeWithRetry(
                () => AccountManager.makeRequest(url, body, headers),
                AccountManager.shouldRetry,
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
            await AccountManager.executeWithRetry(
                () => AccountManager.makeRequest(url, body, headers),
                AccountManager.shouldRetry,
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
            await AccountManager.executeWithRetry(
                () => AccountManager.makeRequest(url, body, headers),
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

    private static async makeRequest(
        url: string,
        body: object,
        headers: Record<string, string>
    ): Promise<Response> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), AccountManager.COMMAND_TIMEOUT);

        try {
            console.log(`${AccountManager.LOG_TAG}: Making request to url=${url}, body=${JSON.stringify(body)}, headers=${JSON.stringify(headers)}`);
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
                signal: controller.signal
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! status: ${response.status}`) as VizbeeError;
                error.code = response.status >= 400 && response.status < 500 
                    ? VizbeeErrorCodes.HTTP_4XX_ERROR 
                    : 'HTTP_ERROR';
                throw error;
            }

            return response;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    private static shouldRetry(error: Error): boolean {
        console.log(`${AccountManager.LOG_TAG}: shouldRetry received error=`, error);
        
        const vizbeeError = error as VizbeeError;
        if (vizbeeError.code === VizbeeErrorCodes.HTTP_4XX_ERROR) {
            return false;
        }
        return true;
    }

    private static shouldRetrySignOut(error: Error): boolean {
        console.log(`${AccountManager.LOG_TAG}: shouldRetrySignOut received error=`, error);
        
        const vizbeeError = error as VizbeeError;
        if (vizbeeError.code === VizbeeErrorCodes.HTTP_4XX_ERROR) {
            return false;
        }
        // Don't retry on 500 errors for signout
        if (error.message.includes('status: 500')) {
            return false;
        }
        return true;
    }

    private static async executeWithRetry(
        operation: () => Promise<any>,
        shouldRetry: (error: Error) => boolean,
        maxRetries: number,
        timeout: number,
        totalTimeout: number
    ): Promise<any> {
        const startTime = Date.now();
        let retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                if (Date.now() - startTime > totalTimeout) {
                    throw new Error('Total timeout exceeded');
                }

                return await operation();
            } catch (error) {
                if (error instanceof Error) {
                    if (!shouldRetry(error) || retryCount === maxRetries - 1) {
                        throw error;
                    }

                    const delay = Math.min(
                        1000 * Math.pow(2, retryCount), 
                        totalTimeout - (Date.now() - startTime)
                    );
                    
                    if (delay <= 0) {
                        throw new Error('Total timeout exceeded during retry delay');
                    }

                    console.log(
                        `${AccountManager.LOG_TAG}: Retry attempt ${retryCount + 1} of ${maxRetries}, waiting ${delay}ms`
                    );
                    await new Promise(resolve => setTimeout(resolve, delay));
                    retryCount++;
                } else {
                    throw error;
                }
            }
        }

        throw new Error('Max retries exceeded');
    }
}