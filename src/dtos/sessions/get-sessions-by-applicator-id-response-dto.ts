import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { sessionsTable } from '@/database/drizzle/schemas'

export const getSessionsByApplicatorIdResponseDto = z.object({
  sessions: z.array(
    createSelectSchema(sessionsTable)
      .extend({
        patientName: z.string(),
      })
      .omit({
        thetaError: true,
        thetaFinal: true,
      })
  ),
  meta: z.object({
    page: z.number().nonnegative(),
    perPage: z.number().nonnegative(),
    total: z.number().nonnegative(),
    totalPages: z.number().nonnegative(),
  }),
})

export type GetSessionsByApplicatorIdResponseDto = z.infer<
  typeof getSessionsByApplicatorIdResponseDto
>
