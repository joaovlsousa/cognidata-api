import { z } from 'zod'

export const resetPasswordDto = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export type ResetPasswordDto = z.infer<typeof resetPasswordDto>
