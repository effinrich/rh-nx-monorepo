import { render } from '@redesignhealth/shared-utils-jest'

import { Square } from './square'

describe('Center', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Square />)
    expect(baseElement).toBeTruthy()
  })
})
