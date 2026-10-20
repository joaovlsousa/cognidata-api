import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { sessionItemsTable } from '../drizzle/schemas'

const saveSessionItemsSchema = createInsertSchema(sessionItemsTable, {
  id: (schema) => schema.optional(),
  createdAt: (schema) => schema.optional(),
})

const selectSessionItemsSchema = createSelectSchema(sessionItemsTable)

export type SaveSessionItemsSchema = z.infer<typeof saveSessionItemsSchema>
export type SelectSessionItemsSchema = z.infer<typeof selectSessionItemsSchema>

export type SessionItemSkill =
  (typeof sessionItemsTable.skill.enumValues)[number]

export type SelectAverageBySkillSchema = {
  itemIndex: number
  averageTheta: number
  difficulty: number
}

export type SelectThetaEvolutionBySkillSchema = {
  itemIndex: number
  theta: number
  difficulty: number
}

export interface SessionItemsRepository {
  save(sessionItems: SaveSessionItemsSchema): Promise<SelectSessionItemsSchema>
  getAverageBySkill(
    skill: SessionItemSkill,
    applicatorId: string
  ): Promise<SelectAverageBySkillSchema[]>
  getThetaEvolutionBySkill(
    skill: SessionItemSkill,
    sessionId: string,
    applicatorId: string
  ): Promise<SelectThetaEvolutionBySkillSchema[]>
}
