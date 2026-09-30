import { eq } from 'drizzle-orm'
import type {
  SaveSessionSchema,
  SelectSessionSchema,
  SessionsRepository,
} from '@/database/repositories/sessions-repository'
import { db } from '..'
import { sessionsTable } from '../schemas'

export class DrizzleSessionsRepository implements SessionsRepository {
  public async getById(sessionId: string): Promise<SelectSessionSchema | null> {
    const [session] = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.id, sessionId))
      .limit(1)

    return session ?? null
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
