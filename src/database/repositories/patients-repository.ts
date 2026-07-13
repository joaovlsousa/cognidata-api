import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { patientsTable } from '../drizzle/schema'

const savePatientSchema = createInsertSchema(patientsTable)

const selectPatientSchema = createSelectSchema(patientsTable)

export type SavePatientSchema = z.infer<typeof savePatientSchema>
export type SelectPatientSchema = z.infer<typeof selectPatientSchema>

export type PatientsPaginationOptions = {
  page?: number
  perPage?: number
  status?: 'active' | 'pending' | 'alert' | 'all'
  name?: string
}

export type SelectPatientWithMetadataSchema = {
  patients: SelectPatientSchema[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

export interface PatientsRepository {
  save(patient: SavePatientSchema): Promise<SelectPatientSchema>
  getById(patientId: string): Promise<SelectPatientSchema | null>
  getByApplicatorId(
    applicatorId: string,
    options?: PatientsPaginationOptions
  ): Promise<SelectPatientWithMetadataSchema>
  deleteById(patientId: string): Promise<void>
}
