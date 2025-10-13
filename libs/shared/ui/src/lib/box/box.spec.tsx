import { render } from '@redesignhealth/shared-utils-jest'

import { Box } from './box'

describe('Box', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Box />)
    expect(baseElement).toBeTruthy()
  })
})
