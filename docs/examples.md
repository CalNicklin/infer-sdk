# Usage Examples

## Basic Classification

```typescript
import Infer from 'infer';

const infer = new Infer({
  apiKey: 'your-api-key'
});

// Simple sentiment analysis
const sentiment = await infer.zeroShot.classify(
  "I love this product, it's amazing!",
  ['positive', 'negative', 'neutral']
);

console.log(sentiment);
// {
//   labels: ['positive', 'neutral', 'negative'],
//   scores: [0.92, 0.05, 0.03]
// }
```

## Multi-Label Classification

```typescript
// Classify text into multiple categories
const categories = await infer.zeroShot.classify(
  "This movie is both funny and sad, with great special effects",
  ['comedy', 'drama', 'action', 'sci-fi'],
  { multiLabel: true }
);

console.log(categories);
// {
//   labels: ['comedy', 'drama', 'sci-fi', 'action'],
//   scores: [0.85, 0.82, 0.45, 0.12]
// }
```

## Error Handling

```typescript
import Infer, { UnauthorizedError, RateLimitError } from 'infer';

async function classifyWithRetry(text: string, labels: string[]) {
  const maxRetries = 3;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      return await infer.zeroShot.classify(text, labels);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error; // Don't retry auth errors
      }
      if (error instanceof RateLimitError) {
        attempts++;
        if (attempts === maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        continue;
      }
      throw error;
    }
  }
}
```

Using with TypeScript

```typescript
import Infer, { ZeroShotResponse, ZeroShotOptions } from 'infer';

async function analyzeText(
  text: string,
  options: ZeroShotOptions = {}
): Promise<ZeroShotResponse> {
  const infer = new Infer({
    apiKey: process.env.INFER_API_KEY!
  });

  return infer.zeroShot.classify(
    text,
    ['positive', 'negative'],
    options
  );
}
```

Using in Express.js

```typescript
import express from 'express';
import Infer from 'infer';

const app = express();
const infer = new Infer({
  apiKey: process.env.INFER_API_KEY
});

app.post('/analyze', async (req, res) => {
  try {
    const { text, labels } = req.body;
    const result = await infer.zeroShot.classify(text, labels);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
```

Using in Next.js API Route

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import Infer from 'infer';

const infer = new Infer({
  apiKey: process.env.INFER_API_KEY!
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, labels } = req.body;
    const result = await infer.zeroShot.classify(text, labels);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
```
