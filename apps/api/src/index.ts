import { Hono } from 'hono'
import { handle } from './handlers/index'
import { authMiddleware } from './middleware/auth'
import { usageMiddleware } from './middleware/usage'
import { pinoLogger } from './middleware/pino-logger'

const app = new Hono()

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }))

// Protected routes
app.use('/api/*', authMiddleware)
app.use('/api/*', usageMiddleware)
app.use(pinoLogger());

// Main inference endpoint
app.post('/api/zero-shot', handle)
app.get('/', (c) => c.json({ message: 'Hello, world!' }))

export default app
