import { z } from 'zod'

import { schema } from './constants'

export type Form = z.infer<typeof schema>
export type Field = keyof Form
