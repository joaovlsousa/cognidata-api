import { z } from 'zod'

export const tokenSchema = z.object({
  sub: z.string(),
  role: z.enum(['master', 'admin', 'applicator']),
})

export type TokenSchema = z.infer<typeof tokenSchema>
