import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { studentsTable } from '../drizzle/schema'

const saveStudentSchema = createInsertSchema(studentsTable)

const selectStudentSchema = createSelectSchema(studentsTable)

export type SaveStudentSchema = z.infer<typeof saveStudentSchema>
export type SelectStudentSchema = z.infer<typeof selectStudentSchema>

export interface StudentsRepository {
  save(student: SaveStudentSchema): Promise<SelectStudentSchema>
  getById(studentId: string): Promise<SelectStudentSchema | null>
  getAllByApplicatorId(applicatorId: string): Promise<SelectStudentSchema[]>
}
