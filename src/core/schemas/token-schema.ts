import { z } from 'zod'

export const tokenSchema = z.object({
  sub: z.string(),
  role: z.enum(['admin', 'applicator']),
})

export type TokenSchema = z.infer<typeof tokenSchema>
