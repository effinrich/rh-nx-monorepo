import { render } from '@redesignhealth/shared-utils-jest'

import { Image } from './image'

describe('Image', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Image />)
    expect(baseElement).toBeTruthy()
  })
})
