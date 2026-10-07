import { startOfMonth } from 'date-fns'
import { and, count, desc, eq, getTableColumns, gte, sql } from 'drizzle-orm'
import type {
  SaveSessionSchema,
  SelectAverageByApplicatorIdSchema,
  SelectLatestByPatientIdSchema,
  SelectSessionSchema,
  SelectSessionWithMetadataSchema,
  SelectTotalOfSessionsSchema,
  SessionsPaginationOptions,
  SessionsRepository,
} from '@/database/repositories/sessions-repository'
import { db } from '..'
import { patientsTable, sessionsTable } from '../schemas'

export class DrizzleSessionsRepository implements SessionsRepository {
  public async getById(sessionId: string): Promise<SelectSessionSchema | null> {
    const [session] = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.id, sessionId))
      .limit(1)

    return session ?? null
  }

  public async getByApplicatorId(
    applicatorId: string,
    options?: SessionsPaginationOptions
  ): Promise<SelectSessionWithMetadataSchema> {
    const page = options?.page ?? 1
    const perPage = options?.perPage ?? 10
    const offset = (page - 1) * perPage

    const conditions = [eq(sessionsTable.applicatorId, applicatorId)]

    if (options?.name?.length) {
      conditions.push(
        sql`to_tsvector('portuguese', ${patientsTable.name}) @@ plainto_tsquery('portuguese', ${options.name})`
      )
    }

    const whereClause = and(...conditions)

    const [sessions, [{ total }]] = await Promise.all([
      db
        .select({
          ...getTableColumns(sessionsTable),
          patientName: patientsTable.name,
        })
        .from(sessionsTable)
        .innerJoin(patientsTable, eq(sessionsTable.patientId, patientsTable.id))
        .where(whereClause)
        .orderBy(desc(sessionsTable.createdAt))
        .limit(perPage)
        .offset(offset),

      db
        .select({ total: count() })
        .from(sessionsTable)
        .innerJoin(patientsTable, eq(sessionsTable.patientId, patientsTable.id))
        .where(whereClause),
    ])

    return {
      sessions,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    }
  }

  public async getTotalByApplicatorId(
    applicatorId: string
  ): Promise<SelectTotalOfSessionsSchema> {
    const startDateOfMonth = startOfMonth(new Date())

    const [{ thisMonth, totalOfSessions }] = await db
      .select({
        totalOfSessions: count(),
        thisMonth: count(
          sql`CASE WHEN ${gte(
            sessionsTable.createdAt,
            startDateOfMonth
          )} THEN 1 END`
        ),
      })
      .from(sessionsTable)
      .where(eq(sessionsTable.applicatorId, applicatorId))

    return {
      totalOfSessions,
      thisMonth,
    }
  }

  public async getAverageByApplicatorId(
    applicatorId: string
  ): Promise<SelectAverageByApplicatorIdSchema> {
    const rows = await db
      .select({
        skill: sessionsTable.skill,
        average: sql<number>`avg(${sessionsTable.thetaFinal})`.mapWith(Number),
      })
      .from(sessionsTable)
      .where(eq(sessionsTable.applicatorId, applicatorId))
      .groupBy(sessionsTable.skill)

    const bySkill = new Map(rows.map((r) => [r.skill, r.average]))

    console.log({
      rows,
      bySkill,
    })

    return {
      alliteration: bySkill.get('alliteration') ?? null,
      segmentation: bySkill.get('segmentation') ?? null,
      visualMemory: bySkill.get('visualMemory') ?? null,
      rhyme: bySkill.get('rhyme') ?? null,
    }
  }

  public async getLatestByPatientId(
    patientId: string,
    applicatorId: string
  ): Promise<SelectLatestByPatientIdSchema> {
    const rows = await db
      .select()
      .from(sessionsTable)
      .where(
        and(
          eq(sessionsTable.patientId, patientId),
          eq(sessionsTable.applicatorId, applicatorId)
        )
      )
      .orderBy(desc(sessionsTable.createdAt))

    const latestBySkill = new Map<string, SelectSessionSchema>()

    for (const session of rows) {
      if (!latestBySkill.has(session.skill)) {
        latestBySkill.set(session.skill, session)
      }
    }

    return {
      alliteration: latestBySkill.get('alliteration') ?? null,
      segmentation: latestBySkill.get('segmentation') ?? null,
      visualMemory: latestBySkill.get('visualMemory') ?? null,
      rhyme: latestBySkill.get('rhyme') ?? null,
    }
  }

  public async save(session: SaveSessionSchema): Promise<SelectSessionSchema> {
    if (session.id) {
      const [raw] = await db
        .update(sessionsTable)
        .set(session)
        .where(eq(sessionsTable.id, session.id))
        .returning()

      return raw
    }

    const [raw] = await db.insert(sessionsTable).values(session).returning()

    return raw
  }
}
