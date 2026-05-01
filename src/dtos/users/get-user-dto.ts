import { createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { usersTable } from '@/database/drizzle/schema'

export const getUserDto = createSelectSchema(usersTable).omit({
  password: true,
})

export type GetUserDto = z.infer<typeof getUserDto>
