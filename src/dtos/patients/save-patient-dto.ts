import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { patientsTable } from '@/database/drizzle/schema'

export const savePatientDto = createInsertSchema(patientsTable, {
  name: z.string().min(1),
  dateOfBirth: z.iso.date(),
  patientResponsibleName: z.string().min(1),
  patientResponsibleEmail: z.email(),
  patientResponsiblePhone: z
    .string()
    .length(11)
    .refine((v) => v.replace(/(\D)/g, '').length === 11),
  schoolName: z.string().min(1),
  schoolYear: z.coerce.number().int().min(1).max(6),
  medicalChiefComplaint: z.string().min(1),
  medicalObservations: z.string().optional(),
}).pick({
  name: true,
  dateOfBirth: true,
  gender: true,
  patientResponsibleName: true,
  patientResponsibleEmail: true,
  patientResponsibleKinship: true,
  patientResponsiblePhone: true,
  schoolName: true,
  schoolYear: true,
  schoolSchedule: true,
  medicalChiefComplaint: true,
  medicalObservations: true,
})

export type SavePatientDto = z.infer<typeof savePatientDto>
