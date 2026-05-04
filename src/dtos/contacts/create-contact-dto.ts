import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { contactsTable } from '@/database/drizzle/schema'

export const createContactDto = createInsertSchema(contactsTable, {
  name: z.string().min(1),
  email: z.email(),
  subject: z.string().min(1),
  message: z.string().min(10),
}).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
})

export type CreateContactDto = z.infer<typeof createContactDto>
