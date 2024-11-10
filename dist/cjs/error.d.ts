export declare class InferError extends Error {
    code: string;
    status: number;
    constructor({ code, message, status }: {
        code: string;
        message: string;
        status: number;
    });
}
export declare class UnauthorizedError extends InferError {
    constructor();
}
export declare class RateLimitError extends InferError {
    constructor();
}
//# sourceMappingURL=error.d.ts.map