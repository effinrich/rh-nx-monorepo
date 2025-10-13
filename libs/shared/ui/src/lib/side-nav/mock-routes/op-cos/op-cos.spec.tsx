import { mocks, render } from '@redesignhealth/shared-utils-jest'

import OpCos from './op-cos'

describe('OpCos', () => {
  mocks.matchMedia('any', false)
  it('should render successfully', () => {
    const { baseElement } = render(<OpCos />)
    expect(baseElement).toBeTruthy()
  })
})
