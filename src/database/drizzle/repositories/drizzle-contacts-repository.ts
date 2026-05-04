import { eq } from 'drizzle-orm'
import type {
  ContactsRepository,
  FiltersContactSchema,
  SaveContactSchema,
  SelectContactSchema,
} from '@/database/repositories/contacts-repository'
import { db } from '..'
import { contactsTable } from '../schema'

export class DrizzleContactsRepository implements ContactsRepository {
  public async getById(contactId: string): Promise<SelectContactSchema | null> {
    const [contact] = await db
      .select()
      .from(contactsTable)
      .where(eq(contactsTable.id, contactId))
      .limit(1)

    return contact ?? null
  }

  public async closeById(contactId: string): Promise<void> {
    await db
      .update(contactsTable)
      .set({
        status: 'closed',
      })
      .where(eq(contactsTable.id, contactId))
  }

  public async getAll(
    filters?: FiltersContactSchema
  ): Promise<SelectContactSchema[]> {
    const contacts = await db
      .select()
      .from(contactsTable)
      .where(
        filters?.status ? eq(contactsTable.status, filters.status) : undefined
      )

    return contacts
  }

  public async save(contact: SaveContactSchema): Promise<SelectContactSchema> {
    if (contact.id) {
      const [raw] = await db
        .update(contactsTable)
        .set(contact)
        .where(eq(contactsTable.id, contact.id))
        .returning()

      return raw
    }

    const [raw] = await db.insert(contactsTable).values(contact).returning()

    return raw
  }
}
