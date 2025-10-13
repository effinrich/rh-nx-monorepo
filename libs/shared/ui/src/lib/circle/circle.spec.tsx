import { render } from '@redesignhealth/shared-utils-jest'

import { Circle } from './circle'

describe('Center', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Circle />)
    expect(baseElement).toBeTruthy()
  })
})
