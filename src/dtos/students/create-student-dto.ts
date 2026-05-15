import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { studentsTable } from '@/database/drizzle/schema'

export const createStudentDto = createInsertSchema(studentsTable, {
  name: z.string().min(1),
  birthDate: z.coerce.date().transform((date) => date.toISOString()),
}).pick({
  name: true,
  birthDate: true,
  gender: true,
  grade: true,
})

export type CreateStudentDto = z.infer<typeof createStudentDto>
