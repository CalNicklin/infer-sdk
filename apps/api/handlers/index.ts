import { Context } from 'hono'

export async function handle(c: Context) {
  try {
    const body = await c.req.json()
    
    // Forward request to RunPod
    const response = await fetch(process.env.RUNPOD_ENDPOINT!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RUNPOD_API_KEY}`
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
