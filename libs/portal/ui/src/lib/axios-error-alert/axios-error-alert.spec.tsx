import { render } from '@redesignhealth/shared-utils-jest'

import AxiosErrorAlert from './axios-error-alert'

describe('ErrorBoundary', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AxiosErrorAlert error="error message" />)
    expect(baseElement).toBeTruthy()
  })
})
