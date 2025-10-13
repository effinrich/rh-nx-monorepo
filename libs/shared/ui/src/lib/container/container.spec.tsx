import { render } from '@redesignhealth/shared-utils-jest'

import { Container } from './container'

describe('Container', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Container />)
    expect(baseElement).toBeTruthy()
  })
})
