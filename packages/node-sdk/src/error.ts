export class InferError extends Error {
  code: string;
  status: number;

  constructor({ code, message, status }: { code: string; message: string; status: number }) {
    super(message);
    this.name = 'InferError';
    this.code = code;
    this.status = status;
  }
}

export class UnauthorizedError extends InferError {
  constructor() {
    super({
      code: 'unauthorized',
      message: 'Invalid API key',
      status: 401
    });
  }
}

export class RateLimitError extends InferError {
  constructor() {
    super({
      code: 'rate_limited',
      message: 'Rate limit exceeded',
      status: 429
    });
  }
}

export class ModelError extends InferError {
  constructor(message: string = 'Model inference failed') {
    super({
      code: 'model_error',
      message,
      status: 502
    });
  }
}

export class ServerError extends InferError {
  constructor(message: string = 'Internal server error') {
    super({
      code: 'server_error',
      message,
      status: 500
    });
  }
}
