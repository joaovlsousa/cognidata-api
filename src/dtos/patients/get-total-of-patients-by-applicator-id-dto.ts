import { z } from 'zod'

export const getTotalOfPatientsByApplicatorIdDto = z.object({
  totalOfPatients: z.number().nonnegative(),
  thisMonth: z.number().nonnegative(),
})

export type GetTotalOfPatientsByApplicatorIdDto = z.infer<
  typeof getTotalOfPatientsByApplicatorIdDto
>
