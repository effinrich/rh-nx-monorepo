import { render } from '@redesignhealth/shared-utils-jest'

import { Tag } from './tag'

describe('Tag', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Tag />)
    expect(baseElement).toBeTruthy()
  })
})
