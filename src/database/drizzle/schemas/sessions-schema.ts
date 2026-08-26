import {
  doublePrecision,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { patientsTable } from './patients-schema'
import { usersTable } from './users-schema'

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
