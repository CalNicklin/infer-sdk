# Error Handling Guide

## Error Types

The SDK provides several error classes to help you handle different types of errors:

### UnauthorizedError

Thrown when the API key is invalid or missing.

```typescript
try {
  await infer.zeroShot.classify(text, labels);
} catch (error) {
  if (error instanceof UnauthorizedError) {
    // Handle invalid API key
    console.error('Please check your API key');
  }
}
```
### RateLimitError

Thrown when you've exceeded your API rate limits.

```typescript
try {
  await infer.zeroShot.classify(text, labels);
} catch (error) {
  if (error instanceof RateLimitError) {
    // Handle rate limiting
    console.error('You have exceeded your API rate limit');
  }
}
```
### InferError

Thrown for generic errors.

```typescript
interface InferErrorDetails {
  code: string;    // Error code
  message: string; // Human-readable message
  status: number;  // HTTP status code
}
```

## Best Practices

1. Always wrap API calls in try/catch blocks
2. Check for specific error types
Implement retry logic for rate limits
3. Log errors with their full context

## Example Error Handler

```typescript
async function handleInferError(error: unknown) {
  if (error instanceof UnauthorizedError) {
    // Handle auth errors
    return { success: false, error: 'Invalid API key' };
  }
  
  if (error instanceof RateLimitError) {
    // Handle rate limiting
    return { success: false, error: 'Too many requests' };
  }
  
  if (error instanceof InferError) {
    // Handle known API errors
    return { success: false, error: error.message };
  }
  
  // Handle unknown errors
  console.error('Unknown error:', error);
  return { success: false, error: 'An unexpected error occurred' };
}
```
