import { render } from '@redesignhealth/shared-utils-jest'

import { Stack } from './stack'

describe('Stack', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Stack />)
    expect(baseElement).toBeTruthy()
  })
})
