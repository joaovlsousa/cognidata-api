import { z } from 'zod'

export const authResponseDto = z.object({
  token: z.string().min(1),
})

export type AuthResponseDto = z.infer<typeof authResponseDto>
