export interface InferConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface ZeroShotRequest {
  text: string;
  labels: string[];
}

export interface ZeroShotResponse {
  labels: string[];
  scores: number[];
  metadata?: {
    latency?: number;
    tokenCount?: number;
  };
}

// Error types
export type ErrorCode =
  | 'unauthorized'
  | 'rate_limited'
  | 'invalid_request'
  | 'server_error';

export interface InferErrorDetails {
  code: ErrorCode;
  message: string;
  status: number;
}
