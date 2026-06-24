import { z } from 'zod'

export const authResponseDto = z.object({
  token: z.string().min(1),
  userRole: z.enum(['admin', 'applicator']),
})

export type AuthResponseDto = z.infer<typeof authResponseDto>
