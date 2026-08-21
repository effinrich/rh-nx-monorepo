import { render } from '@redesignhealth/shared-utils-jest'

import { StatRoot } from './stat'

describe('Stat', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StatRoot />)
    expect(baseElement).toBeTruthy()
  })
})
