import { Context } from 'hono'
import { env } from '../env'

interface SDKRequest {
  inputs: string
  parameters: {
    candidate_labels: string
  }
}

export async function zeroShotHandler(c: Context) {
  try {
    const sdkBody = await c.req.json() as SDKRequest

    // Transform SDK format to BART format
    const bartBody = {
      sequence: sdkBody.inputs,
      labels: sdkBody.parameters.candidate_labels.split(',').map(l => l.trim())  // Convert back to array
    }

    const response = await fetch(`${env.BART_WORKER_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.RUNPOD_API_KEY}`
      },
      body: JSON.stringify(bartBody)
    })

    const data = await response.json()
    return c.json(data)

  } catch (error) {
    console.error('Error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}
