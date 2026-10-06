import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { sessionsTable } from '@/database/drizzle/schemas'

export const createSessionRequestDto = createInsertSchema(sessionsTable, {
  countQuestion: z.number().min(5).max(11),
  durationInSeconds: z.number().nonnegative(),
  percentage: z.number().nonnegative().max(100),
  score: z.number().nonnegative(),
  thetaError: z.number().min(-3).max(3),
  thetaFinal: z.number().min(-3).max(3),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  createdAt: (schema) => schema.optional(),
}).omit({
  id: true,
  applicatorId: true,
  createdAt: true,
})

export type CreateSessionRequestDto = z.infer<typeof createSessionRequestDto>
