"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("./error");
class Infer {
    apiKey;
    baseUrl;
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl ?? 'https://api.infer.ai';
    }
    async handleResponse(response) {
        if (response.ok) {
            return await response.json();
        }
        if (response.status === 401) {
            throw new error_1.UnauthorizedError();
        }
        if (response.status === 429) {
            throw new error_1.RateLimitError();
        }
        const error = await response.json().catch(() => ({
            message: 'Unknown error occurred'
        }));
        throw new error_1.InferError({
            code: 'server_error',
            message: error.message,
            status: response.status
        });
    }
    get zeroShot() {
        return {
            classify: async (text, labels, options = {}) => {
                const response = await fetch(`${this.baseUrl}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`,
                    },
                    body: JSON.stringify({
                        text,
                        labels,
                        ...options
                    }),
                });
                return this.handleResponse(response);
            }
        };
    }
}
exports.default = Infer;
