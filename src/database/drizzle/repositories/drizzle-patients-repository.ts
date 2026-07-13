import { and, count, desc, eq, ilike } from 'drizzle-orm'
import type {
  PatientsPaginationOptions,
  PatientsRepository,
  SavePatientSchema,
  SelectPatientSchema,
  SelectPatientWithMetadataSchema,
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
      conditions.push(ilike(patientsTable.name, `%${options.name}%`))
    }

    const whereClause = and(...conditions)

    const [patients, [{ total }]] = await Promise.all([
      db
        .select()
        .from(patientsTable)
        .where(whereClause)
        .orderBy(desc(patientsTable.createdAt))
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

  public async deleteById(patientId: string): Promise<void> {
    await db.delete(patientsTable).where(eq(patientsTable.id, patientId))
  }
}
