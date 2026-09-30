import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const contactsTable = pgTable('contacts', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 200 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  subject: varchar({ length: 255 }).notNull(),
  message: text().notNull(),
  status: varchar({ enum: ['peending', 'closed'] })
    .notNull()
    .default('peending'),
  createdAt: timestamp().defaultNow(),
})
