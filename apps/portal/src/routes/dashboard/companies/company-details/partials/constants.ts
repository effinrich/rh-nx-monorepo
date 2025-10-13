import { z } from 'zod'

export const paramsSchema = z.object({
  companyId: z.string(),
  modal: z.enum(['add-user', 'add']).nullish()
})
