import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta } from '@storybook/react-vite'

import { CeoProfileDetailsPage } from './ceo-profile-details-page'

const Story: Meta<typeof CeoProfileDetailsPage> = {
  component: CeoProfileDetailsPage,
  title: 'pages/CEO Profile Details',
  decorators: [withRouter],

  args: {
    name: 'Jerry Smith',
    email: 'jsmith@sidebycare.com',
    location: 'Denver/Boulder Area',
    biography:
      'Lorem ipsum dolor sit amet consectetur. Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero. Risus pretium scelerisque egestas in. \n\nViverra adipiscing hendrerit magna a a odio ac. Tempor habitant ante et sit. Odio consectetur feugiat in penatibus posuere. Luctus nulla eget adipiscing ut. Vestibulum in gravida sit metus elementum faucibus. Elementum dui vulputate porttitor diam quam risus justo.',
    company: {
      href: 'www.google.com',
      name: 'SideBy Care'
    },
    companyFundraiseStatus: 'Series A',
    customerSegments: [
      'Health Plan',
      'Health Systems',
      'Physician/Provider Practices',
      'Consumer',
      'Employer'
    ],
    linkedInProfileHref: 'www.linkedin.com/profile',
    companyDescription:
      'Lorem ipsum dolor sit amet consectetur. Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero. Risus pretium scelerisque egestas in. Viverra adipiscing hendrerit magna a a odio ac. Tempor habitant ante et sit. Odio consectetur feugiat in penatibus posuere. Luctus nulla eget adipiscing ut. Vestibulum in gravida sit metus elementum faucibus. Elementum dui vulputate porttitor diam quam risus justo.',
    healthcareSector: 'Chronic Care Management',
    businessFocusArea: [
      'Medicare',
      'Medicare Advantage',
      'Senior Health Insurance'
    ],
    marketServiceArea: ['Massachusetts', 'New York', 'California'],
    businessType: 'B2B',
    additionalInfo:
      'About me: Lorem ipsum dolor sit amet consectetur. Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero. Risus pretium scelerisque egestas in. Viverra adipiscing hendrerit magna a a odio ac. \n\nTempor habitant ante et sit. Odio consectetur feugiat in penatibus posuere. Luctus nulla eget adipiscing ut. Vestibulum in gravida sit metus elementum faucibus. Elementum dui vulputate porttitor diam quam risus justo.'
  }
}

export default Story

export const SameProfileCompanyUser = {
  args: {
    isSameUser: true,
    isOptIn: true,
    currentRole: 'ROLE_OP_CO_USER'
  }
}

export const DifferentProfileCompanyUser = {
  args: {
    isSameUser: false,
    isOptIn: true,
    currentRole: 'ROLE_OP_CO_USER'
  }
}

export const AdminUserWithOptInCEO = {
  args: {
    isSameUser: false,
    isOptIn: true,
    currentRole: 'ROLE_RH_ADMIN'
  }
}

export const AdminUserWithOptOutCEO = {
  args: {
    isSameUser: false,
    isOptIn: false,
    currentRole: 'ROLE_RH_ADMIN'
  }
}

export const RHUserWithOptInCEO = {
  args: {
    isSameUser: false,
    isOptIn: true,
    currentRole: 'ROLE_RH_USER'
  }
}

export const RHUserWithOptOutCEO = {
  args: {
    isSameUser: false,
    isOptIn: false,
    currentRole: 'ROLE_RH_USER'
  }
}
