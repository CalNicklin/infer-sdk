# Infer

A powerful, type-safe SDK for ML inference operations.

## Installation

```bash
npm install infer
```
## Quick Start

```typescript
import Infer from 'infer';

const infer = new Infer({ apiKey: 'your-api-key' });

const result = await infer.zeroShot.classify(
"I love this product!",
['positive', 'negative']
);

```
## Features

- 🚀 Zero-shot classification
- 💪 Full TypeScript support
- 🔒 Built-in error handling
- ⚡️ Modern ESM and CommonJS support

## Documentation

- [API Reference](./docs/api.md)
- [Error Handling](./docs/errors.md)
- [Examples](./docs/examples.md)


## API Reference

### Configuration

```typescript
const infer = new Infer({
apiKey: 'your-api-key',
baseUrl?: 'https://custom-endpoint.com' // Optional
});
```

### Zero-Shot Classification

```typescript
// Basic usage
const result = await infer.zeroShot.classify(
text: string,
labels: string[]
);
// With options
const result = await infer.zeroShot.classify(
text: string,
labels: string[],
options: ZeroShotOptions
);
```

### Error Handling

```typescript
import { UnauthorizedError, RateLimitError } from 'infer';
try {
const result = await infer.zeroShot.classify(text, labels);
} catch (error) {
if (error instanceof UnauthorizedError) {
// Handle authentication error
} else if (error instanceof RateLimitError) {
// Handle rate limiting
}
}
``` 

## Error Types

| Error Class | Description | HTTP Status |
|-------------|-------------|-------------|
| `UnauthorizedError` | Invalid API key | 401 |
| `RateLimitError` | Too many requests | 429 |
| `InferError` | Generic error | Various |

## TypeScript Support

Full type definitions included:
```typescript
import type { ZeroShotResponse, ZeroShotOptions } from 'infer';

const options: ZeroShotOptions = {
multiLabel: true,
};

```


## License

MIT