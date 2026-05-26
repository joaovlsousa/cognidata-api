import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { usersTable } from '@/database/drizzle/schema'

export const createApplicatorUserDto = createInsertSchema(usersTable, {
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
  cpf: z.string().length(11),
  contactPhone: z.string().length(11),
  institution: z.string().min(3),
}).pick({
  name: true,
  email: true,
  password: true,
  cpf: true,
  contactPhone: true,
  institution: true,
})

export type CreateApplicatorUserDto = z.infer<typeof createApplicatorUserDto>
