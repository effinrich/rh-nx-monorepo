import { render } from '@redesignhealth/shared-utils-jest'

import { Support } from './support'

describe('Support', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Support />)
    expect(baseElement).toBeTruthy()
  })
})
