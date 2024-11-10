interface InferConfig {
    apiKey: string;
    baseUrl?: string;
}
interface ZeroShotResponse {
    labels: string[];
    scores: number[];
    metadata?: {
        latency?: number;
        tokenCount?: number;
    };
}
interface ZeroShotOptions {
    multiLabel?: boolean;
    temperature?: number;
}
type ErrorCode = 'unauthorized' | 'rate_limited' | 'invalid_request' | 'server_error';
interface InferErrorDetails {
    code: ErrorCode;
    message: string;
    status: number;
}

declare class Infer {
    private apiKey;
    private baseUrl;
    constructor(config: InferConfig);
    private handleResponse;
    get zeroShot(): {
        classify: (text: string, labels: string[], options?: ZeroShotOptions) => Promise<ZeroShotResponse>;
    };
}

declare class InferError extends Error {
    code: string;
    status: number;
    constructor({ code, message, status }: {
        code: string;
        message: string;
        status: number;
    });
}
declare class UnauthorizedError extends InferError {
    constructor();
}
declare class RateLimitError extends InferError {
    constructor();
}

export { type ErrorCode, type InferConfig, InferError, type InferErrorDetails, RateLimitError, UnauthorizedError, type ZeroShotOptions, type ZeroShotResponse, Infer as default };
