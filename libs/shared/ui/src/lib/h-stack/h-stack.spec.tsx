import { render } from '@redesignhealth/shared-utils-jest'

import { HStack } from './h-stack'

describe('Stack', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HStack />)
    expect(baseElement).toBeTruthy()
  })
})
