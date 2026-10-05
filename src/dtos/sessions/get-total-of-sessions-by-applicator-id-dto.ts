import { z } from 'zod'

export const getTotalOfSessionsByApplicatorIdDto = z.object({
  totalOfSessions: z.number().nonnegative(),
  thisMonth: z.number().nonnegative(),
})

export type GetTotalOfSessionsByApplicatorIdDto = z.infer<
  typeof getTotalOfSessionsByApplicatorIdDto
>
