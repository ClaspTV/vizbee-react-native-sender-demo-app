// src/utils/NetworkService.ts

// Error codes enum
export const NetworkErrorCodes = {
    HTTP_4XX_ERROR: 'HTTP_4XX_ERROR'
} as const;

// Error interface
export interface NetworkError extends Error {
    code?: string;
}

export class NetworkService {
    private static LOG_TAG = 'NetworkService';

    /**
     * Makes an HTTP request with timeout handling
     */
    public static async makeRequest(
        url: string,
        body: object,
        headers: Record<string, string>,
        timeout: number
    ): Promise<Response> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            console.log(`${NetworkService.LOG_TAG}: Making request to url=${url}, body=${JSON.stringify(body)}, headers=${JSON.stringify(headers)}`);
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
                signal: controller.signal
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! status: ${response.status}`) as NetworkError;
                error.code = response.status >= 400 && response.status < 500 
                    ? NetworkErrorCodes.HTTP_4XX_ERROR 
                    : 'HTTP_ERROR';
                throw error;
            }

            return response;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    /**
     * Executes an operation with retry logic
     */
    public static async executeWithRetry<T>(
        operation: () => Promise<T>,
        shouldRetry: (error: Error) => boolean,
        maxRetries: number,
        timeout: number,
        totalTimeout: number
    ): Promise<T> {
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
                        `${NetworkService.LOG_TAG}: Retry attempt ${retryCount + 1} of ${maxRetries}, waiting ${delay}ms`
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

    /**
     * Default retry strategy for network requests
     */
    public static defaultShouldRetry(error: Error): boolean {
        console.log(`${NetworkService.LOG_TAG}: defaultShouldRetry received error=`, error);
        
        const networkError = error as NetworkError;
        return networkError.code !== NetworkErrorCodes.HTTP_4XX_ERROR;
    }
}