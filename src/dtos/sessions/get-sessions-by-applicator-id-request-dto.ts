import { z } from 'zod'

export const getSessionsByApplicatorIdRequestDto = z.object({
  page: z.coerce.number().nonnegative().optional(),
  perPage: z.coerce.number().nonnegative().optional(),
  name: z.string().min(1).optional(),
})

export type GetSessionsByApplicatorIdRequestDto = z.infer<
  typeof getSessionsByApplicatorIdRequestDto
>
