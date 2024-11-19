import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export class InferError extends Error {
  status: StatusCodes;
  type: ReasonPhrases;

  constructor({
    status,
    type,
    message
  }: {
    status: StatusCodes;
    type: ReasonPhrases;
    message: string;
  }) {
    super(message);
    this.name = 'InferError';
    this.status = status;
    this.type = type;
  }
}

export class UnauthorizedError extends InferError {
  constructor() {
    super({
      status: StatusCodes.UNAUTHORIZED,
      type: ReasonPhrases.UNAUTHORIZED,
      message: 'Invalid API key'
    });
    this.name = 'UnauthorizedError';
  }
}

export class RateLimitError extends InferError {
  constructor() {
    super({
      status: StatusCodes.TOO_MANY_REQUESTS,
      type: ReasonPhrases.TOO_MANY_REQUESTS,
      message: 'Rate limit exceeded'
    });
    this.name = 'RateLimitError';
  }
}
