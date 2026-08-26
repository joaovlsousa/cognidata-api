import { sql } from 'drizzle-orm'
import {
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { usersTable } from './users-schema'

export const patientsTable = pgTable(
  'patients',
  {
    id: uuid().primaryKey().defaultRandom(),
    applicatorId: uuid()
      .notNull()
      .references(() => usersTable.id, {
        onDelete: 'cascade',
      }),
    name: varchar({ length: 200 }).notNull(),
    gender: varchar({ enum: ['male', 'female'] }).notNull(),
    dateOfBirth: date().notNull(),
    cpf: varchar({ length: 255 }).notNull(),
    cpfHash: varchar({ length: 64 }).notNull(),
    status: varchar({ enum: ['active', 'pending', 'alert'] })
      .notNull()
      .default('pending'),
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
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => [
    index('name_search_idx').using(
      'gin',
      sql`to_tsvector('portuguese', ${table.name})`
    ),
    uniqueIndex('cpf_hash_applicator_id_idx').on(
      table.cpfHash,
      table.applicatorId
    ),
    index('cpf_hash_idx').on(table.cpfHash),
  ]
)
