import { render } from '@redesignhealth/shared-utils-jest'

import ErrorFallback from './error-fallback'

describe('ErrorBoundary', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ErrorFallback error={{ message: 'error message' }} />
    )
    expect(baseElement).toBeTruthy()
  })
})
