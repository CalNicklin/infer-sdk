import { Hono } from 'hono'
import { handle } from './handlers'
import { authMiddleware } from './middleware/auth'
import { usageMiddleware } from './middleware/usage'

const app = new Hono()

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }))

// Protected routes
app.use('/api/*', authMiddleware)
app.use('/api/*', usageMiddleware)

// Main inference endpoint
app.post('/api/zero-shot', handle)

export default app
