import {
  type InferConfig,
  type ZeroShotResponse,
  type ZeroShotOptions,
  type APIErrorResponse
} from './types/types.js';
import { InferError, UnauthorizedError, RateLimitError } from './error.js';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

class Infer {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: InferConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? 'https://infer-api.vercel.app/api/zero-shot';
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json().catch(() => ({
      name: 'InferError',
      status: response.status,
      type: 'server_error',
      message: 'Failed to parse response'
    })) as T | APIErrorResponse;

    // Check if response is an error
    if (!response.ok) {
      const error = data as APIErrorResponse;

      switch (error.status) {
        case 401:
          throw new UnauthorizedError();
        case 429:
          throw new RateLimitError();
        default:
          throw new InferError({
            status: error.status,
            type: error.type,
            message: error.message
          });
      }
    }

    return data as T;
  }

  get zeroShot() {
    return {
      classify: async (
        text: string,
        labels: string[],
        options: ZeroShotOptions = {}
      ): Promise<ZeroShotResponse> => {
        if (!text || !labels.length) {
          throw new InferError({
            status: StatusCodes.BAD_REQUEST,
            type: ReasonPhrases.BAD_REQUEST,
            message: 'Text and labels are required'
          });
        }

        const response = await fetch(`${this.baseUrl}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            inputs: text,
            parameters: {
              candidate_labels: labels.join(', '),
              ...options
            },
          }),
        });

        return this.handleResponse<ZeroShotResponse>(response);
      }
    };
  }
}

export default Infer;