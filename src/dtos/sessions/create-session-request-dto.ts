import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { sessionsTable } from '@/database/drizzle/schemas'

export const createSessionRequestDto = createInsertSchema(sessionsTable, {
  id: (schema) => schema.optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  createdAt: (schema) => schema.optional(),
}).omit({
  id: true,
  applicatorId: true,
  createdAt: true,
})

export type CreateSessionRequestDto = z.infer<typeof createSessionRequestDto>
