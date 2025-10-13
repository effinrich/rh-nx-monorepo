import { CompanyVendor } from '../../vendors'

export const mockCompanyVendor: CompanyVendor = {
  id: '1KlMnh9a',
  name: 'Apple, Inc.',
  startDate: '2024-01-03T20:37:26.482Z',
  endDate: '2024-01-03T20:37:26.482Z',
  engagementStatus: {
    displayName: 'Active',
    value: 'ACTIVE'
  },
  subcategories: [
    {
      category: {
        apiId: 'Lf0ED5AA',
        name: 'Infrastructure'
      },
      apiId: 'Zn17uxiy',
      name: 'Admin Tools'
    }
  ],
  contacts: [
    {
      email: 'sazh.katzroy@redesignhealth.com',
      givenName: 'Sazh',
      familyName: 'Katzroy',
      willingToDiscuss: true
    }
  ]
}
