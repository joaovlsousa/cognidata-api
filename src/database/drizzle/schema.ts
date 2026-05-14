import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  role: varchar({ enum: ['master', 'admin', 'applicator'] })
    .notNull()
    .default('applicator'),
  name: varchar({ length: 200 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  cpf: varchar({ length: 11 }),
  institution: varchar({ length: 255 }),
  contactPhone: varchar({ length: 11 }),
  academicBackground: varchar({ length: 255 }),
  createdAt: timestamp().defaultNow(),
})

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

export const otpCodesTable = pgTable('otp_codes', {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).notNull().unique(),
  code: varchar({ length: 255 }).notNull(),
  validUntil: timestamp().notNull(),
  verified: boolean().default(false),
  createdAt: timestamp().defaultNow(),
})
