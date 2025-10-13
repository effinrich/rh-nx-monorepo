import { z } from 'zod'

export const paramsSchema = z
  .object({
    page: z.coerce.number().gte(0),
    size: z.coerce.number().gt(0),
    modal: z.enum(['add-user', 'edit-user']).nullish(),
    email: z.string().email().nullish()
  })
  .refine(
    data => {
      if (data.modal !== 'edit-user') return true
      return Boolean(data.email)
    },
    { message: 'User email must be provided if you want to edit user details.' }
  )

export const USER_TYPE_OPTIONS = [
  {
    value: 'ROLE_SUPER_ADMIN',
    label: 'Super Admin'
  },
  {
    value: 'ROLE_RH_ADMIN',
    label: 'Admin'
  },
  {
    value: 'ROLE_RH_USER',
    label: 'RH User'
  },
  {
    value: 'ROLE_OP_CO_USER',
    label: 'Company User'
  }
]
