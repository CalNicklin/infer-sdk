import { Context } from 'hono'
import { env } from '../env.js'
import {
  type ZeroShotRequest,
  type ZeroShotResponse,
  type ZeroShotRunPodResponse,
  type APIErrorResponse,
  ZeroShotRunPodError,
  ZeroShotRunPodOutput
} from '@infer/node-sdk'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { StatusCode } from 'hono/utils/http-status'

export async function zeroShotHandler(c: Context) {
  try {
    // Validate auth first
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return createErrorResponse(c, {
        status: StatusCodes.UNAUTHORIZED,
        type: ReasonPhrases.UNAUTHORIZED,
        message: 'Invalid API key'
      })
    }

    const sdkBody = await c.req.json() as ZeroShotRequest

    // Validate request body
    if (!sdkBody.inputs || !sdkBody.parameters?.candidate_labels) {
      return createErrorResponse(c, {
        status: StatusCodes.BAD_REQUEST,
        type: ReasonPhrases.BAD_REQUEST,
        message: 'Missing required fields'
      })
    }

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

    const runpodResponse = await response.json() as ZeroShotRunPodResponse

    if (runpodResponse.status === 'FAILED') {
      console.error('RunPod error:', runpodResponse)
      return createErrorResponse(c, {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        type: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: (runpodResponse as ZeroShotRunPodError).error || 'Model inference failed'
      })
    }

    const successResponse: ZeroShotResponse = {
      labels: (runpodResponse as ZeroShotRunPodOutput).output.data.labels,
      scores: (runpodResponse as ZeroShotRunPodOutput).output.data.scores,
      metadata: {
        latency: (runpodResponse as ZeroShotRunPodOutput).executionTime + (runpodResponse as ZeroShotRunPodOutput).delayTime,
        tokenCount: c.get('inputTokens')
      }
    }

    return c.json(successResponse)

  } catch (error) {
    console.error('Error:', error)
    return createErrorResponse(c, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      type: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: error instanceof Error ? error.message : 'Internal server error'
    })
  }
}

// Helper function to create consistent error responses
function createErrorResponse(
  c: Context,
  {
    status,
    type,
    message
  }: {
    status: StatusCodes;
    type: ReasonPhrases;
    message: string
  }
) {
  const errorResponse: APIErrorResponse = {
    name: 'InferError',
    status,
    type,
    message
  }
  return c.json(errorResponse, status as StatusCode)
}
