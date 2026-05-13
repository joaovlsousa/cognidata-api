import { eq } from 'drizzle-orm'
import type {
  CodesRepository,
  SaveCodeSchema,
  SelectCodeSchema,
} from '@/database/repositories/codes-repository'
import { db } from '..'
import { codesTable } from '../schema'

export class DrizzleCodesRepository implements CodesRepository {
  public async getByEmail(email: string): Promise<SelectCodeSchema | null> {
    const [code] = await db
      .select()
      .from(codesTable)
      .where(eq(codesTable.email, email))
      .limit(1)

    return code ?? null
  }

  public async deleteByEmail(email: string): Promise<void> {
    await db.delete(codesTable).where(eq(codesTable.email, email))
  }

  public async save(code: SaveCodeSchema): Promise<SelectCodeSchema> {
    const [raw] = await db.insert(codesTable).values(code).returning()

    return raw
  }
}
