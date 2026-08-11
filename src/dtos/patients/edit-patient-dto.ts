import type { z } from 'zod'
import { createPatientDto } from './create-patient-dto'

export const editPatientDto = createPatientDto.omit({
  cpf: true,
})

export type EditPatientDto = z.infer<typeof editPatientDto>
