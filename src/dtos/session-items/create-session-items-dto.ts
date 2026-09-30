import { createInsertSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { sessionItemsTable } from '@/database/drizzle/schemas'

export const createSessionItemsDto = createInsertSchema(sessionItemsTable, {
  id: (schema) => schema.optional(),
  createdAt: (schema) => schema.optional(),
}).omit({
  id: true,
  sessionId: true,
  createdAt: true,
})

export type CreateSessionItemsDto = z.infer<typeof createSessionItemsDto>
