import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { contactsTable } from '../drizzle/schema'

const saveContactSchema = createInsertSchema(contactsTable, {
  id: (schema) => schema.optional(),
  status: (schema) => schema.optional(),
  createdAt: (schema) => schema.optional(),
})

const selectContactSchema = createSelectSchema(contactsTable)

const filtersContactsSchema = saveContactSchema.pick({
  status: true,
})

export type SaveContactSchema = z.infer<typeof saveContactSchema>
export type SelectContactSchema = z.infer<typeof selectContactSchema>
export type FiltersContactSchema = z.infer<typeof filtersContactsSchema>

export interface ContactsRepository {
  save(contact: SaveContactSchema): Promise<SelectContactSchema>
  getById(contactId: string): Promise<SelectContactSchema | null>
  getAll(filters?: FiltersContactSchema): Promise<SelectContactSchema[]>
}
