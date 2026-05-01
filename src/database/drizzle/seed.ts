import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '.'
import { usersTable } from './schema'

async function seed() {
  try {
    console.log('Seeding database...')

    const email = 'user.master@email.com'
    const password = await bcrypt.hash('master.password', 10)

    await db.delete(usersTable).where(eq(usersTable.email, email))

    await db.insert(usersTable).values({
      name: 'Master User',
      email,
      password,
      role: 'master',
    })

    console.log('Database seeded')

    process.exit(0)
  } catch (error) {
    console.error('Error on seeding database: ', error)

    process.exit(-1)
  }
}

seed()
