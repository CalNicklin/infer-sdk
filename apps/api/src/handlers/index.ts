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

    const runpodBody = {
      input: {
        sequence: sdkBody.inputs,
        labels: sdkBody.parameters.candidate_labels.split(',').map(l => l.trim())
      }
    }

    const response = await fetch(`${env.BART_WORKER_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.RUNPOD_API_KEY}`
      },
      body: JSON.stringify(runpodBody)
    })

    const data = await response.json()

    console.log('RunPod response:', JSON.stringify(data, null, 2))

    return c.json(data)

  } catch (error) {
    console.error('Error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}
