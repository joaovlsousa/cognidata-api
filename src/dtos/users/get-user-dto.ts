import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { usersTable } from '@/database/drizzle/schema'

export const getUserDto = z.object({
  user: createSelectSchema(usersTable).omit({
    password: true,
    cpf: true,
  }),
})

export type GetUserDto = z.infer<typeof getUserDto>
