import { fireEvent, render, screen } from '@redesignhealth/shared-utils-jest'

import AddCompanyButton from './add-company-button'

describe('AddCompanyButton', () => {
  it('shows options', () => {
    render(<AddCompanyButton />)
    fireEvent.click(screen.getByText('Add company'))
    expect(
      screen.getByText('RH company')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Marketplace company')
    ).toBeInTheDocument()
  })
})
