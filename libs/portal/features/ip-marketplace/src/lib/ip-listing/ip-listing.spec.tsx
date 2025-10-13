import { mocks, render } from '@redesignhealth/shared-utils-jest'

import IpListing from './ip-listing'

describe('IpListing', () => {
  mocks.matchMedia('any', false)
  it('should render successfully', () => {
    const { baseElement } = render(<IpListing />)
    expect(baseElement).toBeTruthy()
  })
})
