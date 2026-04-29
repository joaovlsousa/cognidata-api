import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '.'
import { usersTable } from './schema'

async function seed() {
  const email = 'user.master@email.com'
  const password = await bcrypt.hash('master.password', 10)

  await db.delete(usersTable).where(eq(usersTable.email, email))

  await db.insert(usersTable).values({
    name: 'Master User',
    email,
    password,
  })
}

seed()
