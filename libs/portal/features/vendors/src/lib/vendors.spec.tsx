import { mocks, render, screen } from '@redesignhealth/shared-utils-jest'

import Vendors from './vendors'

describe('Vendors', () => {
  mocks.matchMedia('any', false)
  it('should render successfully', () => {
    render(<Vendors />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})
