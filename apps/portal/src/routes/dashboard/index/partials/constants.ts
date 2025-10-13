import { z } from 'zod'

export const paramsSchema = z.object({
  modal: z.enum(['add-user']).nullish()
})
