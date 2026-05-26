import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { usersTable } from '../drizzle/schema'

const saveUserSchema = createInsertSchema(usersTable, {
  id: (schema) => schema.optional(),
  academicBackground: (schema) => schema.optional(),
  createdAt: (schema) => schema.optional(),
})

const selectUserSchema = createSelectSchema(usersTable)

export type SaveUserSchema = z.infer<typeof saveUserSchema>
export type SelectUserSchema = z.infer<typeof selectUserSchema>

export interface UsersRepository {
  save(user: SaveUserSchema): Promise<SelectUserSchema>
  getById(userId: string): Promise<SelectUserSchema | null>
  getByEmail(email: string): Promise<SelectUserSchema | null>
  getAllInactive(): Promise<SelectUserSchema[]>
}
