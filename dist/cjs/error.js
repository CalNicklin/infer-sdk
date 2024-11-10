"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitError = exports.UnauthorizedError = exports.InferError = void 0;
class InferError extends Error {
    code;
    status;
    constructor({ code, message, status }) {
        super(message);
        this.name = 'InferError';
        this.code = code;
        this.status = status;
    }
}
exports.InferError = InferError;
class UnauthorizedError extends InferError {
    constructor() {
        super({
            code: 'unauthorized',
            message: 'Invalid API key',
            status: 401
        });
    }
}
exports.UnauthorizedError = UnauthorizedError;
class RateLimitError extends InferError {
    constructor() {
        super({
            code: 'rate_limited',
            message: 'Rate limit exceeded',
            status: 429
        });
    }
}
exports.RateLimitError = RateLimitError;
