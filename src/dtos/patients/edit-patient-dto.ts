import { z } from 'zod'
import { createPatientDto } from './create-patient-dto'

export const editPatientDto = createPatientDto.extend({
  cpf: z
    .string()
    .length(11)
    .refine((v) => v.replace(/(\D)/g, '').length === 11)
    .optional(),
})

export type EditPatientDto = z.infer<typeof editPatientDto>
