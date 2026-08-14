import { NotFoundError } from '@/core/errors/not-found-error'
import type { UsersRepository } from '@/database/repositories/users-repository'
import type { UpdateApplicatorUserDto } from '@/dtos/users/update-applicator-user-dto'

export class UpdateApplicatorUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async execute(
    userId: string,
    applicatorDto: UpdateApplicatorUserDto
  ): Promise<void> {
    const user = await this.usersRepository.getById(userId)

    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }

    user.name = applicatorDto.name

    await this.usersRepository.save(user)
  }
}
