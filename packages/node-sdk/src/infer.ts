import { ZeroShotRequest, type InferConfig, type ZeroShotResponse } from './types.js';
import { InferError, UnauthorizedError, RateLimitError, ModelError, ServerError } from './error.js';

class Infer {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: InferConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? 'https://infer-api.vercel.app/api/zero-shot';
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.ok) {
      return await response.json() as T;
    }

    const errorData = await response.json().catch(() => ({
      message: 'Unknown error occurred',
      code: 'unknown_error'
    })) as { message: string; code?: string };

    if (response.status === 401) {
      throw new UnauthorizedError();
    }

    if (response.status === 429) {
      throw new RateLimitError();
    }

    if (response.status === 502) {
      throw new ModelError(errorData.message);
    }

    if (response.status === 500) {
      throw new ServerError(errorData.message);
    }

    throw new InferError({
      code: errorData.code || 'unknown_error',
      message: errorData.message,
      status: response.status
    });
  }

  get zeroShot() {
    return {
      classify: async (
        request: ZeroShotRequest
      ): Promise<ZeroShotResponse> => {
        const response = await fetch(`${this.baseUrl}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            inputs: request.text,
            parameters: {
              candidate_labels: request.labels.join(', '),
            },
          }),
        });

        return this.handleResponse<ZeroShotResponse>(response);
      }
    };
  }
}

export default Infer