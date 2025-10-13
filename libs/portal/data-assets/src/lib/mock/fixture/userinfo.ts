import { UserInfoSummary } from '../../types'

import {
  mockMarketplaceBuyerCompany,
  mockMarketplaceSellerCompany
} from './company'

export const mockSuperAdminUser: UserInfoSummary = {
  email: 'sazh.katzroy@redesignhealth.com',
  givenName: 'Sazh',
  familyName: 'Katzroy',
  role: {
    authority: 'ROLE_SUPER_ADMIN',
    displayName: 'Super Admin'
  },
  memberOf: [],
  created: '2023-11-01T19:12:59.535Z',
  lastModified: '2023-11-01T19:12:59.535Z',
  ceoInfo: {
    id: '',
    ceo: false
  },
  picture: 'https://example.com/image.jpeg'
}

export const mockAdminUser: UserInfoSummary = {
  email: 'sazh.katzroy@redesignhealth.com',
  givenName: 'Sazh',
  familyName: 'Katzroy',
  role: {
    authority: 'ROLE_RH_ADMIN',
    displayName: 'RH Admin'
  },
  memberOf: [],
  created: '2023-11-01T19:12:59.535Z',
  lastModified: '2023-11-01T19:12:59.535Z',
  ceoInfo: {
    id: '',
    ceo: false
  },
  picture: 'https://example.com/image.jpeg'
}

export const mockRhUser: UserInfoSummary = {
  email: 'sazh.katzroy@redesignhealth.com',
  givenName: 'Sazh',
  familyName: 'Katzroy',
  role: {
    authority: 'ROLE_RH_USER',
    displayName: 'RH user'
  },
  memberOf: [],
  created: '2023-11-01T19:12:59.535Z',
  lastModified: '2023-11-01T19:12:59.535Z',
  ceoInfo: {
    id: '',
    ceo: false
  },
  picture: 'https://example.com/image.jpeg'
}

export const mockCompanyUser: UserInfoSummary = {
  email: 'sazh.katzroy@redesignhealth.com',
  givenName: 'Sazh',
  familyName: 'Katzroy',
  role: {
    authority: 'ROLE_OP_CO_USER',
    displayName: 'Company user'
  },
  memberOf: [],
  created: '2023-11-01T19:12:59.535Z',
  lastModified: '2023-11-01T19:12:59.535Z',
  ceoInfo: {
    id: '',
    ceo: false
  },
  picture: 'https://example.com/image.jpeg'
}

export const mockCEOCompanyUser: UserInfoSummary = {
  email: 'sazh.katzroy@redesignhealth.com',
  givenName: 'Sazh',
  familyName: 'Katzroy',
  role: {
    authority: 'ROLE_OP_CO_USER',
    displayName: 'Company user'
  },
  memberOf: [],
  created: '2023-11-01T19:12:59.535Z',
  lastModified: '2023-11-01T19:12:59.535Z',
  ceoInfo: {
    id: '6nuT80li',
    ceo: true
  },
  picture: 'https://example.com/image.jpeg'
}

export const mockEnterpriseBuyerUser: UserInfoSummary = {
  email: 'sazh.katzroy@redesignhealth.com',
  givenName: 'Sazh',
  familyName: 'Katzroy',
  role: {
    authority: 'ROLE_OP_CO_USER',
    displayName: 'Company user'
  },
  memberOf: [mockMarketplaceBuyerCompany],
  created: '2023-11-01T19:12:59.535Z',
  lastModified: '2023-11-01T19:12:59.535Z',
  ceoInfo: {
    id: '6nuT80li',
    ceo: true
  },
  picture: 'https://example.com/image.jpeg'
}

export const mockEnterpriseSellerUser: UserInfoSummary = {
  email: 'sazh.katzroy@redesignhealth.com',
  givenName: 'Sazh',
  familyName: 'Katzroy',
  role: {
    authority: 'ROLE_OP_CO_USER',
    displayName: 'Company user'
  },
  memberOf: [mockMarketplaceSellerCompany],
  created: '2023-11-01T19:12:59.535Z',
  lastModified: '2023-11-01T19:12:59.535Z',
  ceoInfo: {
    id: '6nuT80li',
    ceo: true
  },
  picture: 'https://example.com/image.jpeg'
}

export const mockInvalidEnterpriseBuyerAndSellerUser: UserInfoSummary = {
  email: 'sazh.katzroy@redesignhealth.com',
  givenName: 'Sazh',
  familyName: 'Katzroy',
  role: {
    authority: 'ROLE_OP_CO_USER',
    displayName: 'Company user'
  },
  memberOf: [mockMarketplaceBuyerCompany, mockMarketplaceSellerCompany],
  created: '2023-11-01T19:12:59.535Z',
  lastModified: '2023-11-01T19:12:59.535Z',
  ceoInfo: {
    id: '6nuT80li',
    ceo: true
  },
  picture: 'https://example.com/image.jpeg'
}
