import { and, asc, avg, eq } from 'drizzle-orm'
import type {
  SaveSessionItemsSchema,
  SelectAverageBySkillSchema,
  SelectSessionItemsSchema,
  SelectThetaEvolutionBySkillSchema,
  SessionItemSkill,
  SessionItemsRepository,
} from '@/database/repositories/session-items-repository'
import { db } from '..'
import { sessionItemsTable, sessionsTable } from '../schemas'

export class DrizzleSessionItemsRepository implements SessionItemsRepository {
  public async save(
    sessionItem: SaveSessionItemsSchema
  ): Promise<SelectSessionItemsSchema> {
    if (sessionItem.id) {
      const [raw] = await db
        .update(sessionItemsTable)
        .set(sessionItem)
        .where(eq(sessionItemsTable.id, sessionItem.id))
        .returning()

      return raw
    }

    const [raw] = await db
      .insert(sessionItemsTable)
      .values(sessionItem)
      .returning()

    return raw
  }

  public async getAverageBySkill(
    skill: SessionItemSkill,
    applicatorId: string
  ): Promise<SelectAverageBySkillSchema[]> {
    const rows = await db
      .select({
        itemIndex: sessionItemsTable.itemIndex,
        averageTheta: avg(sessionItemsTable.thetaAfter),
        difficulty: avg(sessionItemsTable.difficulty),
      })
      .from(sessionItemsTable)
      .innerJoin(
        sessionsTable,
        eq(sessionItemsTable.sessionId, sessionsTable.id)
      )
      .where(
        and(
          eq(sessionItemsTable.skill, skill),
          eq(sessionsTable.applicatorId, applicatorId)
        )
      )
      .groupBy(sessionItemsTable.itemIndex)
      .orderBy(asc(sessionItemsTable.itemIndex))

    return rows.map((row) => ({
      itemIndex: row.itemIndex,
      averageTheta: Number(row.averageTheta),
      difficulty: Number(row.difficulty),
    }))
  }

  public async getThetaEvolutionBySkill(
    skill: SessionItemSkill,
    sessionId: string,
    applicatorId: string
  ): Promise<SelectThetaEvolutionBySkillSchema[]> {
    const rows = await db
      .select({
        itemIndex: sessionItemsTable.itemIndex,
        theta: sessionItemsTable.thetaAfter,
        difficulty: sessionItemsTable.difficulty,
      })
      .from(sessionItemsTable)
      .innerJoin(
        sessionsTable,
        eq(sessionItemsTable.sessionId, sessionsTable.id)
      )
      .where(
        and(
          eq(sessionItemsTable.skill, skill),
          eq(sessionItemsTable.sessionId, sessionId),
          eq(sessionsTable.applicatorId, applicatorId)
        )
      )
      .orderBy(asc(sessionItemsTable.itemIndex))

    return rows
  }
}
