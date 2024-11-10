export class InferError extends Error {
    code;
    status;
    constructor({ code, message, status }) {
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
