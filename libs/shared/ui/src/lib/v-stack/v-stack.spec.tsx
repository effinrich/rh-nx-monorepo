import { render } from '@redesignhealth/shared-utils-jest'

import { VStack } from './v-stack'

describe('Stack', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<VStack />)
    expect(baseElement).toBeTruthy()
  })
})
