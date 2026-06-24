import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { usersTable } from '@/database/drizzle/schema'

export const createAdminUserDto = createInsertSchema(usersTable, {
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
}).pick({
  name: true,
  email: true,
  password: true,
})

export type CreateAdminUserDto = z.infer<typeof createAdminUserDto>
