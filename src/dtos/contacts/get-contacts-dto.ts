import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { contactsTable } from '@/database/drizzle/schemas'

export const getContactsDto = z.object({
  contacts: z.array(
    createSelectSchema(contactsTable).omit({
      message: true,
    })
  ),
})

export type GetContactsDto = z.infer<typeof getContactsDto>
