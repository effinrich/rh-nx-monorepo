import { render } from '@redesignhealth/shared-utils-jest'

import { LinkBox } from './link-overlay'

describe('LinkBox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LinkBox />)
    expect(baseElement).toBeTruthy()
  })
})
