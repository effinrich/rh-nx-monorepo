import { render } from '@redesignhealth/shared-utils-jest'

import { Stat } from './stat'

describe('Center', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Stat />)
    expect(baseElement).toBeTruthy()
  })
})
