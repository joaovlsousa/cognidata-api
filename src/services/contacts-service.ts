import { NotFoundError } from '@/core/errors/not-found-error'
import type { ContactsRepository } from '@/database/repositories/contacts-repository'
import type { CreateContactDto } from '@/dtos/contacts/create-contact-dto'
import type { GetContactByIdDto } from '@/dtos/contacts/get-contact-by-id-dto'

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

  public async getById(contactId: string): Promise<GetContactByIdDto> {
    const contact = await this.contactsRepository.getById(contactId)

    if (!contact) {
      throw new NotFoundError('Contato não encontrado.')
    }

    return {
      contact,
    }
  }
}
