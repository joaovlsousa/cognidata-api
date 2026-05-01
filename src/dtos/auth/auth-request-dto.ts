import { z } from 'zod'

export const authRequestDto = z.object({
  email: z.email(),
  password: z.string().min(1),
})

export type AuthRequestDto = z.infer<typeof authRequestDto>
