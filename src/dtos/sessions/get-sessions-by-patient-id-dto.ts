import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { sessionsTable } from '@/database/drizzle/schemas'

export const getSessionsByPatientIdDto = z.object({
  sessions: z.array(createSelectSchema(sessionsTable)),
})

export type GetSessionsByPatientIdDto = z.infer<
  typeof getSessionsByPatientIdDto
>
