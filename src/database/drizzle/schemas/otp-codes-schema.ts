import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const otpCodesTable = pgTable('otp_codes', {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).notNull().unique(),
  code: varchar({ length: 255 }).notNull(),
  validUntil: timestamp().notNull(),
  verified: boolean().default(false),
  createdAt: timestamp().defaultNow(),
})
