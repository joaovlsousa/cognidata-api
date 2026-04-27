import { eq } from 'drizzle-orm'
import type {
  SaveUserSchema,
  SelectUserSchema,
  UsersRepository,
} from '@/database/repositories/users-repository'
import { db } from '..'
import { usersTable } from '../schema'

export class DrizzleUsersRepository implements UsersRepository {
  public async getById(userId: string): Promise<SelectUserSchema | null> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1)

    return user ?? null
  }

  public async getByEmail(email: string): Promise<SelectUserSchema | null> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1)

    return user ?? null
  }

  public async save(user: SaveUserSchema): Promise<SelectUserSchema> {
    if (user.id) {
      const [raw] = await db
        .update(usersTable)
        .set(user)
        .where(eq(usersTable.id, user.id))
        .returning()

      return raw
    }

    const [raw] = await db.insert(usersTable).values(user).returning()

    return raw
  }
}
