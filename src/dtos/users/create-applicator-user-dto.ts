import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { usersTable } from '@/database/drizzle/schemas'

export const createApplicatorUserDto = createInsertSchema(usersTable, {
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
  crp: z.string().length(7),
}).pick({
  name: true,
  email: true,
  password: true,
  crp: true,
})

export type CreateApplicatorUserDto = z.infer<typeof createApplicatorUserDto>
