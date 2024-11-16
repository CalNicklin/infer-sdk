import { Context } from 'hono'
import { env } from '../env'

interface SDKRequest {
  inputs: string
  parameters: {
    candidate_labels: string
  }
}

interface RunPodResponse {
  status: 'COMPLETED' | 'FAILED'
  id: string
  output: {
    status: 'success' | 'error'
    data?: {
      labels: string[]
      scores: number[]
      sequence: string
    }
    error?: string
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

    const runpodResponse = await response.json() as RunPodResponse

    if (runpodResponse.status === 'FAILED' || runpodResponse.output.status === 'error') {
      console.error('RunPod error:', runpodResponse)
      return c.json({
        error: 'Model inference failed',
        details: runpodResponse.output.error
      }, 502)
    }

    return c.json({
      labels: runpodResponse.output.data?.labels || [],
      scores: runpodResponse.output.data?.scores || []
    })

  } catch (error) {
    console.error('Error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}
