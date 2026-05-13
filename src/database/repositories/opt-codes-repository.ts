import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { otpCodesTable } from '../drizzle/schema'

const saveOtpCodeSchema = createInsertSchema(otpCodesTable)

const selectOtpCodeSchema = createSelectSchema(otpCodesTable)

export type SaveOtpCodeSchema = z.infer<typeof saveOtpCodeSchema>
export type SelectOtpCodeSchema = z.infer<typeof selectOtpCodeSchema>

export interface OtpCodesRepository {
  save(otpCode: SaveOtpCodeSchema): Promise<SelectOtpCodeSchema>
  getByEmail(email: string): Promise<SelectOtpCodeSchema | null>
  deleteByEmail(email: string): Promise<void>
}
