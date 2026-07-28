import { z } from 'zod'
import { savePatientDto } from './save-patient-dto'

const BR_DATE_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/

function convertBrDateToIso(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value
  }

  const match = value.trim().match(BR_DATE_REGEX)
  if (!match) {
    return value
  }

  const [, day, month, year] = match

  return `${year}-${month}-${day}`
}

export const createPatientsFromCsvDto = savePatientDto.extend({
  schoolYear: z.coerce.number().int().min(1).max(6),
  dateOfBirth: z.preprocess(convertBrDateToIso, z.iso.date()),
})

export type CreatePatientsFromCsvDto = z.infer<typeof createPatientsFromCsvDto>
