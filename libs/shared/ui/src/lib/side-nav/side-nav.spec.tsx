import { mocks, render } from '@redesignhealth/shared-utils-jest'

import { SideNav } from './side-nav'

describe('SideNav', () => {
  mocks.matchMedia('any', false)
  it('should render successfully', () => {
    const { baseElement } = render(<SideNav />)
    expect(baseElement).toBeTruthy()
  })
})
