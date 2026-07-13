import { z } from 'zod'

export const getPatientsByApplicatorIdRequestDto = z.object({
  page: z.coerce.number().nonnegative().optional(),
  perPage: z.coerce.number().nonnegative().optional(),
  status: z.enum(['active', 'alert', 'pending', 'all']).optional(),
  name: z.string().min(1).optional(),
})

export type GetPatientsByApplicatorIdRequestDto = z.infer<
  typeof getPatientsByApplicatorIdRequestDto
>
