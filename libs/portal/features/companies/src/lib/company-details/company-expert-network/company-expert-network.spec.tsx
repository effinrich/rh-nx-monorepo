import { render, screen } from '@redesignhealth/shared-utils-jest'

import CompanyExpertNetwork from './company-expert-network'

describe('CompanyExpertNetwork', () => {
  it('renders heading information', () => {
    render(<CompanyExpertNetwork />)

    expect(
      screen.getByText(`Introducing the Expert Network`)
    ).toBeInTheDocument()
  })
})
