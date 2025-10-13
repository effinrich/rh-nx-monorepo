import { render } from '@redesignhealth/shared-utils-jest'

import { ShadowBox } from './shadow-box'

describe('ShadowBox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ShadowBox />)
    expect(baseElement).toBeTruthy()
  })
})
