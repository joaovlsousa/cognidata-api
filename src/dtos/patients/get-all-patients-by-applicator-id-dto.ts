import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { patientsTable } from '@/database/drizzle/schema'

export const getAllPatientsByApplicatorIdDto = z.object({
  patients: z.array(createSelectSchema(patientsTable)),
})

export type GetAllPatientsByApplicatorIdDto = z.infer<
  typeof getAllPatientsByApplicatorIdDto
>
