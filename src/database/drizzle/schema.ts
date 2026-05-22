import {
  boolean,
  date,
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  role: varchar({ enum: ['admin', 'applicator'] })
    .notNull()
    .default('applicator'),
  name: varchar({ length: 200 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  cpf: varchar({ length: 11 }).notNull(),
  institution: varchar({ length: 255 }).notNull(),
  contactPhone: varchar({ length: 11 }).notNull(),
  academicBackground: varchar({ length: 255 }),
  createdAt: timestamp().defaultNow(),
})

export const studentsTable = pgTable('students', {
  id: uuid().primaryKey().defaultRandom(),
  applicatorId: uuid()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: 'cascade',
    }),
  name: varchar({ length: 200 }).notNull(),
  gender: varchar({ enum: ['male', 'female'] }).notNull(),
  birthDate: date().notNull(),
  institution: varchar({ length: 255 }).notNull(),
  grade: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
})

export const sessionsTable = pgTable('sessions', {
  id: uuid().primaryKey().defaultRandom(),
  applicatorId: uuid()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: 'cascade',
    }),
  studentId: uuid()
    .notNull()
    .references(() => studentsTable.id, {
      onDelete: 'cascade',
    }),
  durationInSeconds: doublePrecision().notNull(),
  countQuestion: integer().notNull(),
  score: integer().notNull(),
  percentage: integer().notNull(),
  thetaFinal: doublePrecision().notNull(),
  thetaError: doublePrecision().notNull(),
  startTime: timestamp().notNull(),
  endTime: timestamp().notNull(),
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
