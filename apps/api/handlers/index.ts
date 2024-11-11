import { Context } from 'hono'
import { env } from '../env'

export async function handle(c: Context) {
  try {
    const body = await c.req.json() as {
      sequence: string
      labels: string[]
    }
    
    // Forward request to RunPod
    const response = await fetch(`https://api.runpod.ai/v2/${env.RUNPOD_ENDPOINT_ID}/runsync`, {
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
