import { render } from '@redesignhealth/shared-utils-jest'

import { Heading } from './heading'

describe('Center', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Heading />)
    expect(baseElement).toBeTruthy()
  })
})
