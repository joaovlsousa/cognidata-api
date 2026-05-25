import { eq } from 'drizzle-orm'
import type {
  SaveSessionItemsSchema,
  SelectSessionItemsSchema,
  SessionItemsRepository,
} from '@/database/repositories/session-items-repository'
import { db } from '..'
import { sessionItemsTable } from '../schema'

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
}
