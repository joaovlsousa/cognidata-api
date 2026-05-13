import { eq } from 'drizzle-orm'
import type {
  OtpCodesRepository,
  SaveOtpCodeSchema,
  SelectOtpCodeSchema,
} from '@/database/repositories/opt-codes-repository'
import { db } from '..'
import { otpCodesTable } from '../schema'

export class DrizzleOtpCodesRepository implements OtpCodesRepository {
  public async getByEmail(email: string): Promise<SelectOtpCodeSchema | null> {
    const [otpcode] = await db
      .select()
      .from(otpCodesTable)
      .where(eq(otpCodesTable.email, email))
      .limit(1)

    return otpcode ?? null
  }

  public async deleteByEmail(email: string): Promise<void> {
    await db.delete(otpCodesTable).where(eq(otpCodesTable.email, email))
  }

  public async save(otpcode: SaveOtpCodeSchema): Promise<SelectOtpCodeSchema> {
    const [raw] = await db.insert(otpCodesTable).values(otpcode).returning()

    return raw
  }
}
