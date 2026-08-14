import { NotFoundError } from '@/core/errors/not-found-error'
import type { UsersRepository } from '@/database/repositories/users-repository'

export class ActivateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async execute(userId: string): Promise<void> {
    const user = await this.usersRepository.getById(userId)

    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }

    user.isActive = true
    await this.usersRepository.save(user)
  }
}
