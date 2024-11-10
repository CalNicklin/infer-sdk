import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnauthorizedError } from '../error.js';
import Infer from '../index.js';

describe('Infer SDK', () => {
  let infer: Infer;

  beforeEach(() => {
    infer = new Infer({ apiKey: 'test-key' });
  });

  describe('zeroShot', () => {
    it('successfully classifies text', async () => {
      const mockResponse = {
        labels: ['positive', 'negative'],
        scores: [0.8, 0.2]
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await infer.zeroShot.classify(
        'I love this!',
        ['positive', 'negative']
      );

      expect(result).toEqual(mockResponse);
    });

    it('handles unauthorized errors', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 401
      });

      await expect(
        infer.zeroShot.classify('test', ['positive'])
      ).rejects.toThrow(UnauthorizedError);
    });
  });
});
