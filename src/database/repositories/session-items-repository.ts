import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { sessionItemsTable } from '../drizzle/schema'

const saveSessionItemsSchema = createInsertSchema(sessionItemsTable, {
  id: (schema) => schema.optional(),
  createdAt: (schema) => schema.optional(),
})

const selectSessionItemsSchema = createSelectSchema(sessionItemsTable)

export type SaveSessionItemsSchema = z.infer<typeof saveSessionItemsSchema>
export type SelectSessionItemsSchema = z.infer<typeof selectSessionItemsSchema>

export interface SessionItemsRepository {
  save(sessionItems: SaveSessionItemsSchema): Promise<SelectSessionItemsSchema>
}
