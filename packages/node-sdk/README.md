# Infer SDK

The Infer SDK provides fast, type-safe access to ML inference in serverless environments. With a single API key, you get instant access to all supported ML capabilities without managing infrastructure or provisioning dedicated GPUs.

> **Current Status**: The SDK currently supports zero-shot classification, with more ML tasks coming soon including sentiment analysis, summarization i.e. transformers, sentence-transformers and diffusers tasks. All new capabilities will be instantly available to existing API keys.

## Why Use Infer?

- **Single API Key**: Access all ML capabilities through one API key - no need to provision separate endpoints
- **No Cold Starts**: Unlike traditional serverless ML deployments, Infer maintains warm instances for immediate inference
- **Full TypeScript Support**: Enjoy type safety and improved developer experience
- **Zero Setup**: No need to download models, configure ONNX runtime, or provision GPUs
- **Cost Effective**: Pay only for what you use, with no minimum costs
- **Serverless Ready**: Built specifically for serverless environments where downloading large models isn't practical

## Installation

```bash
npm install @infer/node-sdk
```

## Quick Start

```typescript
import Infer from '@infer/node-sdk';

const infer = new Infer({
  apiKey: 'your-api-key'
});

const result = await infer.zeroShot.classify({
  text: "I love this product!",
  labels: ['positive', 'negative']
});
```

## Error Handling

```typescript
import Infer, { 
  UnauthorizedError, 
  RateLimitError, 
  ModelError,
  ServerError 
} from '@infer/node-sdk';

try {
  const result = await infer.zeroShot.classify(text, labels);
} catch (error) {
  if (error instanceof UnauthorizedError) {
    // Handle invalid API key
  } else if (error instanceof RateLimitError) {
    // Handle rate limiting
  } else if (error instanceof ModelError) {
    // Handle model inference failures
  } else if (error instanceof ServerError) {
    // Handle internal server errors
  }
}
```

### Error Types

| Error Class | Description | HTTP Status | Common Causes |
|-------------|-------------|-------------|---------------|
| `UnauthorizedError` | Invalid API key | 401 | Invalid/expired key |
| `RateLimitError` | Too many requests | 429 | Exceeded rate limits |
| `ModelError` | Model inference failed | 502 | Invalid input format |
| `ServerError` | Internal server error | 500 | Infrastructure issues |

## API Reference

### Zero-Shot Classification

```typescript
interface ZeroShotRequest {
  text: string;    // The input text to classify
  labels: string[]; // Array of possible classification labels
}

interface ZeroShotResponse {
  labels: string[]; // Ordered list of labels
  scores: number[]; // Corresponding confidence scores
}

// Example usage
const result = await infer.zeroShot.classify({
  text: "I love this product!",
  labels: ["positive", "negative"]
});
```

## Pricing

- **Free Tier**: 10,000 tokens free per month
- **Paid Usage**: $0.001 per 1000 tokens after free tier

For detailed documentation and examples, visit our [Documentation](https://infer.com/docs).

## License

MIT