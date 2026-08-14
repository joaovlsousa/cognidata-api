import { NotFoundError } from '@/core/errors/not-found-error'
import type { ContactsRepository } from '@/database/repositories/contacts-repository'

export class CloseContactByIdUseCase {
  constructor(private readonly contactsRepository: ContactsRepository) {}

  public async execute(contactId: string): Promise<void> {
    const contact = await this.contactsRepository.getById(contactId)

    if (!contact) {
      throw new NotFoundError('Contato não encontrado.')
    }

    await this.contactsRepository.closeById(contactId)
  }
}
