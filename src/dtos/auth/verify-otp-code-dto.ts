import { z } from 'zod'

export const verifyOtpCodeDto = z.object({
  email: z.email(),
  code: z.string().length(6),
})

export type VerifyOtpCodeDto = z.infer<typeof verifyOtpCodeDto>
