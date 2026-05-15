import { eq } from 'drizzle-orm'
import type {
  SaveStudentSchema,
  SelectStudentSchema,
  StudentsRepository,
} from '@/database/repositories/students-repository'
import { db } from '..'
import { studentsTable } from '../schema'

export class DrizzleStudentsRepository implements StudentsRepository {
  public async getById(studentId: string): Promise<SelectStudentSchema | null> {
    const [student] = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.id, studentId))
      .limit(1)

    return student ?? null
  }

  public async getAllByApplicatorId(
    applicatorId: string
  ): Promise<SelectStudentSchema[]> {
    const students = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.applicatorId, applicatorId))

    return students
  }

  public async save(student: SaveStudentSchema): Promise<SelectStudentSchema> {
    if (student.id) {
      const [raw] = await db
        .update(studentsTable)
        .set(student)
        .where(eq(studentsTable.id, student.id))
        .returning()

      return raw
    }

    const [raw] = await db.insert(studentsTable).values(student).returning()

    return raw
  }
}
