# Infer SDK

The Infer SDK provides fast, type-safe access to ML inference in serverless environments. With a single API key, you get instant access to all supported ML capabilities without managing infrastructure or provisioning dedicated GPUs. Designed to bridge the gap between simple API services and dedicated ML infrastructure, Infer offers the speed and reliability of dedicated endpoints with the simplicity of a managed API service.

> **Current Status**: The SDK currently supports zero-shot classification, with more ML tasks coming soon including sentiment analysis, summarization i.e. transformers, sentence-transformers and diffusers tasks. All new capabilities will be instantly available to existing API keys.

### Why Use Infer?

- **Single API Key**: Access all ML capabilities through one API key - no need to provision separate endpoints
- **No Cold Starts**: Unlike traditional serverless ML deployments, Infer maintains warm instances for immediate inference
- **Full TypeScript Support**: Enjoy type safety and improved developer experience
- **Zero Setup**: No need to download models, configure ONNX runtime, or provision GPUs
- **Cost Effective**: Pay only for what you use, with no minimum costs and prices significantly lower than dedicated GPU endpoints
- **Serverless Ready**: Built specifically for serverless environments where downloading large models isn't practical
- **Auto-Scaling**: Automatic scaling without managing infrastructure or GPU instances

### Current Capabilities

- **Zero-Shot Classification**: Classify text into any categories without training
  - Content moderation
  - Topic detection
  - Custom classification tasks
  - Sentiment analysis
  - Instantly available with your API key

### Coming Soon

- ML Tasks
  - Sentiment analysis
  - Summarization
  - Question answering
  - Named entity recognition
  - More...

### Comparison with Alternatives

**Infer SDK**
- Cold Start Time: Instant
- Setup Required: None
- Cost: £0.001 per 1,000 tokens
- Rate Limits: High throughput
- Maintenance: None
- Access: Single API key for all ML operations
- Scaling: Automatic, shared infrastructure

**HuggingFace Inference API**
- Cold Start Time: 2-10 seconds
- Setup Required: API key only
- Cost: Free tier with strict rate limits
- Rate Limits: Low (higher for Pro users)
- Maintenance: None
- Access: Single API for all models
- Scaling: Limited by rate limits

**HuggingFace Inference Endpoints**
- Cold Start Time: 1-5 minutes
- Setup Required: Endpoint creation per model
- Cost: From $0.06/hour for CPU to $0.60/hour for GPU
- Rate Limits: Based on hardware
- Maintenance: None
- Access: Separate endpoint needed per model
- Scaling: Full autoscaling with dedicated resources

**Self-hosted Transformers.js**
- Cold Start Time: Varies by model size (5-60s)
- Setup Required: Model download & ONNX setup
- Cost: Varies based on hosting infrastructure
- Rate Limits: Self-managed
- Maintenance: Self-managed
- Access: Separate setup for each model
- Scaling: Manual scaling required

> **Note**: Infer provides a middle ground between HuggingFace's serverless API and dedicated endpoints. You get faster response times and higher rate limits than the Inference API, but without the complexity and cost of managing dedicated endpoints. Pay only for what you use, starting with 10,000 free tokens monthly.

## Getting Started

### 1. Creating an Account & Subscription

1. Click "Sign Up" in the navigation bar
2. Complete the registration process
3. You'll be redirected to the dashboard
4. Subscribe to get access to the API:
   - Click "Subscribe" in the dashboard
   - Enter your payment details (required for both free and paid usage)
   - You'll get 10,000 free tokens per month
   - Additional usage is billed at £0.001 per 1,000 tokens

### 2. Getting Your API Key

Once subscribed:
1. Go to the "API Key" tab in your dashboard
2. Click "Generate API Key"
3. Copy and securely store your API key
   - Note: API keys can't be viewed again after generation
   - You can generate new keys at any time

### 3. Installation

```bash
npm install @infer/node-sdk
```

### 4. Basic Usage

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

### 5. Error Handling

The SDK provides built-in error handling with specific error types:

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

  } else if (error instanceof InferError) {
    // Handle any other API errors

  }
}
```

#### Error Types

- `UnauthorizedError`
  - Description: Invalid API key
  - HTTP Status: 401
  - Error Code: 'unauthorized'

- `RateLimitError`
  - Description: Too many requests
  - HTTP Status: 429
  - Error Code: 'rate_limited'

- `ModelError`
  - Description: Model inference failed
  - HTTP Status: 502
  - Error Code: 'model_error'
  - Common causes: Model timeout, invalid input format

- `ServerError`
  - Description: Internal server error
  - HTTP Status: 500
  - Error Code: 'server_error'
  - Common causes: Infrastructure issues, unexpected server problems

- `InferError`
  - Description: Base error class for all Infer errors
  - Properties:
    - `message`: Human-readable error description
    - `code`: Machine-readable error code
    - `status`: HTTP status code

### 6. API Reference

#### ZeroShot Classification

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

The `zeroShot.classify` method accepts a `ZeroShotRequest` object and returns a promise that resolves to a `ZeroShotResponse`.

**Parameters:**
- `text`: The input text you want to classify
- `labels`: Array of possible classification labels

**Returns:**
- `labels`: Array of labels ordered by confidence
- `scores`: Corresponding confidence scores (0-1)

### 7. Dashboard Features

The dashboard provides several key features:

1. **API Usage Overview**
   - Real-time request volume tracking
   - Weekly usage graphs
   - Token consumption metrics

2. **API Key Management**
   - Generate new API keys
   - View and copy existing keys
   - Revoke compromised keys

3. **Billing Information**
   - Current usage
   - Billing cycle tracking
   - Payment method management

### 8. Pricing & Usage

#### Free Tier
All new accounts automatically receive:
- 10,000 tokens free per month
- Approximately 25 requests of 400 tokens each
- No credit card required

#### Paid Usage
After exceeding the free tier:
- £0.001 per 1,000 tokens
- Pay only for what you use beyond the free allocation

For detailed API specifications, see our [API Documentation](/api-reference).
