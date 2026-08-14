import type { ContactsRepository } from '@/database/repositories/contacts-repository'
import type { CreateContactDto } from '@/dtos/contacts/create-contact-dto'

export class CreateContactUseCase {
  constructor(private readonly contactsRepository: ContactsRepository) {}

  public async execute(contactDto: CreateContactDto): Promise<void> {
    await this.contactsRepository.save({
      name: contactDto.name,
      email: contactDto.email,
      subject: contactDto.subject,
      message: contactDto.message,
    })
  }
}
