import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export * from './runpod.js'

// SDK types
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
}

export interface ZeroShotRequest {
  inputs: string;
  parameters: {
    candidate_labels: string;
  };
}

export interface APIErrorResponse {
  name: string;
  status: StatusCodes;
  type: ReasonPhrases;
  message: string;
}
