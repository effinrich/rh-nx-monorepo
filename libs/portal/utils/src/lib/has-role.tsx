/**
 * Type alias for user roles.
 */
type Role =
  | 'ROLE_SUPER_ADMIN'
  | 'ROLE_RH_ADMIN'
  | 'ROLE_RH_USER'
  | 'ROLE_OP_CO_USER'
  | 'ROLE_OP_CO_CONTRACTOR'
interface HasRoleProps {
  allowed: Array<Role>
  children: React.ReactElement
  currentRole?: Role
}

/**
 * Hide components when a user does not have one of the "allowed roles"
 */
export const HasRole = ({ allowed, currentRole, children }: HasRoleProps) => {
  if (currentRole && allowed.includes(currentRole)) {
    return children
  }
  return null
}

export const hasRoleMatch = (allowedRoles: Array<Role>, role?: Role) => {
  return !!(role && allowedRoles.includes(role))
}
