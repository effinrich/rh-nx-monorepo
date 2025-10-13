import { render } from '@redesignhealth/shared-utils-jest'

import SectionHeader from './section-header'

describe('SectionHeader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SectionHeader title="welcome" />)
    expect(baseElement).toBeTruthy()
  })
})
