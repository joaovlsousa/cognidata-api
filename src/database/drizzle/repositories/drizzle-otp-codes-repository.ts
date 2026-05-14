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

  public async deleteById(otpCodeId: string): Promise<void> {
    await db.delete(otpCodesTable).where(eq(otpCodesTable.id, otpCodeId))
  }

  public async save(otpCode: SaveOtpCodeSchema): Promise<SelectOtpCodeSchema> {
    if (otpCode.id) {
      const [raw] = await db
        .update(otpCodesTable)
        .set(otpCode)
        .where(eq(otpCodesTable.id, otpCode.id))
        .returning()

      return raw
    }

    const [raw] = await db.insert(otpCodesTable).values(otpCode).returning()

    return raw
  }
}
