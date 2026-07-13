import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { patientsTable } from '@/database/drizzle/schema'

export const getPatientsByApplicatorIdResponseDto = z.object({
  patients: z.array(createSelectSchema(patientsTable)),
  meta: z.object({
    page: z.number().nonnegative(),
    perPage: z.number().nonnegative(),
    total: z.number().nonnegative(),
    totalPages: z.number().nonnegative(),
  }),
})

export type GetPatientsByApplicatorIdResponseDto = z.infer<
  typeof getPatientsByApplicatorIdResponseDto
>
