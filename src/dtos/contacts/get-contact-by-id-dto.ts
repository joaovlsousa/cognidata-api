import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { contactsTable } from '@/database/drizzle/schema'

export const getContactByIdDto = z.object({
  contact: createSelectSchema(contactsTable),
})

export type GetContactByIdDto = z.infer<typeof getContactByIdDto>
