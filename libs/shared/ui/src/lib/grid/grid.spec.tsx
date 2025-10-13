import { render } from '@redesignhealth/shared-utils-jest'

import { Grid } from './grid'

describe('Grid', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Grid />)
    expect(baseElement).toBeTruthy()
  })
})
