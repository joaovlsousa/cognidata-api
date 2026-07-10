import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { patientsTable } from '@/database/drizzle/schema'

export const getPatientByIdDto = z.object({
  patient: createSelectSchema(patientsTable),
})

export type GetPatientByIdDto = z.infer<typeof getPatientByIdDto>
