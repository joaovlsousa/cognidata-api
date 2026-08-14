import type {
  ContactsRepository,
  FiltersContactSchema,
} from '@/database/repositories/contacts-repository'
import type { GetContactsDto } from '@/dtos/contacts/get-contacts-dto'

export class GetContactsUseCase {
  constructor(private readonly contactsRepository: ContactsRepository) {}

  public async execute(
    filters?: FiltersContactSchema
  ): Promise<GetContactsDto> {
    const contacts = await this.contactsRepository.getAll(filters)

    return {
      contacts,
    }
  }
}
