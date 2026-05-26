import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { sessionsTable } from '../drizzle/schema'

const saveSessionSchema = createInsertSchema(sessionsTable, {
  id: (schema) => schema.optional(),
  createdAt: (schema) => schema.optional(),
})

const selectSessionSchema = createSelectSchema(sessionsTable)

export type SaveSessionSchema = z.infer<typeof saveSessionSchema>
export type SelectSessionSchema = z.infer<typeof selectSessionSchema>

export interface SessionsRepository {
  save(session: SaveSessionSchema): Promise<SelectSessionSchema>
}
