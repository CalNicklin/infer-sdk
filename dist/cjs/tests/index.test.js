"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const error_1 = require("../error");
const index_1 = require("../index");
(0, vitest_1.describe)('Infer SDK', () => {
    let infer;
    (0, vitest_1.beforeEach)(() => {
        infer = new index_1.default({ apiKey: 'test-key' });
    });
    (0, vitest_1.describe)('zeroShot', () => {
        (0, vitest_1.it)('successfully classifies text', async () => {
            const mockResponse = {
                labels: ['positive', 'negative'],
                scores: [0.8, 0.2]
            };
            global.fetch = vitest_1.vi.fn().mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            });
            const result = await infer.zeroShot.classify('I love this!', ['positive', 'negative']);
            (0, vitest_1.expect)(result).toEqual(mockResponse);
        });
        (0, vitest_1.it)('handles unauthorized errors', async () => {
            global.fetch = vitest_1.vi.fn().mockResolvedValueOnce({
                ok: false,
                status: 401
            });
            await (0, vitest_1.expect)(infer.zeroShot.classify('test', ['positive'])).rejects.toThrow(error_1.UnauthorizedError);
        });
    });
});
