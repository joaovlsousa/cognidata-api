import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { patientsTable } from '../drizzle/schema'

const savePatientSchema = createInsertSchema(patientsTable)

const selectPatientSchema = createSelectSchema(patientsTable)

export type SavePatientSchema = z.infer<typeof savePatientSchema>
export type SelectPatientSchema = z.infer<typeof selectPatientSchema>

export interface PatientsRepository {
  save(patient: SavePatientSchema): Promise<SelectPatientSchema>
  getById(patientId: string): Promise<SelectPatientSchema | null>
  getAllByApplicatorId(applicatorId: string): Promise<SelectPatientSchema[]>
  deleteById(patientId: string): Promise<void>
}
