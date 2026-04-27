import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  role: varchar({ enum: ['master', 'admin', 'applicator'] })
    .notNull()
    .$default(() => 'applicator'),
  name: varchar({ length: 200 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  cpf: varchar({ length: 11 }),
  institution: varchar({ length: 255 }),
  contactPhone: varchar({ length: 11 }),
  academicBackground: varchar({ length: 255 }),
})
