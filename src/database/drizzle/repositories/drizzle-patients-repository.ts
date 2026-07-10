import { eq } from 'drizzle-orm'
import type {
  PatientsRepository,
  SavePatientSchema,
  SelectPatientSchema,
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

  public async getAllByApplicatorId(
    applicatorId: string
  ): Promise<SelectPatientSchema[]> {
    const patients = await db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.applicatorId, applicatorId))

    return patients
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
}
