import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { patientsTable } from '@/database/drizzle/schemas'

export const getPatientByIdDto = z.object({
  patient: createSelectSchema(patientsTable)
    .omit({
      cpfHash: true,
    })
    .transform((values) => ({
      ...values,
      cpf: values.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '***.$2.$3-**'),
    })),
})

export type GetPatientByIdDto = z.infer<typeof getPatientByIdDto>
