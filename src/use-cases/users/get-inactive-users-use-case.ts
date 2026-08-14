import type { UsersRepository } from '@/database/repositories/users-repository'
import type { GetUsersDto } from '@/dtos/users/get-users-dto'

export class GetInactiveUsersUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async execute(): Promise<GetUsersDto> {
    const users = await this.usersRepository.getAllInactive()

    return {
      users,
    }
  }
}
