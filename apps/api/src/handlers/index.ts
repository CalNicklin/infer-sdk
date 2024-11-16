import { Context } from 'hono'
import { env } from '../env'

export async function zeroShotHandler(c: Context) {
  try {
    const body = c.get('parsedBody') as {
      sequence: string
      labels: string[]
    }

    const response = await fetch(`${env.BART_WORKER_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.RUNPOD_API_KEY}`
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    return c.json(data)

  } catch (error) {
    console.error('Error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}
