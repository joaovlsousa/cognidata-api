import type { ContactsRepository } from '@/database/repositories/contacts-repository'
import type { CreateContactDto } from '@/dtos/contacts/create-contact-dto'

export class ContactsService {
  constructor(private readonly contactsRepository: ContactsRepository) {}

  public async create(contactDto: CreateContactDto): Promise<void> {
    await this.contactsRepository.save({
      name: contactDto.name,
      email: contactDto.email,
      subject: contactDto.subject,
      message: contactDto.message,
    })
  }
}
