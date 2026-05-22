import { createInsertSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { sessionsTable } from '@/database/drizzle/schema'

export const createSessionRequestDto = createInsertSchema(sessionsTable, {
  id: (schema) => schema.optional(),
  createdAt: (schema) => schema.optional(),
}).omit({
  id: true,
  createdAt: true,
})

export type CreateSessionRequestDto = z.infer<typeof createSessionRequestDto>
