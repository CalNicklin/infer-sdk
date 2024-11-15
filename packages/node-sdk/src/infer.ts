import { type InferConfig, type ZeroShotResponse, type ZeroShotOptions } from './types.js';
import { InferError, UnauthorizedError, RateLimitError } from './error.js';

class Infer {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: InferConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? 'https://api.infer-sdk.ai';
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.ok) {
      return await response.json() as T;
    }

    if (response.status === 401) {
      throw new UnauthorizedError();
    }

    if (response.status === 429) {
      throw new RateLimitError();
    }

    const error = await response.json().catch(() => ({
      message: 'Unknown error occurred'
    })) as { message: string }

    throw new InferError({
      code: 'server_error',
      message: error.message,
      status: response.status
    });
  }

  get zeroShot() {
    return {
      classify: async (
        text: string,
        labels: string[],
        options: ZeroShotOptions = {}
      ): Promise<ZeroShotResponse> => {
        const response = await fetch(`${this.baseUrl}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
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

export default Infer