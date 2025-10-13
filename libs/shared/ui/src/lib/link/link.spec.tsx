import { render } from '@redesignhealth/shared-utils-jest'

import { Link } from './link'

describe('Link', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Link />)
    expect(baseElement).toBeTruthy()
  })
})
