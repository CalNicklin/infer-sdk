# API Reference

## Infer Class

The main class for interacting with the Infer SDK.

### Constructor

```typescript
new Infer(config: InferConfig)
```

#### Parameters

- `config.apiKey` (string, required) - Your API key for authentication
- `config.baseUrl` (string, optional) - Custom API endpoint URL

### Methods

#### zeroShot.classify()

Performs zero-shot classification on text.

```typescript
zeroShot.classify(
  text: string,
  labels: string[],
  options?: ZeroShotOptions
): Promise<ZeroShotResponse>
```

#### Parameters

- `text` (string, required) - The text to classify
- `labels` (string[], required) - Array of possible classification labels
- `options` (object, optional)
  - `multiLabel` (boolean) - Enable multi-label classification
  - `temperature` (number) - Model temperature (0-1)

#### Returns

Returns a Promise that resolves to a `ZeroShotResponse`:

```typescript
interface ZeroShotResponse {
  labels: string[];    // Ordered list of labels
  scores: number[];    // Corresponding confidence scores
  metadata?: {
    latency?: number;    // Processing time in ms
    tokenCount?: number; // Number of tokens processed
  };
}
```
