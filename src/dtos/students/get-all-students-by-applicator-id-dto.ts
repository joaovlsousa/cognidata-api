import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { studentsTable } from '@/database/drizzle/schema'

export const getAllStudentsByApplicatorIdDto = z.object({
  students: z.array(createSelectSchema(studentsTable)),
})

export type GetAllStudentsByApplicatorIdDto = z.infer<
  typeof getAllStudentsByApplicatorIdDto
>
