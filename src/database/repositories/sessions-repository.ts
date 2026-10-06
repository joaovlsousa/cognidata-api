import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { sessionsTable } from '../drizzle/schemas'

const saveSessionSchema = createInsertSchema(sessionsTable, {
  id: (schema) => schema.optional(),
  createdAt: (schema) => schema.optional(),
})

const selectSessionSchema = createSelectSchema(sessionsTable)

export type SaveSessionSchema = z.infer<typeof saveSessionSchema>
export type SelectSessionSchema = z.infer<typeof selectSessionSchema>

export type SessionsPaginationOptions = {
  page?: number
  perPage?: number
  name?: string
}

export type SelectSessionWithPatientSchema = SelectSessionSchema & {
  patientName: string
}

export type SelectSessionWithMetadataSchema = {
  sessions: SelectSessionWithPatientSchema[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

export type SelectTotalOfSessionsSchema = {
  totalOfSessions: number
  thisMonth: number
}

export interface SessionsRepository {
  save(session: SaveSessionSchema): Promise<SelectSessionSchema>
  getById(sessionId: string): Promise<SelectSessionSchema | null>
  getByApplicatorId(
    applicatorId: string,
    options?: SessionsPaginationOptions
  ): Promise<SelectSessionWithMetadataSchema>
  getTotalByApplicatorId(
    applicatorId: string
  ): Promise<SelectTotalOfSessionsSchema>
}
