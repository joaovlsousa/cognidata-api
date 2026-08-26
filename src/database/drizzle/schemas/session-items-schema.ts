import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { sessionsTable } from './sessions-schema'

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
