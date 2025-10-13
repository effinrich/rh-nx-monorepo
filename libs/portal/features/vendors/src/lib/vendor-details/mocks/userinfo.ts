import { UserInfoSummary } from '@redesignhealth/portal/data-assets'

export const adminUser: UserInfoSummary = {
  email: 'jane.doe@example.com',
  role: { authority: 'ROLE_RH_ADMIN', displayName: 'Admin' },
  ceoInfo: { id: '', ceo: false }
}

export const companyUser: UserInfoSummary = {
  email: 'jane.doe@example.com',
  role: { authority: 'ROLE_OP_CO_USER', displayName: 'OpCo User' },
  ceoInfo: { id: '', ceo: false }
}
