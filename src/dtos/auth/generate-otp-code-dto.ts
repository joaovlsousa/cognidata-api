import { z } from 'zod'

export const generateOtpCodeDto = z.object({
  email: z.email(),
})

export type GenerateOtpCodeDto = z.infer<typeof generateOtpCodeDto>
