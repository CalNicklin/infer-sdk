import type {
  EndpointCompletedOutput,
  EndpointIncompleteOutput
} from 'runpod-sdk'

// Extend RunPod's base types
export interface ZeroShotRunPodOutput extends EndpointCompletedOutput {
  output: {
    status: 'success'
    data: {
      labels: string[]
      scores: number[]
      sequence: string
    }
  }
}

export interface ZeroShotRunPodError extends EndpointIncompleteOutput {
  status: 'FAILED'
  error: string
  output: {
    status: 'error'
  }
}

export type ZeroShotRunPodResponse = ZeroShotRunPodOutput | ZeroShotRunPodError
