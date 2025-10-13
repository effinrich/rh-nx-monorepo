import { fireEvent, render, screen } from '@redesignhealth/shared-utils-jest'
import { within } from '@testing-library/react'

import { CeoCard } from './ceo-card'

describe('CeoCard', () => {
  describe('with CEO Company user', () => {
    const currentRole = 'ROLE_OP_CO_USER'
    describe('Opt-in view', () => {
      it('displays fields', () => {
        render(
          <CeoCard
            id="12345"
            ceoGivenName="Jane"
            ceoFamilyName="Doe"
            ceoEmail="jane.doe@example.com"
            location="Boston"
            company={{
              name: 'Avalanche',
              fundraiseStatus: { displayName: 'Series C', value: 'SERIES_C' }
            }}
            customerSegments={[
              { displayName: 'Health plan', value: 'HEALTH_PLAN' }
            ]}
            healthcareSector={{
              displayName: 'Pediatrics',
              value: 'PEDIATRICS'
            }}
            businessFocusArea={[
              { displayName: 'Cancer Care', value: 'CANCER_CARE' }
            ]}
            isCeoOptOut={false}
            currentRole={currentRole}
          />
        )

        expect(screen.getByText('Jane Doe')).toBeInTheDocument()
        expect(
          screen.getByRole('link', { name: 'jane.doe@example.com' })
        ).toBeInTheDocument()
        expect(
          screen.getByRole('link', { name: 'View profile' })
        ).toBeInTheDocument()
        expect(screen.getByText('Boston')).toBeInTheDocument()
        const [
          company,
          stage,
          customerSegment,
          healthcareSector,
          businessFocusArea
        ] = screen.getAllByRole('listitem')
        expect(within(company).getByText('Avalanche')).toBeInTheDocument()
        expect(within(stage).getByText('Series C')).toBeInTheDocument()
        expect(
          within(customerSegment).getByText('Health plan')
        ).toBeInTheDocument()
        expect(
          within(healthcareSector).getByText('Pediatrics')
        ).toBeInTheDocument()
        expect(
          within(businessFocusArea).getByText('Cancer Care')
        ).toBeInTheDocument()

        expect(
          screen.queryByLabelText('CEO opt-out icon')
        ).not.toBeInTheDocument()
      })
    })
    describe('Opt-out view', () => {
      it('removes email link, adds profile restricted', () => {
        render(
          <CeoCard
            id="12345"
            ceoGivenName="Jane"
            ceoFamilyName="Doe"
            ceoEmail="jane.doe@example.com"
            isCeoOptOut
            currentRole="ROLE_RH_ADMIN"
          />
        )
        expect(
          screen.queryByRole('link', { name: 'jane.doe@example.com' })
        ).not.toBeInTheDocument()
        expect(screen.getByText('Profile restricted')).toBeInTheDocument()
        expect(
          screen.queryByRole('link', { name: 'View profile' })
        ).not.toBeInTheDocument()
      })
    })
  })

  describe('with SuperAdmin, Admin, or RH User', () => {
    const currentRoleList = [
      'ROLE_SUPER_ADMIN',
      'ROLE_RH_ADMIN',
      'ROLE_RH_USER'
    ] as const
    const visibilityIconLabel = 'CEO opt-out icon'
    const visibilityTooltipText = 'CEO opt-out, profile not externally visible'

    describe('Opt-out CEO', () => {
      it.each(currentRoleList)(
        'shows visibility off icon and shows tooltip upon hover',
        async currentRole => {
          render(
            <CeoCard
              id="12345"
              ceoGivenName="Jane"
              ceoFamilyName="Doe"
              ceoEmail="jane.doe@example.com"
              isCeoOptOut={false}
              currentRole={currentRole}
              visible="OPT_OUT"
            />
          )
          fireEvent.pointerOver(screen.getByLabelText(visibilityIconLabel))
          expect(
            await screen.findByText(visibilityTooltipText)
          ).toBeInTheDocument()
          expect(screen.getByLabelText(visibilityIconLabel)).toBeInTheDocument()
        }
      )
    })

    describe('Opt-in CEO', () => {
      it.each(currentRoleList)(
        'does not show visibility off icon',
        currentRole => {
          render(
            <CeoCard
              id="12345"
              ceoGivenName="Jane"
              ceoFamilyName="Doe"
              ceoEmail="jane.doe@example.com"
              isCeoOptOut
              currentRole={currentRole}
              visible="OPT_IN"
            />
          )

          expect(
            screen.queryByLabelText(visibilityIconLabel)
          ).not.toBeInTheDocument()
        }
      )
    })

    describe('Not Decided Opt CEO', () => {
      it.each(currentRoleList)('shows visibility off icon', currentRole => {
        render(
          <CeoCard
            id="12345"
            ceoGivenName="Jane"
            ceoFamilyName="Doe"
            ceoEmail="jane.doe@example.com"
            currentRole={currentRole}
          />
        )
        expect(screen.getByLabelText(visibilityIconLabel)).toBeInTheDocument()
      })
    })
  })
})
