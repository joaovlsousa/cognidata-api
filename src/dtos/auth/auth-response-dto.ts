import { z } from 'zod'

export const authResponseDto = z.object({
  token: z.string(),
})

export type AuthResponseDto = z.infer<typeof authResponseDto>
