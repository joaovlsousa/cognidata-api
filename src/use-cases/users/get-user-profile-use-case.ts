import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import type { UsersRepository } from '@/database/repositories/users-repository'
import type { GetUserDto } from '@/dtos/users/get-user-dto'

export class GetUserProfileUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async execute(userId: string): Promise<GetUserDto> {
    const user = await this.usersRepository.getById(userId)

    if (!user) {
      throw new UnauthorizedError()
    }

    return {
      user,
    }
  }
}
