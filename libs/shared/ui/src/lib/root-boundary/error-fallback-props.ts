export interface ErrorFallbackProps {
  error: {
    name?: string
    statusText?: string
    status?: number
    message?: string
    data?: {
      message?: string
    }
    response?: Record<string, unknown>
  }

  statusText?: string
  message?: string
  status?: number
  data?: {
    message?: string
  }
  response?: Record<string, unknown>
}
