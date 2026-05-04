import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { contactsTable } from '@/database/drizzle/schema'

export const getContactsDto = z.object({
  contacts: z.array(createSelectSchema(contactsTable)),
})

export type GetContactsDto = z.infer<typeof getContactsDto>
