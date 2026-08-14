import { NotFoundError } from '@/core/errors/not-found-error'
import type { ContactsRepository } from '@/database/repositories/contacts-repository'
import type { GetContactByIdDto } from '@/dtos/contacts/get-contact-by-id-dto'

export class GetContactByIdUseCase {
  constructor(private readonly contactsRepository: ContactsRepository) {}

  public async execute(contactId: string): Promise<GetContactByIdDto> {
    const contact = await this.contactsRepository.getById(contactId)

    if (!contact) {
      throw new NotFoundError('Contato não encontrado.')
    }

    return {
      contact,
    }
  }
}
