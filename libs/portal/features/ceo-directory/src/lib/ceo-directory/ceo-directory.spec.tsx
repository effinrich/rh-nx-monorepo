import { render, screen } from '@redesignhealth/shared-utils-jest'

import CeoDirectory from './ceo-directory'

describe('CeoDirectory', () => {
  it('should render successfully', () => {
    render(<CeoDirectory />)
    expect(screen.getByText('CEO Directory')).toBeInTheDocument()
  })
})
