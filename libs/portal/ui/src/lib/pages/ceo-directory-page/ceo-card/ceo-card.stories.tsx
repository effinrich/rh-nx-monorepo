import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta } from '@storybook/react'

import { CeoCard } from './ceo-card'

const Story: Meta<typeof CeoCard> = {
  component: CeoCard,
  title: 'Components / CeoCard',
  decorators: [withRouter],
  args: {
    ceoGivenName: 'Tifa',
    ceoFamilyName: 'Lockhart',
    ceoEmail: 'tifa.lockhart@avalanche.org',
    ceoPictureHref:
      'https://assets.redesignhealth.com/oRn0Y8FtND62hxJVw6bDWMLHI9SmyhDNyWB9WRxD/FF7_-_Tifa_Portrait.webp',
    location: 'Sector 7',
    company: {
      name: 'Avalanche',
      href: 'https://example.com',
      description: 'Information about Avalanche',
      fundraiseStatus: {
        displayName: 'Series B',
        value: 'SERIES_B'
      }
    },
    healthcareSector: {
      displayName: 'Care Enablement',
      value: 'CARE_ENABLEMENT'
    },
    customerSegments: [
      {
        displayName: 'Health Systems',
        value: 'HEALTH_SYSTEMS'
      }
    ],
    businessFocusArea: [
      {
        displayName: 'Cancer Care',
        value: 'CANCER_CARE'
      }
    ],
    id: 'abcedf'
  }
}

export default Story

export const CompanyUserWithOwnCEOOptIn = {
  args: {
    isCeoOptOut: false,
    currentRole: 'ROLE_OP_CO_USER'
  }
}

export const CompanyUserWithOwnCEOOptOut = {
  args: {
    isCeoOptOut: true,
    currentRole: 'ROLE_OP_CO_USER'
  }
}

export const AdminWithOptOutCEO = {
  args: {
    isCeoOptOut: false,
    currentRole: 'ROLE_RH_ADMIN',
    visible: 'OPT_OUT'
  }
}

export const AdminWithOptInCEO = {
  args: {
    isCeoOptOut: false,
    currentRole: 'ROLE_RH_ADMIN',
    visible: 'OPT_IN'
  }
}

export const AdminWithNotSelectedOptCEO = {
  args: {
    isCeoOptOut: false,
    currentRole: 'ROLE_RH_ADMIN'
  }
}
