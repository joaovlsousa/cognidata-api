import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { usersTable } from '@/database/drizzle/schemas'

export const getUsersDto = z.object({
  users: z.array(
    createSelectSchema(usersTable).omit({
      password: true,
    })
  ),
})

export type GetUsersDto = z.infer<typeof getUsersDto>
