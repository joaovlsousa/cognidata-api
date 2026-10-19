import { createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { sessionsTable } from '@/database/drizzle/schemas'

export const getSessionByIdDto = createSelectSchema(sessionsTable)

export type GetSessionByIdDto = z.infer<typeof getSessionByIdDto>
