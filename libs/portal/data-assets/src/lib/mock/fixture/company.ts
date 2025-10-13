import { CompanySummary } from '../../companies'

export const mockRhOpCoCompany: CompanySummary = {
  name: 'Ever/Body',
  id: '6aBCde12',
  number: 3,
  legalName: 'Ever/Body, Inc.',
  description:
    'Ever/Body was founded to demystify cosmetic dermatology and make it more accessible.',
  members: [],
  created: '2023-11-01T19:08:36.284Z',
  lastModified: '2023-11-01T19:08:36.284Z',
  stage: 'OP_CO',
  status: 'ACTIVE',
  taxonomy: [
    {
      value: 'CARE_DELIVERY',
      displayName: 'Care Delivery',
      level: 1
    }
  ],
  fundraiseStatus: {
    displayName: 'Series A',
    value: 'SERIES_A'
  },
  href: 'https://example.com',
  dashboardHref: 'https://example.com',
  hasPlatformAgreement: true,
  links: []
}

export const mockRhThemeCompany: CompanySummary = {
  name: 'Ever/Body',
  id: '6aBCde12',
  legalName: 'Ever/Body, Inc.',
  description:
    'Ever/Body was founded to demystify cosmetic dermatology and make it more accessible.',
  created: '2023-11-01T19:08:36.284Z',
  lastModified: '2023-11-01T19:08:36.284Z',
  stage: 'THEME',
  status: 'ACTIVE',
  hasPlatformAgreement: true,
  links: []
}

export const mockMarketplaceSellerCompany: CompanySummary = {
  name: 'Ever/Body',
  id: '6aBCde12',
  legalName: 'Ever/Body, Inc.',
  description:
    'Ever/Body was founded to demystify cosmetic dermatology and make it more accessible.',
  created: '2023-11-01T19:08:36.284Z',
  lastModified: '2023-11-01T19:08:36.284Z',
  stage: 'THEME',
  status: 'ACTIVE',
  hasPlatformAgreement: true,
  activityType: {
    displayName: 'Enterprise Seller',
    value: 'ENTERPRISE_SELLER'
  },
  links: []
}

export const mockMarketplaceBuyerCompany: CompanySummary = {
  name: 'Ever/Body',
  id: '6aBCde12',
  legalName: 'Ever/Body, Inc.',
  description:
    'Ever/Body was founded to demystify cosmetic dermatology and make it more accessible.',
  created: '2023-11-01T19:08:36.284Z',
  lastModified: '2023-11-01T19:08:36.284Z',
  stage: 'THEME',
  status: 'ACTIVE',
  hasPlatformAgreement: true,
  activityType: {
    displayName: 'Enterprise Buyer',
    value: 'ENTERPRISE_BUYER'
  },
  links: []
}
