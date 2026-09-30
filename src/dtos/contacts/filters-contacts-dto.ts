import { createInsertSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { contactsTable } from '@/database/drizzle/schemas'

export const filtersContactsDto = createInsertSchema(contactsTable).pick({
  status: true,
})

export type FiltersContactsDto = z.infer<typeof filtersContactsDto>
