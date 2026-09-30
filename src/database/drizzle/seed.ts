import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '.'
import { usersTable } from './schemas'

async function seed() {
  try {
    console.log('Seeding database...')

    const email = 'user.admin@servidor.uepb.edu.br'
    const password = await bcrypt.hash('123456', 10)

    await db.delete(usersTable).where(eq(usersTable.email, email))

    await db.insert(usersTable).values({
      name: 'Admin User',
      role: 'admin',
      isActive: true,
      email,
      password,
    })

    console.log('Database seeded')

    process.exit(0)
  } catch (error) {
    console.error('Error on seeding database: ', error)

    process.exit(-1)
  }
}

seed()
