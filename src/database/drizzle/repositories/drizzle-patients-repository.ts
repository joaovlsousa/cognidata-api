import { startOfMonth } from 'date-fns'
import { and, asc, count, desc, eq, gte, inArray, sql } from 'drizzle-orm'
import type {
  PatientsPaginationOptions,
  PatientsRepository,
  SavePatientSchema,
  SelectPatientSchema,
  SelectPatientWithMetadataSchema,
  SelectTotalOfPatientsSchema,
} from '@/database/repositories/patients-repository'
import { db } from '..'
import { patientsTable } from '../schema'

export class DrizzlePatientsRepository implements PatientsRepository {
  public async getById(patientId: string): Promise<SelectPatientSchema | null> {
    const [patient] = await db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.id, patientId))
      .limit(1)

    return patient ?? null
  }

  public async getByApplicatorId(
    applicatorId: string,
    options?: PatientsPaginationOptions
  ): Promise<SelectPatientWithMetadataSchema> {
    const page = options?.page ?? 1
    const perPage = options?.perPage ?? 10
    const offset = (page - 1) * perPage

    const conditions = [eq(patientsTable.applicatorId, applicatorId)]

    if (options?.name?.length) {
      conditions.push(
        sql`to_tsvector('portuguese', ${patientsTable.name}) @@ plainto_tsquery('portuguese', ${options.name})`
      )
    }

    const whereClause = and(...conditions)

    const orderBy = options?.orderBy
      ? patientsTable[options.orderBy]
      : patientsTable.name
    const order = options?.order ?? 'asc'

    const orderByClause = order === 'asc' ? asc(orderBy) : desc(orderBy)

    const [patients, [{ total }]] = await Promise.all([
      db
        .select()
        .from(patientsTable)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(perPage)
        .offset(offset),

      db.select({ total: count() }).from(patientsTable).where(whereClause),
    ])

    return {
      patients,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    }
  }

  public async getByCpfHashAndApplicatorId(
    cpfHash: string,
    applicatorId: string
  ): Promise<SelectPatientSchema | null> {
    const [patient] = await db
      .select()
      .from(patientsTable)
      .where(
        and(
          eq(patientsTable.cpfHash, cpfHash),
          eq(patientsTable.applicatorId, applicatorId)
        )
      )
      .limit(1)

    return patient ?? null
  }

  public async getByCpfsHashList(
    cpfsHashList: string[]
  ): Promise<SelectPatientSchema[]> {
    const patients = await db
      .select()
      .from(patientsTable)
      .where(inArray(patientsTable.cpfHash, cpfsHashList))

    return patients
  }

  public async getTotalByApplicatorId(
    applicatorId: string
  ): Promise<SelectTotalOfPatientsSchema> {
    const startDateOfMonth = startOfMonth(new Date())

    const [{ thisMonth, totalOfPatients }] = await db
      .select({
        totalOfPatients: count(),
        thisMonth: count(gte(patientsTable.createdAt, startDateOfMonth)),
      })
      .from(patientsTable)
      .where(eq(patientsTable.applicatorId, applicatorId))

    return {
      totalOfPatients,
      thisMonth,
    }
  }

  public async save(patient: SavePatientSchema): Promise<SelectPatientSchema> {
    if (patient.id) {
      const [raw] = await db
        .update(patientsTable)
        .set(patient)
        .where(eq(patientsTable.id, patient.id))
        .returning()

      return raw
    }

    const [raw] = await db.insert(patientsTable).values(patient).returning()

    return raw
  }

  public async deleteByIdList(patientsIds: string[]): Promise<void> {
    await db.delete(patientsTable).where(inArray(patientsTable.id, patientsIds))
  }

  public async deleteById(patientId: string): Promise<void> {
    await db.delete(patientsTable).where(eq(patientsTable.id, patientId))
  }

  public async createMany(patients: SavePatientSchema[]): Promise<number> {
    await db.insert(patientsTable).values(patients)

    return patients.length
  }
}
