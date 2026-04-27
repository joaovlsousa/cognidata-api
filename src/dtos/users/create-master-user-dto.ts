import { createInsertSchema } from 'drizzle-zod'
import { usersTable } from '@/database/drizzle/schema'

export const createMasterUserDto = createInsertSchema(usersTable, {
  id: (schema) => schema.optional(),
  cpf: (schema) => schema.optional(),
  contactPhone: (schema) => schema.optional(),
  institution: (schema) => schema.optional(),
  academicBackground: (schema) => schema.optional(),
})
