import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { usersTable } from '@/database/drizzle/schema'

export const updateApplicatorUserDto = createInsertSchema(usersTable, {
  name: z.string().min(1),
  contactPhone: z.string().length(11),
  academicBackground: z.string().min(1),
}).pick({
  name: true,
  contactPhone: true,
  academicBackground: true,
})

export type UpdateApplicatorUserDto = z.infer<typeof updateApplicatorUserDto>
