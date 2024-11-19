import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { zeroShotHandler } from './handlers/index.js'
import { authMiddleware } from './middleware/auth.js'
import { usageMiddleware } from './middleware/usage.js'
import { pinoLogger } from './middleware/pino-logger.js'

const app = new Hono()

app.use('*', cors({
  origin: '*', // Allow all origins
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  credentials: true,
  maxAge: 86400,
}))

app.onError((err, c) => {
  console.error(`${err}`);

  return c.json({
    success: false,
    error: {
      type: err.name || 'InternalError',
      message: err.message || 'An unexpected error occurred',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  }, err instanceof Error ? (err as any).status || 500 : 500);
})

app.get('/', (c) => {
  return c.json({ message: 'Hello, world!' })
})
app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})
app.use('/api/*', authMiddleware)
app.use('/api/*', usageMiddleware)
app.use(pinoLogger());

// Main inference endpoint
app.post('/api/zero-shot', zeroShotHandler)

export { app }
