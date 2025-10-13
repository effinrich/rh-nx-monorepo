import { Roles } from './roles'

// export const isAdminRole = (role: string) => /admin/gi.test(role)

/**
 * TODO: We need to implement the roles check like the following and replace the regex
 */
export const isAdminRole = (role?: string) => {
  return role === Roles.RhAdmin || role === Roles.SuperAdmin
}

export const isSuperAdminRole = (role: string) => /super/gi.test(role)

/**
 * Within a company, members have different roles. These
 * roles are implicit based on the type of company they are
 * a part of.
 *
 */
export type CompanyMemberRole =
  | 'MARKETPLACE_BUYER'
  | 'MARKETPLACE_SELLER'
  | 'INTERNAL'

export const getCompanyMemberRole = (
  companies: { activityType?: { value: string } }[] | undefined
): CompanyMemberRole => {
  const rolesFound: CompanyMemberRole[] = []
  if (
    companies?.some(
      company => company.activityType?.value === 'ENTERPRISE_BUYER'
    )
  ) {
    rolesFound.push('MARKETPLACE_BUYER')
  }

  if (
    companies?.some(
      company => company.activityType?.value === 'ENTERPRISE_SELLER'
    )
  ) {
    rolesFound.push('MARKETPLACE_SELLER')
  }

  if (rolesFound.length > 1) {
    throw new Error('A user cannot be both an enterprise buyer and a seller')
  }

  return rolesFound[0] || 'INTERNAL'
}
