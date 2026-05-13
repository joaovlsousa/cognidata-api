import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { codesTable } from '../drizzle/schema'

const saveCodeSchema = createInsertSchema(codesTable)

const selectCodeSchema = createSelectSchema(codesTable)

export type SaveCodeSchema = z.infer<typeof saveCodeSchema>
export type SelectCodeSchema = z.infer<typeof selectCodeSchema>

export interface CodesRepository {
  save(code: SaveCodeSchema): Promise<SelectCodeSchema>
  getByEmail(email: string): Promise<SelectCodeSchema | null>
  deleteByEmail(email: string): Promise<void>
}
