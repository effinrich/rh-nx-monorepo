import { render, screen } from '@redesignhealth/shared-utils-jest'
import { within } from '@testing-library/react'

import CeoProfileDetailsPage from './ceo-profile-details-page'

describe('Ceo Profile Details Page', () => {
  describe('Same Company User', () => {
    const currentRole = 'ROLE_OP_CO_USER'
    it('renders edit profile when same user', () => {
      render(
        <CeoProfileDetailsPage
          name="Jane Doe"
          isSameUser
          currentRole={currentRole}
        />
      )
      expect(screen.getByLabelText('Edit profile')).toBeInTheDocument()
    })
    it('shows opt-in choice', () => {
      render(
        <CeoProfileDetailsPage
          name="Jane Doe"
          isSameUser
          currentRole={currentRole}
          isOptIn
        />
      )
      expect(screen.getByText(/Yes, I want to/))
    })

    it('shows opt-out choice', () => {
      render(
        <CeoProfileDetailsPage
          name="Jane Doe"
          isSameUser
          currentRole={currentRole}
          isOptIn={false}
        />
      )
      expect(screen.getByText(/No, I do not want to/))
    })
  })

  describe('Admin or Super Admin', () => {
    it('renders edit profile for admins', () => {
      render(
        <CeoProfileDetailsPage
          name="Jane Doe"
          isSameUser={false}
          currentRole="ROLE_RH_ADMIN"
        />
      )
      expect(screen.getByLabelText('Edit profile')).toBeInTheDocument()
    })
  })

  it('renders details', () => {
    render(
      <CeoProfileDetailsPage
        name="Jane Doe"
        location="Boston"
        email="jane.doe@example.com"
        isSameUser
        company={{ name: 'Company A' }}
        companyFundraiseStatus="Series A"
        businessType="D2C"
        customerSegments={['Health systems']}
        healthcareSector="Pediatrics"
        businessFocusArea={['Cancer Care']}
        marketServiceArea={['California']}
        linkedInProfileHref="https://example.com"
        biography="Details"
        additionalInfo="Additional Info"
      />
    )
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Boston')).toBeInTheDocument()
    expect(screen.getByText('jane.doe@example.com')).toBeInTheDocument()

    const [
      company,
      fundraisingStage,
      businessType,
      customerSegment,
      healthcareSector,
      businessFocusArea,
      marketServiceArea,
      linkedInProfileHref,
      additionalInfo,
      bio
    ] = screen.getAllByRole('listitem')

    expect(within(company).getByText('Company A')).toBeInTheDocument()
    expect(within(fundraisingStage).getByText('Series A')).toBeInTheDocument()
    expect(within(businessType).getByText('D2C')).toBeInTheDocument()
    expect(
      within(customerSegment).getByText('Health systems')
    ).toBeInTheDocument()
    expect(within(healthcareSector).getByText('Pediatrics')).toBeInTheDocument()
    expect(
      within(businessFocusArea).getByText('Cancer Care')
    ).toBeInTheDocument()
    expect(
      within(marketServiceArea).getByText('California')
    ).toBeInTheDocument()
    expect(
      within(linkedInProfileHref).getByRole('link', {
        name: 'https://example.com'
      })
    ).toBeInTheDocument()
    expect(
      within(additionalInfo).getByText('Additional Info')
    ).toBeInTheDocument()
    expect(within(bio).getByText('Details')).toBeInTheDocument()
  })
})
