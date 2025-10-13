import { Meta } from '@storybook/react'

import { ErrorFallback } from './error-fallback'

export default {
  component: ErrorFallback,
  title: 'Components / Feedback / ErrorFallback'
} as Meta<typeof ErrorFallback>

export const ErrorWithMessage = {
  args: {
    error: { message: 'error message' }
  }
}
