export interface InferConfig {
    apiKey: string;
    baseUrl?: string;
}
export interface ZeroShotResponse {
    labels: string[];
    scores: number[];
    metadata?: {
        latency?: number;
        tokenCount?: number;
    };
}
export interface ZeroShotOptions {
    multiLabel?: boolean;
    temperature?: number;
}
export type ErrorCode = 'unauthorized' | 'rate_limited' | 'invalid_request' | 'server_error';
export interface InferErrorDetails {
    code: ErrorCode;
    message: string;
    status: number;
}
//# sourceMappingURL=types.d.ts.map