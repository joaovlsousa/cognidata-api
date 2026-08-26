import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  role: varchar({ enum: ['admin', 'applicator'] })
    .notNull()
    .default('applicator'),
  name: varchar({ length: 200 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  crp: varchar({ length: 7 }),
  isActive: boolean().notNull().default(false),
  createdAt: timestamp().defaultNow(),
})
