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
  crp: varchar({ length: 7 }),
  isActive: boolean().notNull().default(false),
  createdAt: timestamp().defaultNow(),
})

export const patientsTable = pgTable('patients', {
  id: uuid().primaryKey().defaultRandom(),
  applicatorId: uuid()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: 'cascade',
    }),
  name: varchar({ length: 200 }).notNull(),
  gender: varchar({ enum: ['male', 'female'] }).notNull(),
  dateOfBirth: date().notNull(),
  patientResponsibleName: varchar({ length: 255 }).notNull(),
  patientResponsibleKinship: varchar({
    enum: ['father/mother', 'grandfather/grandmother', 'uncle/aunt'],
  }).notNull(),
  patientResponsiblePhone: varchar({ length: 11 }).notNull(),
  patientResponsibleEmail: varchar({ length: 255 }).notNull(),
  schoolName: varchar({ length: 255 }).notNull(),
  schoolYear: integer().notNull(),
  schoolSchedule: varchar({
    enum: ['morning', 'afternoon', 'fullTime'],
  }).notNull(),
  medicalChiefComplaint: varchar({ length: 255 }).notNull(),
  medicalObservations: text(),
  createdAt: timestamp().defaultNow(),
})

export const sessionsTable = pgTable('sessions', {
  id: uuid().primaryKey().defaultRandom(),
  applicatorId: uuid()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: 'cascade',
    }),
  patientId: uuid()
    .notNull()
    .references(() => patientsTable.id, {
      onDelete: 'cascade',
    }),
  durationInSeconds: doublePrecision().notNull(),
  countQuestion: integer().notNull(),
  skill: varchar({ length: 255 }).notNull(),
  score: integer().notNull(),
  percentage: integer().notNull(),
  thetaFinal: doublePrecision().notNull(),
  thetaError: doublePrecision().notNull(),
  startTime: timestamp().notNull(),
  endTime: timestamp().notNull(),
  createdAt: timestamp().defaultNow(),
})

export const sessionItemsTable = pgTable('session_items', {
  id: uuid().primaryKey().defaultRandom(),
  sessionId: uuid()
    .notNull()
    .references(() => sessionsTable.id, {
      onDelete: 'cascade',
    }),
  questionNumber: integer().notNull(),
  itemIndex: integer().notNull(),
  responseTimeInSeconds: integer().notNull(),
  skill: varchar({ length: 255 }).notNull(),
  stimulusName: varchar({ length: 255 }).notNull(),
  correctAnswer: varchar({ length: 255 }).notNull(),
  playerAnswer: varchar({ length: 255 }).notNull(),
  isCorrect: boolean().notNull(),
  difficulty: doublePrecision().notNull(),
  discrimination: doublePrecision().notNull(),
  guessing: doublePrecision().notNull(),
  probability: doublePrecision().notNull(),
  information: doublePrecision().notNull(),
  thetaBefore: doublePrecision().notNull(),
  thetaAfter: doublePrecision().notNull(),
  thetaError: doublePrecision().notNull(),
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
