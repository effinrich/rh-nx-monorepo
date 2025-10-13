import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export const schema = z.object({
  requesterName: z.string().min(1, 'This field is required.'),
  requesterEmail: z
    .string()
    .min(1, 'This field is required.')
    .email('Email is invalid.'),
  additionalEmails: z.string().optional(),
  opcoName: z.string().min(1, 'This field is required.'),
  opcoDescription: z.string().min(1, 'This field is required.')
})

export const resolver = zodResolver(schema)
